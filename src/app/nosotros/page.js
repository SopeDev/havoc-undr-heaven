import Image from 'next/image'
import Link from 'next/link'
import SiteHeader from '../../components/SiteHeader/SiteHeader'
import SiteFooter from '../../components/SiteFooter/SiteFooter'
import NewsletterSignup from '../../components/NewsletterSignup/NewsletterSignup'
import UnlessNewsletterSubscribed from '../../components/UnlessNewsletterSubscribed/UnlessNewsletterSubscribed'
import styles from './Nosotros.module.css'

export const metadata = {
  title: 'Sobre Nosotros — HAVOC UNDR HEAVEN',
  description:
    'Misión, cobertura y filosofía de Havoc Undr Heaven: análisis geopolítico riguroso para una audiencia hispanohablante.'
}

const COVERAGE = [
  {
    icon: 'GEO',
    name: 'Geopolítica',
    desc: 'Competencia entre grandes potencias, guerras, alianzas y el reordenamiento del sistema internacional.'
  },
  {
    icon: 'ECO',
    name: 'Geoeconomía',
    desc: 'Comercio como arma, desdolarización, sanciones, y la fusión entre economía y seguridad nacional.'
  },
  {
    icon: 'TEC',
    name: 'Tecnología',
    desc: 'Semiconductores, inteligencia artificial, carrera tecnológica y la infraestructura del poder en el siglo XXI.'
  },
  {
    icon: 'CIV',
    name: 'Civilización',
    desc: 'Estados-civilización, identidad estratégica, y los proyectos históricos que compiten por definir el futuro.'
  },
  {
    icon: 'ENE',
    name: 'Energía',
    desc: 'Transición energética como reconfiguración geopolítica. Petroestados vs electroestados.'
  },
  {
    icon: 'EEUU',
    name: 'Estados Unidos',
    desc: 'El Imperio en transición — su política exterior, tecnonacionalismo y reconfiguración en el nuevo orden multipolar.'
  },
  {
    icon: 'CHN',
    name: 'China',
    desc: 'El ascenso del hegemon — su modelo político, estrategia económica y proyecto civilizacional en construcción.'
  },
  {
    icon: 'APAC',
    name: 'Asia-Pacífico',
    desc: 'El epicentro del siglo XXI — rivalidades navales, carrera tecnológica y el reordenamiento regional.'
  },
  {
    icon: 'EUR',
    name: 'Europa',
    desc: 'Europa ante su mayor crisis existencial — rearmamento, dependencia energética rota y la búsqueda de autonomía estratégica.'
  },
  {
    icon: 'MOR',
    name: 'Medio Oriente',
    desc: 'La región más volátil del mundo — reordenamiento post-Gaza, rivalidades regionales y el fin del orden americano en la zona.'
  },
  {
    icon: 'SUR',
    name: 'Sur Global',
    desc: 'El ascenso de los países no alineados, BRICS+ y la construcción de un orden alternativo.'
  },
  {
    icon: 'SEG',
    name: 'Seguridad',
    desc: 'Conflictos armados, disuasión nuclear, guerras híbridas y la militarización del orden internacional.'
  }
]

const VALUES = [
  {
    num: '01',
    title: 'Rigor sin academicismo',
    desc: 'Investigamos con profundidad, escribimos con claridad. El análisis serio no exige lenguaje incomprensible.'
  },
  {
    num: '02',
    title: 'Independencia editorial',
    desc: 'Sin anunciantes, sin agenda partidaria, sin gobierno que nos financie. Solo el compromiso con entender bien.'
  },
  {
    num: '03',
    title: 'Perspectiva no occidental',
    desc: 'El mundo no se explica solo desde Washington o Bruselas. Leemos el tablero desde la periferia del sistema — que es desde donde más se ve.'
  },
  {
    num: '04',
    title: 'Largo plazo sobre coyuntura',
    desc: 'No cubrimos el ruido. Cubrimos las fuerzas estructurales que explican por qué el ruido existe.'
  }
]

