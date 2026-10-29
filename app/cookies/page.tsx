import Link from "next/link";

export default function CookiesPage() {
  return (
    <main className="legal-page">
      <Link href="/" className="legal-back">← Volver a Base12 Academy</Link>
      <h1>Política de cookies</h1>
      <p>Esta política explica qué son las cookies y cómo se utilizan en Base12 Academy. Las cookies son pequeños archivos que una web puede almacenar en el dispositivo para recordar información o permitir determinadas funciones.</p>

      <h2>Cookies necesarias</h2>
      <p>La web puede utilizar cookies técnicas imprescindibles para la autenticación, la seguridad, la conservación de la sesión, el funcionamiento del aula y las preferencias solicitadas por el usuario. Estas cookies no se utilizan para publicidad y pueden instalarse sin consentimiento cuando sean estrictamente necesarias.</p>

      <h2>Cookies opcionales</h2>
      <p>Las cookies de análisis, personalización no esencial o publicidad solo se activarán después de que el usuario las acepte cuando el consentimiento sea exigible. El panel permite aceptar o rechazar la medición publicitaria con opciones equivalentes. Puedes modificar la elección desde «Configurar cookies». No se activa publicidad personalizada.</p>

      <h2>Información por proveedor</h2>
      <p>Google Ads (Google Ireland Limited): solo si aceptas la medición publicitaria, permite relacionar los clics en nuestros anuncios con compras confirmadas. Puede utilizar cookies propias con prefijo _gcl_ e identificadores publicitarios; configuramos una duración de hasta 90 días. Se comunica el importe, la moneda y una referencia del pedido sin nombres ni correos electrónicos. La etiqueta permanece bloqueada hasta la aceptación. La elección se guarda en el navegador durante 180 días.</p>

      <p>Consulta los detalles actualizados del proveedor en <a href="https://business.safety.google/adscookies/">Cookies de los productos publicitarios de Google</a> y <a href="https://policies.google.com/technologies/partner-sites">Cómo utiliza Google la información de sitios colaboradores</a>. Google puede tratar información fuera del Espacio Económico Europeo conforme a sus mecanismos de transferencia aplicables.</p>

      <h2>Cómo cambiar la elección</h2>
      <p>El usuario podrá retirar o modificar su consentimiento desde el panel de configuración de cookies. También puede bloquear o eliminar cookies desde el navegador, aunque desactivar las técnicas puede impedir que algunas funciones operen correctamente.</p>

      <h2>Contacto</h2>
      <p>Las consultas sobre privacidad y cookies pueden enviarse a <a href="mailto:base12academy+privacidad@gmail.com">base12academy+privacidad@gmail.com</a>.</p>
      <p><strong>Última actualización:</strong> 29 de octubre de 2026.</p>
    </main>
  );
}
