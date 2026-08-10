import Link from "next/link";

export default function AvisoLegal() {
  return (
    <main className="legal-page">
      <Link href="/" className="legal-back">← Volver a Base12 Academy</Link>
      <h1>Aviso legal</h1>
      <p>En cumplimiento de la normativa aplicable, se informa de los datos del titular de este sitio web:</p>
      <p><strong>Titular:</strong> Imagen Digital Ménace, S. L. U.</p>
      <p><strong>CIF:</strong> B21746086</p>
      <p><strong>Domicilio:</strong> Calle Lanuza, 8 · 29009 Málaga</p>
      <p><strong>Correo electrónico:</strong> base12academy@gmail.com</p>
      <h2>Actividad</h2>
      <p>Plataforma online de formación para Bachillerato y PAU, preparación de oposiciones y cursos online especializados.</p>
      <p>El acceso y uso de esta web atribuye la condición de usuario e implica la aceptación de las condiciones publicadas.</p>
      <h2>Normas de uso</h2>
      <p>El usuario se compromete a utilizar la web, el aula y sus servicios de forma lícita, diligente y conforme a la buena fe. Queda prohibido intentar acceder a cuentas ajenas, eludir medidas de seguridad, introducir código malicioso, dañar los sistemas o utilizar la plataforma para comunicaciones no solicitadas.</p>
      <h2>Propiedad intelectual</h2>
      <p>Los vídeos, textos, audios, exámenes, plantillas, marcas y demás materiales son titularidad de Imagen Digital Ménace, S. L. U. o de sus licenciantes. No se permite su reproducción, distribución, transformación, comunicación pública o explotación sin autorización previa, salvo los usos legalmente permitidos.</p>
      <h2>Disponibilidad y enlaces externos</h2>
      <p>Base12 adopta medidas razonables para mantener el servicio disponible y seguro, aunque pueden producirse interrupciones por mantenimiento o causas ajenas. Los enlaces a sitios de terceros se facilitan como referencia; Base12 no controla sus contenidos, políticas ni disponibilidad.</p>
      <h2>Legislación y jurisdicción</h2>
      <p>La relación se rige por la legislación española. Cuando el usuario sea consumidor, cualquier controversia se someterá a los juzgados y tribunales que resulten competentes conforme a la normativa de protección de consumidores.</p>
    </main>
  );
}
