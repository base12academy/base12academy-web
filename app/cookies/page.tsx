import Link from "next/link";

export default function CookiesPage() {
  return (
    <main className="legal-page">
      <Link href="/" className="legal-back">← Volver a Base12 Academy</Link>
      <h1>Política de cookies</h1>
      <p>Este sitio puede utilizar cookies técnicas necesarias para su funcionamiento y, previo consentimiento cuando sea exigible, cookies de análisis o personalización.</p>
      <p>Las cookies son pequeños archivos que se almacenan en el dispositivo del usuario. Puede bloquearlas o eliminarlas desde la configuración de su navegador, aunque desactivar las técnicas puede impedir que algunas funciones operen correctamente.</p>
      <p>Cuando se incorporen herramientas de medición o publicidad, el panel de consentimiento identificará su finalidad y permitirá aceptar, rechazar o configurar las cookies no necesarias.</p>
      <h2>Tipos de cookies</h2>
      <p>Las cookies técnicas permiten funciones esenciales como la autenticación, la seguridad, la conservación de la sesión y las preferencias necesarias. Las cookies de análisis, personalización o publicidad solo se activarán cuando exista la base jurídica o el consentimiento exigible.</p>
      <h2>Gestión del consentimiento</h2>
      <p>El usuario podrá aceptar, rechazar o modificar sus preferencias desde el panel de consentimiento disponible en la web. La retirada del consentimiento será tan sencilla como su otorgamiento y no afectará a la licitud del tratamiento anterior.</p>
      <h2>Proveedores y actualización</h2>
      <p>El panel mostrará, cuando proceda, la identidad de los proveedores, la finalidad y duración de las cookies utilizadas. Esta política se actualizará cuando cambien las herramientas o finalidades aplicadas en el sitio.</p>
    </main>
  );
}