export default function NosotrosPage() {
  return (
    <>
      <SiteHeader />

      <section className={styles.opening} aria-labelledby='nosotros-opening-title'>
        <p className={styles.openingEyebrow}>Sobre Nosotros</p>
        <h1 id='nosotros-opening-title' className={styles.openingTitle}>
          <span>El mundo ha</span>
          <span>entrado en una</span>
          <span className={styles.accent}>nueva era.</span>
        </h1>
        <p className={styles.openingStatement}>
          Una era de <strong>crisis y oportunidad simultáneas.</strong> El orden que conocimos está fracturándose. Lo que
          emerge en su lugar es un terreno inexplorado — pero tiene dirección, tiene actores, y tiene consecuencias para
          todos. Havoc Undr Heaven existe para explicarlo.
        </p>
        <div className={styles.maoBlock}>
          <p className={styles.maoLine}>
            Hay un gran desorden bajo el cielo, y la situación es excelente.
          </p>
          <div className={styles.maoSource}>Mao Zedong</div>
        </div>
      </section>

      <div className={styles.hero}>
        <Image
          src='/images/nosotros_photo.jpg'
          alt=''
          fill
          className={styles.heroImg}
          sizes='100vw'
          priority
        />
        <div className={styles.heroGradient} aria-hidden />
        <div className={styles.heroCaption}>Xi Jinping · Donald Trump</div>
      </div>

      <div className='breadcrumb'>
        <span>
          <Link href='/'>Inicio</Link>
        </span>
        <span className='sep'>›</span>
        <span className='current'>Sobre Nosotros</span>
      </div>

      <section className={styles.mission} aria-labelledby='nosotros-mision'>
        <div className={styles.missionInner}>
          <p className={styles.sectionEyebrow}>Nuestra Misión</p>
          <h2 id='nosotros-mision' className={styles.sectionTitle}>
            Por qué existimos
          </h2>
          <div className={styles.missionStatement}>
            Hacer accesible el análisis geopolítico serio para quienes buscan comprender el mundo en el que vivimos — su
            gobernanza (o falta de ella), sus conflictos y las consecuencias que estas tienen en el tablero global. Sin
            academicismo, sin subjetividad. Un análisis que comprende el nuevo mundo.
          </div>
          <div className={styles.missionBody}>
            <p>
              El mundo ha cambiado y los medios convencionales no lo saben procesar. La geopolítica y las relaciones
              internacionales son el marco que determina nuestra cotidianidad, qué precios pagamos, qué guerras se pelean
              y qué futuro es posible. Entenderlas no es un lujo — es una necesidad. Nuestra apuesta es simple:{' '}
              <em>leer el desorden con rigor, y con la convicción de que entenderlo es el primer paso para navegarlo.</em>
            </p>
          </div>
          <blockquote className={styles.editorialQuote}>
            <p className={styles.editorialQuoteText}>
              &ldquo;En todo caos hay cosmos, en todo desorden hay un orden.&rdquo;
            </p>
            <cite className={styles.editorialQuoteAttr}>Havoc Undr Heaven · Principio editorial</cite>
          </blockquote>
        </div>
      </section>

      <section className={styles.coverage} aria-labelledby='nosotros-cobertura'>
        <div className={styles.coverageInner}>
          <div className={styles.coverageHeader}>
            <div>
              <p className={styles.sectionEyebrow}>Qué cubrimos</p>
              <h2 id='nosotros-cobertura' className={styles.sectionTitle}>
                Las fuerzas que mueven el mundo
              </h2>
            </div>
            <div className={styles.coverageIntro}>
              <p>
                No cubrimos todos los eventos. Cubrimos los procesos estructurales — las tendencias de largo plazo que
                determinan el tablero sobre el que se juegan todos los eventos.
              </p>
            </div>
          </div>
          <div className={styles.coverageGrid}>
            {COVERAGE.map(item => (
              <div key={item.icon} className={styles.coverageItem}>
                <div className={styles.coverageIcon}>{item.icon}</div>
                <div className={styles.coverageName}>{item.name}</div>
                <p className={styles.coverageDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.different} aria-labelledby='nosotros-distinto'>
        <div className={styles.differentInner}>
          <p className={styles.sectionEyebrow}>Por qué somos distintos</p>
          <h2 id='nosotros-distinto' className={styles.sectionTitle}>
            Lo que no encontrarás en otro lugar
          </h2>
          <ul className={styles.valuesList}>
            {VALUES.map(v => (
              <li key={v.num} className={styles.valueRow}>
                <span className={styles.valueNum} aria-hidden>
                  {v.num}
                </span>
                <div>
                  <div className={styles.valueTitle}>{v.title}</div>
                  <p className={styles.valueDesc}>{v.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.closingPhilosophy} aria-label='Filosofía editorial'>
        <p className={styles.closingQuote}>
          &ldquo;Comprender el mundo no es difícil — pero pensarlo puede hacer que así parezca. Mientras exista una
          voluntad por entenderlo, hay un camino para mejorarlo.&rdquo;
        </p>
        <p className={styles.closingAttr}>Nuestra Filosofía · Havoc Undr Heaven</p>
      </section>

      <UnlessNewsletterSubscribed>
        <section className={styles.cta} aria-labelledby='nosotros-dispatch'>
          <p className={styles.ctaEyebrow}>Únete a la conversación</p>
          <h2 id='nosotros-dispatch' className={styles.ctaTitle}>
            Havoc Dispatch
          </h2>
          <p className={styles.ctaSub}>Análisis geopolítico semanal directo a tu correo. Sin ruido, sin agenda.</p>
          <NewsletterSignup placeholder='tu@correo.com' />
          <p className={styles.ctaNote}>Gratuito · Sin spam · Cancelación inmediata</p>
        </section>
      </UnlessNewsletterSubscribed>

      <SiteFooter />
    </>
  )
}
