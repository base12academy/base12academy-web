import Link from "next/link";
import Image from "next/image";

type HomeService = {
  name: string;
  description: string;
  href: string;
  featured?: boolean;
  image?: string;
  symbol?: string;
  atomicNumber?: string;
};

const services: HomeService[] = [
  {
    name: "Banco de Opositores",
    description: "Convocatorias oficiales, alertas y orientación.",
    href: "/banco-opositores",
    image: "/images/banco-opositores/logo-banco-opositores.png",
    featured: true,
  },
  {
    name: "Base12 App",
    description: "Tu formación y seguimiento en un único acceso.",
    href: "/login",
    image: "/images/banco-opositores/logo-base12-app.png",
  },
  {
    name: "Base12 Training",
    description: "Preparación física para Tropa y Marinería.",
    href: "/tropa-y-marineria/base12-training",
    image: "/images/banco-opositores/logo-base12-training.png",
  },
  {
    name: "Tabla Periódica",
    description: "118 elementos, tendencias, comparación y Clara.",
    href: "/apps/tabla-periodica",
    symbol: "Fe",
    atomicNumber: "26",
  },
];

export default function HomeServiceCards() {
  return (
    <aside className="b12-home-services" aria-label="Servicios Base12">
      <p>Servicios Base12</p>
      {services.map((service) => (
        <Link key={service.name} href={service.href} className={service.featured ? "featured" : undefined}>
          {service.image ? (
            <Image src={service.image} alt="" width={52} height={52} />
          ) : (
            <span className="periodic-service-icon" aria-hidden="true">
              <small>{service.atomicNumber}</small>
              <b>{service.symbol}</b>
            </span>
          )}
          <span><b>{service.name}</b><small>{service.description}</small></span>
          <i aria-hidden="true">→</i>
        </Link>
      ))}
    </aside>
  );
}
