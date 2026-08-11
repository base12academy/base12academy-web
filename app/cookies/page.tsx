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
      <p>Las cookies de análisis, personalización no esencial o publicidad solo se activarán después de que el usuario las acepte cuando el consentimiento sea exigible. El panel permitirá aceptar, rechazar o configurar las categorías no necesarias con opciones equivalentes y sin casillas premarcadas.</p>

      <h2>Información por proveedor</h2>
      <p>Cuando se activen herramientas opcionales, el panel de configuración identificará su proveedor, finalidad, duración y si intervienen terceros. Esta relación se actualizará cuando cambien las herramientas realmente utilizadas; no se declararán proveedores que no estén activos.</p>

      <h2>Cómo cambiar la elección</h2>
      <p>El usuario podrá retirar o modificar su consentimiento desde el panel de configuración de cookies. También puede bloquear o eliminar cookies desde el navegador, aunque desactivar las técnicas puede impedir que algunas funciones operen correctamente.</p>

      <h2>Contacto</h2>
      <p>Las consultas sobre privacidad y cookies pueden enviarse a <a href="mailto:base12academy+privacidad@gmail.com">base12academy+privacidad@gmail.com</a>.</p>
      <p><strong>Última actualización:</strong> 11 de agosto de 2026.</p>
    </main>
  );
}
