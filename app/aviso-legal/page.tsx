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
    </main>
  );
}
