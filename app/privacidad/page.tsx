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
      <h2>Infraestructura y proveedores</h2>
      <p>La plataforma utiliza proveedores tecnológicos necesarios para prestar el servicio, entre ellos Supabase para funciones de autenticación y base de datos. Estos proveedores actúan, cuando corresponda, como encargados del tratamiento. Las transferencias internacionales de datos que puedan producirse estarán sujetas a las garantías exigidas por la normativa aplicable.</p>
      <h2>Comunicaciones automatizadas</h2>
      <p>Base12 podrá enviar avisos académicos y operativos relacionados con el curso mediante correo electrónico y, cuando el alumno facilite o active esos canales, WhatsApp o Telegram. Estas comunicaciones forman parte de la gestión del servicio. Las novedades, promociones y ofertas solo se enviarán con consentimiento previo o cuando exista otra base jurídica aplicable, y podrán cancelarse en cualquier momento.</p>
      <h2>Conservación y destinatarios</h2>
      <p>Los datos de alumnos se conservarán durante la relación contractual y, después, durante los plazos necesarios para atender obligaciones fiscales, legales y posibles responsabilidades. Los datos utilizados con fines comerciales se conservarán hasta que el interesado retire su consentimiento o solicite su supresión. Solo se comunicarán a proveedores necesarios para prestar el servicio o por obligación legal.</p>
      <h2>Derechos</h2>
      <p>Puede solicitar gratuitamente el acceso, rectificación, supresión, oposición, limitación o portabilidad, y retirar los consentimientos prestados, escribiendo a base12academy@gmail.com e indicando «Ejercicio de derechos de protección de datos». Podrá solicitarse información necesaria para comprobar la identidad. También puede reclamar ante la Agencia Española de Protección de Datos.</p>
    </main>
  );
}
