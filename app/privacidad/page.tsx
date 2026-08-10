import Link from "next/link";

export default function PrivacidadPage() {
  return (
    <main className="legal-page">
      <Link href="/" className="legal-back">← Volver a Base12 Academy</Link>
      <h1>Política de privacidad</h1>
      <p><strong>Responsable:</strong> Imagen Digital Ménace, S. L. U. · CIF B21746086 · Calle Lanuza, 8, 29009 Málaga · base12academy@gmail.com.</p>
      <h2>Finalidad y legitimación</h2>
      <p>Los datos se tratarán para atender consultas, gestionar la matrícula, los pagos, el acceso a la formación, el seguimiento académico y, cuando corresponda, la expedición y envío del certificado. La base jurídica es la ejecución del contrato, el consentimiento y el cumplimiento de obligaciones legales.</p>
      <h2>Asistentes de inteligencia artificial</h2>
      <p>La experiencia formativa puede incluir asistentes IA para orientar, explicar y acompañar el aprendizaje. Estos asistentes no sustituyen el trabajo del alumno ni certifican por sí solos la adquisición de competencias. Cuando su uso implique tratamiento de datos personales, se informará de forma específica y se aplicarán las bases jurídicas y garantías correspondientes.</p>
      <h2>Conservación y destinatarios</h2>
      <p>Los datos se conservarán durante la prestación del servicio y los plazos legales aplicables. Solo se comunicarán a proveedores necesarios para prestar el servicio o por obligación legal.</p>
      <h2>Derechos</h2>
      <p>Puede solicitar el acceso, rectificación, supresión, oposición, limitación o portabilidad escribiendo a base12academy@gmail.com. También puede reclamar ante la Agencia Española de Protección de Datos.</p>
    </main>
  );
}
