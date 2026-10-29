import Link from "next/link";
import Image from "next/image";
import LeadChatBot from "@/components/LeadChatBot";
import CourseCatalog from "@/components/CourseCatalog";
import PwaInstallButton from "@/components/PwaInstallButton";
import AdminHeaderLink from "@/components/AdminHeaderLink";
import HomeCatalogLink from "@/components/HomeCatalogLink";
import HomeMobileMenu from "@/components/HomeMobileMenu";
import styles from "./home.module.css";

const formation = [
  { family: "oposiciones", title: "Oposiciones", text: "Preparación organizada por oposición y convocatoria.", action: "Ver oposiciones", icon: "01" },
  { family: "bachillerato", title: "Bachillerato y PAU", text: "Comprende tu asignatura y prepara la prueba.", action: "Ver asignaturas", icon: "02" },
  { family: "clases", title: "Clases online", text: "Historia y Filosofía con profesor. Otras materias según disponibilidad.", action: "Consultar clases", icon: "03" },
  { family: "tropa", title: "Tropa y Marinería", text: "Entrenamiento psicotécnico y preparación física.", action: "Ver preparación", icon: "04" },
  { family: "cursos", title: "Cursos online", text: "Competencias digitales, protocolo y desarrollo profesional.", action: "Explorar cursos", icon: "05" },
];

const apps = [
  { name: "Banco de Opositores", text: "Consulta convocatorias oficiales y configura tus alertas.", href: "/banco-opositores", image: "/images/banco-opositores/logo-banco-opositores.png", action: "Buscar convocatorias" },
  { name: "Base12 App", text: "Accede a tu formación y continúa donde lo dejaste.", href: "/login", image: "/images/base12-logo.png", action: "Entrar al campus" },
  { name: "Base12 Training", text: "Conoce la aplicación de preparación física para Tropa y Marinería.", href: "/tropa-y-marineria/base12-training", image: "/images/banco-opositores/logo-base12-training.png", action: "Conocer Training" },
  { name: "Tabla Periódica Interactiva", text: "Explora los elementos y conoce las opciones de acceso a la aplicación.", href: "/apps/tabla-periodica", image: "/images/tabla-periodica-icon.png", action: "Ver la aplicación" },
];

const videos = [
  { title: "Qué es Base12", text: "Conoce nuestras aulas y las distintas líneas de formación.", src: "/videos/que-es-base12.mp4", poster: "/images/que-es-base12.jpg" },
  { title: "Método Base12", text: "Contenido organizado, comprensión y práctica para avanzar.", src: "/videos/metodo-base12.mp4", poster: "/images/metodo-base12.jpg" },
  { title: "Cómo funciona", text: "Descubre los recursos, el acceso y el funcionamiento del aula.", src: "/videos/como-funciona-base12.mp4", poster: "/images/como-funciona-base12.jpg" },
];

const faqs = [
  ["¿Qué puedo estudiar en Base12?", "Puedes preparar oposiciones y Tropa y Marinería, trabajar asignaturas de Bachillerato y PAU, recibir clases online y realizar cursos de competencias profesionales. Consulta el catálogo para conocer la oferta de cada línea."],
  ["¿En qué se diferencian un curso y las clases online?", "Los cursos organizan contenidos y recursos para estudiar según la modalidad elegida. Las clases online son sesiones con profesor, con reserva de horario y disponibilidad. Revisa la información de la opción que te interese antes de contratar."],
  ["¿El acompañamiento es humano o de inteligencia artificial?", "Depende del servicio y de la modalidad. Los asistentes de IA ofrecen apoyo académico y de organización. Las clases online son con profesor y algunas modalidades incluyen seguimiento humano. Comprueba qué incluye tu elección."],
  ["¿Puedo conocer el aula antes de matricularme?", "Sí. Puedes ver los vídeos de presentación y acceder al Tema 1 abierto de Administrativo de la Junta de Andalucía desde esta página. Es una muestra de esa formación; los recursos de otros cursos pueden variar."],
  ["¿Cómo accedo si ya soy alumno?", "Utiliza el botón Acceso alumnos de la cabecera o la tarjeta Base12 App para entrar con tu cuenta. Desde la pantalla de acceso también puedes recuperar tu contraseña."],
  ["¿Cómo elijo mi formación?", "Empieza por tu objetivo, consulta los cursos de esa línea y revisa sus contenidos y modalidades. Si necesitas orientación antes de matricularte, escríbenos indicando la asignatura, oposición o competencia que quieres preparar."],
];

