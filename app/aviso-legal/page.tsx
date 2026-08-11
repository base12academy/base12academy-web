import Link from "next/link";

export default function AvisoLegal() {
  return (
    <main className="legal-page">
      <Link href="/" className="legal-back">← Volver a Base12 Academy</Link>
      <h1>Aviso legal y condiciones de uso</h1>
      <p>En cumplimiento de la normativa sobre servicios de la sociedad de la información, se facilitan los datos que permiten identificar y contactar de forma directa con el titular del sitio.</p>

      <h2>1. Titular</h2>
      <p><strong>Denominación:</strong> Imagen Digital Ménace, S. L. U.</p>
      <p><strong>CIF:</strong> B21746086</p>
      <p><strong>Domicilio:</strong> Calle Lanuza, 8 · 29009 Málaga</p>
      <p><strong>Correo general:</strong> <a href="mailto:base12academy@gmail.com">base12academy@gmail.com</a></p>

      <h2>2. Actividad y condiciones aplicables</h2>
      <p>Base12 Academy es una plataforma online de formación para Bachillerato y PAU, preparación de oposiciones y cursos especializados. El acceso a la web implica la aceptación de estas normas de uso. La compra de un curso se rige además por las <Link href="/terminos-contratacion">Condiciones generales de contratación</Link> y por la información particular mostrada antes del pago.</p>

      <h2>3. Uso permitido</h2>
      <p>El usuario se compromete a utilizar la web, el aula y sus servicios de forma lícita, diligente y conforme a la buena fe. Queda prohibido acceder a cuentas ajenas, compartir credenciales, eludir medidas de seguridad, introducir código malicioso, dañar sistemas, extraer contenidos de forma automatizada no autorizada o utilizar la plataforma para comunicaciones no solicitadas.</p>

      <h2>4. Propiedad intelectual e industrial</h2>
      <p>Los vídeos, textos, audios, exámenes, cuestionarios, plantillas, diseños, marcas y demás materiales son titularidad de Imagen Digital Ménace, S. L. U. o de sus licenciantes. El acceso no transmite derechos de explotación. No se permite su reproducción, distribución, transformación, comunicación pública, reventa o puesta a disposición de terceros sin autorización, salvo los usos legalmente permitidos.</p>

      <h2>5. Contenidos educativos y fuentes oficiales</h2>
      <p>Base12 revisa sus contenidos y procura mantenerlos actualizados, pero las convocatorias, temarios oficiales, plazos, requisitos y normas pueden cambiar. El usuario debe contrastar las decisiones que dependan de ellos con la publicación oficial vigente. Las respuestas de asistentes de inteligencia artificial son apoyo educativo y pueden requerir verificación.</p>

      <h2>6. Disponibilidad y responsabilidad</h2>
      <p>Base12 adopta medidas razonables para mantener el servicio disponible y seguro. Pueden producirse interrupciones por mantenimiento, actualizaciones, fallos de proveedores o causas ajenas. Esta limitación no excluye las responsabilidades que legalmente no puedan limitarse ni los derechos del consumidor por falta de conformidad del servicio contratado.</p>

      <h2>7. Enlaces y servicios de terceros</h2>
      <p>Los enlaces externos y las herramientas de terceros se facilitan para prestar funciones o como referencia. Cada tercero aplica sus propias condiciones y políticas. Base12 no controla contenidos ajenos, sin perjuicio de las responsabilidades que legalmente correspondan.</p>

      <h2>8. Comunicaciones</h2>
      <p>Las consultas generales pueden dirigirse a <a href="mailto:base12academy@gmail.com">base12academy@gmail.com</a>. Para agilizar la atención existen canales específicos de Secretaría, Facturación, Soporte, Comercial, Privacidad y Dirección, descritos en las páginas correspondientes.</p>

      <h2>9. Legislación y jurisdicción</h2>
      <p>La relación se rige por la legislación española. Cuando el usuario sea consumidor, cualquier controversia se someterá a los juzgados y tribunales competentes conforme a la normativa de protección de consumidores.</p>
      <p><strong>Última actualización:</strong> 11 de agosto de 2026.</p>
    </main>
  );
}
