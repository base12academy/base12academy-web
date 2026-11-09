import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function setup() {
  const values = new Map();
  const scripts = [];
  let reloads = 0;
  const context = {
    exports: {}, Date, URL, Set, Number, JSON,
    localStorage: { getItem: k => values.get(k) ?? null, setItem: (k,v) => values.set(k,v) },
    window: { location: { href: 'https://www.base12academy.es/pago-ok?checkout=SECRET', hostname: 'www.base12academy.es', reload: () => reloads++ } },
    document: { referrer: 'https://www.base12academy.es/alta?token=SECRET', cookie: '', querySelector: selector => scripts.find(s => selector.includes(s.dataset?.base12Gtm ?? 'no-match')), createElement: () => ({ dataset: {} }), head: { appendChild: s => scripts.push(s) } },
  };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(new URL('../lib/google-ads.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, context);
  return { api: context.exports, context, values, scripts, reloads: () => reloads, events: () => (context.window.dataLayer ?? []).map(x => Array.from(x)) };
}

test('no tag or events before consent, including a confirmed purchase', () => {
  const s = setup();
  s.api.startAdMeasurement();
  s.api.reportConfirmedPurchase({ transactionId: '12345', amountCents: 2999 });
  assert.equal(s.scripts.length, 0);
  assert.equal(s.events().length, 0);
  s.api.saveAdConsent(false);
  assert.equal(s.scripts.length, 0);
});

test('acceptance sends real amount once, strips URL secrets and blocks personalization', () => {
  const s = setup();
  s.api.reportConfirmedPurchase({ transactionId: '12345', amountCents: 2999 });
  s.api.saveAdConsent(true);
  s.api.reportConfirmedPurchase({ transactionId: '12345', amountCents: 2999 });
  assert.equal(s.scripts.length, 1);
  const conversions = s.events().filter(e => e[0] === 'event');
  assert.equal(conversions.length, 1);
  assert.equal(conversions[0][2].value, 29.99);
  assert.equal(conversions[0][2].transaction_id, '12345');
  assert.equal(conversions[0][2].currency, 'EUR');
  assert.equal(conversions[0][2].page_location, 'https://www.base12academy.es/pago-ok');
  assert.ok(!JSON.stringify(s.events()).includes('SECRET'));
  assert.equal(s.events().find(e => e[0] === 'consent' && e[1] === 'update')[2].ad_personalization, 'denied');
});

test('invalid receipts are ignored and distinct purchases remain distinct', () => {
  const s = setup();
  s.api.saveAdConsent(true);
  for (const receipt of [{transactionId:'',amountCents:100}, {transactionId:'x',amountCents:NaN}, {transactionId:'x',amountCents:-5}]) s.api.reportConfirmedPurchase(receipt);
  assert.equal(s.events().filter(e => e[0] === 'event').length, 0);
  s.api.reportConfirmedPurchase({transactionId:'1',amountCents:100});
  s.api.reportConfirmedPurchase({transactionId:'2',amountCents:200});
  assert.equal(s.events().filter(e => e[0] === 'event').length, 2);
});

test('expired or malformed consent does not activate tracking; withdrawal unloads tag', () => {
  const s = setup();
  s.values.set(s.api.CONSENT_KEY, JSON.stringify({accepted:true,at:Date.now() - 181 * 86400000}));
  assert.equal(s.api.readAdConsent(), null);
  s.api.startAdMeasurement();
  assert.equal(s.scripts.length, 0);
  s.values.set(s.api.CONSENT_KEY, 'broken');
  assert.equal(s.api.readAdConsent(), null);
  s.api.saveAdConsent(true);
  s.api.saveAdConsent(false);
  assert.equal(s.api.readAdConsent(), false);
  assert.equal(s.reloads(), 1);
});


test('legacy advertising acceptance does not grant analytics consent', () => {
  const s = setup();
  s.values.set(s.api.CONSENT_KEY, JSON.stringify({accepted:true,at:Date.now()}));
  assert.equal(s.api.readMeasurementConsent().analytics, false);
  assert.equal(s.api.readMeasurementConsent().ads, true);
  s.api.startGoogleMeasurement();
  assert.equal(s.scripts.length, 1);
  assert.ok(s.scripts[0].src.includes('gtag/js?id=AW-'));
  assert.equal(s.events().find(e => e[0] === 'consent' && e[1] === 'update')[2].analytics_storage, 'denied');
});

test('analytics-only acceptance loads GTM once and never reports advertising conversions', () => {
  const s = setup();
  s.api.saveMeasurementConsent({analytics:true,ads:false});
  s.api.startGoogleMeasurement();
  s.api.startGoogleMeasurement();
  s.api.reportConfirmedPurchase({transactionId:'analytics-only',amountCents:100});
  assert.equal(s.scripts.length, 1);
  assert.equal(s.scripts[0].dataset.base12Gtm, s.api.GTM_ID);
  assert.equal(s.events().filter(e => e[0] === 'event').length, 0);
  const update=s.events().find(e=>e[0]==='consent'&&e[1]==='update')[2];
  assert.equal(update.analytics_storage, 'granted');
  assert.equal(update.ad_storage, 'denied');
  assert.equal(update.ad_user_data, 'denied');
});

test('explicit acceptance of both purposes loads analytics and advertising independently', () => {
  const s = setup();
  s.api.saveMeasurementConsent({analytics:true,ads:true});
  s.api.startGoogleMeasurement();
  assert.equal(s.scripts.length, 2);
  assert.equal(s.scripts.filter(x=>x.dataset.base12Gtm===s.api.GTM_ID).length,1);
  assert.equal(s.scripts.filter(x=>x.src.includes('/gtag/js?')).length,1);
});

test('legacy ad changes preserve explicit analytics consent', () => {
  const s=setup();
  s.api.saveMeasurementConsent({analytics:true,ads:false});
  s.api.saveAdConsent(true);
  assert.equal(s.api.readMeasurementConsent().analytics,true);
  assert.equal(s.api.readMeasurementConsent().ads,true);
  s.api.saveAdConsent(false);
  assert.equal(s.api.readMeasurementConsent().analytics,true);
  assert.equal(s.api.readMeasurementConsent().ads,false);
});

test('rejection loads no scripts and revocation clears optional cookies', () => {
  const s=setup();
  s.api.saveMeasurementConsent({analytics:false,ads:false});
  s.api.startGoogleMeasurement();
  assert.equal(s.scripts.length,0);
  const accepted=setup();
  accepted.api.saveMeasurementConsent({analytics:true,ads:true});
  accepted.api.startGoogleMeasurement();
  accepted.context.document.cookie='_ga=example; _ga_TEST=example; _gcl_au=example';
  accepted.api.saveMeasurementConsent({analytics:false,ads:false});
  assert.equal(accepted.reloads(),1);
  assert.equal(accepted.api.readAdConsent(),false);
});

test('blocked storage fails closed and does not load tags', () => {
  const s=setup();
  s.context.localStorage.getItem=()=>{throw Error('blocked')};
  s.context.localStorage.setItem=()=>{throw Error('blocked')};
  assert.equal(s.api.readMeasurementConsent(),null);
  assert.equal(s.api.saveMeasurementConsent({analytics:true,ads:true}),false);
  s.api.startGoogleMeasurement();
  assert.equal(s.scripts.length,0);
});