export default function HomePage() {
  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#contenido">Saltar al contenido</a>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" aria-label="Base12 Academy · Inicio" className={styles.brand}>
            <Image src="/images/base12-logo.png" alt="Base12 Academy · Construye · Comprende · Domina" width={1024} height={1024} priority />
          </Link>
          <nav className={styles.desktopNav} aria-label="Navegación principal">
            <a href="#formacion">Formación</a>
            <a href="#aplicaciones">Aplicaciones</a>
            <a href="#metodo">Cómo funciona</a>
            <a href="#equipo">Sobre Base12</a>
            <a href="#contacto">Contacto</a>
          </nav>
          <div className={styles.headerActions}>
            <AdminHeaderLink className={styles.adminLink} />
            <Link href="/login" className={styles.login}>Acceso alumnos</Link>
            <HomeMobileMenu />
          </div>
        </div>
      </header>

      <main id="contenido" className={styles.main}>
        <section className={styles.hero} aria-labelledby="hero-title">
          <div>
            <p className={styles.eyebrow}>Formación online · Base12 Academy</p>
            <h1 id="hero-title">Oposiciones, Bachillerato y <span>clases online.</span></h1>
            <p className={styles.heroText}>Elige tu objetivo. Descubre cómo estudiar con estructura, práctica y acompañamiento.</p>
            <div className={styles.actions}>
              <a className={styles.primary} href="#formacion">Explorar formación <span aria-hidden="true">→</span></a>
              <a className={styles.textAction} href="#metodo">Ver cómo funciona <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <figure className={styles.heroMedia}>
            <video src="/videos/presentacion-base12.mp4" poster="/images/posters/base12-academy.png" controls playsInline preload="none" aria-label="Presentación de Base12 Academy" />
            <figcaption>Conoce Base12 antes de empezar.</figcaption>
          </figure>
        </section>

        <section id="formacion" className={styles.section} aria-labelledby="formation-title">
          <p className={styles.eyebrow}>Tu objetivo, tu formación</p>
          <h2 id="formation-title">¿Qué quieres preparar?</h2>
          <p className={styles.intro}>Elige una línea y descubre los cursos y modalidades disponibles.</p>
          <div className={styles.formationGrid}>
            {formation.map((item) => (
              <HomeCatalogLink family={item.family} key={item.family} className={styles.formationCard}>
                <span className={styles.cardNumber} aria-hidden="true">{item.icon}</span>
                <h3>{item.title}</h3><p>{item.text}</p>
                <span className={styles.cardAction}>{item.action} <span aria-hidden="true">→</span></span>
              </HomeCatalogLink>
            ))}
          </div>
        </section>

        <section id="aplicaciones" className={`${styles.section} ${styles.appsSection}`} aria-labelledby="apps-title">
          <div className={styles.sectionHeading}>
            <div><p className={styles.eyebrow}>Herramientas para avanzar</p><h2 id="apps-title">Aplicaciones y recursos</h2></div>
            <p>Encuentra tu convocatoria, entra al campus o descubre nuestras aplicaciones.</p>
          </div>
          <div className={styles.appsGrid}>
            {apps.map((app) => (
              <Link href={app.href} key={app.name} className={styles.appCard}>
                <Image src={app.image} width={76} height={76} alt="" />
                <div><h3>{app.name}</h3><p>{app.text}</p><span className={styles.cardAction}>{app.action} <span aria-hidden="true">→</span></span></div>
              </Link>
            ))}
          </div>
          <div className={styles.installRow}><p>¿Quieres tener Base12 a mano? Instala el acceso en tu dispositivo.</p><PwaInstallButton /></div>
        </section>

        <section id="metodo" className={styles.method} aria-labelledby="method-title">
          <div className={styles.sample}>
            <p className={styles.eyebrow}>Una muestra real</p>
            <h3>Entra en el aula antes de decidir.</h3>
            <p>Conoce el Tema 1 de Administrativo de la Junta de Andalucía: vídeo, explicación y recursos para practicar.</p>
            <div className={styles.resourceLabels}><span>Explicación</span><span>Glosario</span><span>Práctica</span></div>
            <Link href="/dashboard/administrativo-ja?tema=T01" className={styles.secondary}>Ver el tema abierto <span aria-hidden="true">→</span></Link>
            <small>Los contenidos y recursos dependen de la formación y modalidad.</small>
          </div>
          <div>
            <p className={styles.eyebrow}>El método Base12</p>
            <h2 id="method-title">Comprende. Practica. Avanza.</h2>
            <p className={styles.intro}>Contenido, práctica y apoyo con una estructura clara.</p>
            <ol className={styles.steps}>
              <li><span aria-hidden="true">1</span><div><h3>Comprende el contenido</h3><p>Trabaja con los materiales y recursos de tu formación.</p></div></li>
              <li><span aria-hidden="true">2</span><div><h3>Practica y comprueba</h3><p>Utiliza las actividades y pruebas incluidas para revisar lo aprendido.</p></div></li>
              <li><span aria-hidden="true">3</span><div><h3>Resuelve tus dudas</h3><p>Asistentes de IA y acompañamiento según el servicio y la modalidad.</p></div></li>
            </ol>
          </div>
        </section>

        <section id="catalogo-contenedor" className={styles.section} aria-label="Catálogo completo de formación"><CourseCatalog /></section>

        <section id="videos-presentacion" className={styles.section} aria-labelledby="videos-title">
          <p className={styles.eyebrow}>Mira cómo trabajamos</p><h2 id="videos-title">Descubre Base12 por dentro</h2>
          <div className={styles.videoGrid}>{videos.map((video) => (
            <article className={styles.videoCard} key={video.title}>
              <video src={video.src} poster={video.poster} controls preload="none" playsInline aria-label={video.title} />
              <div><h3>{video.title}</h3><p>{video.text}</p></div>
            </article>
          ))}</div>
        </section>

        <section id="equipo" className={styles.about} aria-labelledby="about-title">
          <p className={styles.eyebrow}>Sobre Base12</p><h2 id="about-title">Una experiencia docente convertida en método.</h2>
          <p>Base12 Academy nace de la enseñanza y del acompañamiento académico. Reúne formación, práctica y herramientas digitales para ayudarte a trabajar con un objetivo definido.</p>
          <p>En cada servicio se explica cómo estudiarás y qué apoyo incluye tu modalidad: clases con profesor, seguimiento humano o asistentes de inteligencia artificial.</p>
          <a href="#contacto" className={styles.textAction}>Habla con Base12 <span aria-hidden="true">→</span></a>
        </section>

        <section className={`${styles.section} ${styles.faq}`} aria-labelledby="faq-title">
          <p className={styles.eyebrow}>Antes de empezar</p><h2 id="faq-title">Resolvemos tus primeras dudas</h2>
          {faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
        </section>

        <section id="contacto" className={styles.contact} aria-labelledby="contact-title">
          <div><p className={styles.eyebrow}>Te ayudamos a elegir</p><h2 id="contact-title">¿Qué quieres preparar?</h2><p>Cuéntanos tu objetivo, la asignatura o la oposición que te interesa.</p></div>
          <div className={styles.contactActions}><a href="mailto:base12academy@gmail.com?subject=Orientaci%C3%B3n%20sobre%20formaci%C3%B3n%20Base12" className={styles.primary}>Solicitar información <span aria-hidden="true">→</span></a><a href="mailto:base12academy@gmail.com">base12academy@gmail.com</a></div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div><Image src="/images/base12-logo.png" width={1024} height={1024} alt="Base12 Academy" className={styles.footerLogo} /><p>Imagen Digital Ménace, S. L. U.<br />CIF: B21746086<br />Calle Lanuza, 8 · 29009 Málaga</p></div>
          <nav aria-label="Formación"><h3>Formación</h3>{formation.map((item) => <HomeCatalogLink key={item.family} family={item.family}>{item.title}</HomeCatalogLink>)}</nav>
          <nav aria-label="Accesos y recursos"><h3>Accesos y recursos</h3><Link href="/login">Acceso alumnos</Link><a href="#aplicaciones">Aplicaciones</a><a href="#contacto">Contacto</a><a href="https://discord.gg/CJ2CKEFvc" target="_blank" rel="noopener noreferrer">Comunidad B12 ↗</a></nav>
          <nav aria-label="Recursos relacionados"><h3>Recursos relacionados</h3><a href="https://eclibros.es/base12-academy/" target="_blank" rel="noopener noreferrer">Manuales y test · EC Libros ↗</a><a href="https://eclibros.es/tehalo" target="_blank" rel="noopener noreferrer">Preparación a medida · Tehalo ↗</a><p>Estos enlaces abren otras webs.</p></nav>
        </div>
        <div className={styles.footerBottom}><small>© {new Date().getFullYear()} Base12 Academy</small><nav aria-label="Información legal"><Link href="/aviso-legal">Aviso legal</Link><Link href="/privacidad">Privacidad</Link><Link href="/cookies">Cookies</Link><Link href="/terminos-contratacion">Condiciones de contratación</Link></nav></div>
      </footer>
      <LeadChatBot />
    </div>
  );
}
