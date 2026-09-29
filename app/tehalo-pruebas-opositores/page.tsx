import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import TehaloConfigurator from "@/components/tehalo-opositores/TehaloConfigurator";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Tehalo Pruebas Opositores",
  description: "Temario, explicaciones, test y simulacros personalizados para tu oposición.",
  alternates: { canonical: "/tehalo-pruebas-opositores" },
};

export default function TehaloPruebasOpositoresPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.back}>← Base12 Academy</Link>
        <span>Tehalo Pruebas Opositores</span>
      </header>

      <main>
        <section className={styles.hero}>
          <Image
            src="/images/tehalo/tehalo-pruebas-opositores.png"
            alt="Tehalo Pruebas"
            width={2048}
            height={768}
            priority
          />
          <p className={styles.eyebrow}>Tu oposición personalizada</p>
          <h1>En menos de 24 h diseñamos, personalizamos y adaptamos el curso a tu oposición.</h1>
          <p className={styles.intro}>
            Partimos de una convocatoria oficial para definir el temario, las explicaciones,
            los test y los simulacros que realmente necesitas.
          </p>
          <a href="#personalizar" className={styles.primary}>Personalizar una oposición</a>
          <p className={styles.delivery}>El plazo se cuenta desde la contratación y no incluye sábados, domingos ni festivos.</p>
        </section>

        <section className={styles.assurances} aria-label="Cómo funciona Tehalo">
          <article>
            <span>01</span>
            <h2>Fuente oficial</h2>
            <p>Localizamos la convocatoria vigente o, con tu autorización, la última convocatoria oficial disponible.</p>
          </article>
          <article>
            <span>02</span>
            <h2>Propuesta supervisada</h2>
            <p>Te indicamos qué contenido se reutiliza, qué se adapta y qué debe crearse para tu oposición.</p>
          </article>
          <article>
            <span>03</span>
            <h2>Presupuesto por correo</h2>
            <p>Recibirás el precio final y el plazo. La posibilidad de pagar mediante Redsys solo aparecerá en ese correo.</p>
          </article>
        </section>

        <TehaloConfigurator />

        <section className={styles.resources}>
          <div>
            <p className={styles.eyebrow}>Material de apoyo</p>
            <h2>Rocío y el Glosario forman parte de la experiencia</h2>
          </div>
          <article>
            <h3>Rocío · Asistente IA</h3>
            <p>Te acompaña para comprender conceptos, relacionar normas y trabajar las dudas del temario personalizado.</p>
          </article>
          <article>
            <h3>Glosario visible</h3>
            <p>Un recurso de entrada para dominar el vocabulario de la convocatoria y comprobar la calidad del contenido.</p>
          </article>
          <article>
            <h3>Actualización incluida</h3>
            <p>Si cambia la convocatoria o la legislación aplicable a la misma oposición, actualizamos los contenidos afectados mediante una adenda.</p>
          </article>
        </section>
      </main>

      <footer className={styles.footer}>
        <p><strong>Tehalo Pruebas Opositores</strong> · Una aplicación de Editorial EC Libros, S. L.</p>
        <p>Los cobros y la facturación al cliente son realizados por Imagen Digital Ménace, S. L. U.</p>
        <nav><Link href="/privacidad">Privacidad</Link><Link href="/aviso-legal">Aviso legal</Link><Link href="/terminos-contratacion">Contratación</Link></nav>
      </footer>
    </div>
  );
}
