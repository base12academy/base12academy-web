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
    document: { referrer: 'https://www.base12academy.es/alta?token=SECRET', cookie: '', createElement: () => ({}), head: { appendChild: s => scripts.push(s) } },
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
