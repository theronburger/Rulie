import Head from 'next/head'
import Image from 'next/image'
import { Inter, Poppins } from 'next/font/google'
import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })
const poppins300 = Poppins({ subsets: ['latin'], weight: "300"  })
const poppins600 = Poppins({ subsets: ['latin'], weight: "300"  })

export default function Home() {
  return (
    <>
      <Head>
        <title>Rulie</title>
        <meta name="description" content="The website for an app called Rulie gives users granular control over their mail notifications" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
      <Image
            className={styles.logo}
            src="/logo-banner.png"
            alt="Rulie logo banner"
            width={300}
            height={100}
            priority
          />
          <h3 className={poppins300.className}>
          Take control of mail notifications!
                      </h3>

          <Image
            className={styles.screenshot}
            src="/screenshot.png"
            alt="Rulie app screenshot"
            width={600}
            height={600}
            priority
          />
          

        <div className={styles.grid}>
        <a
            href="https://github.com/theronburger/Rulie/blob/main/app/README.md"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={poppins600.className}>
              📝 Docs 
            </h2>
            <p className={poppins300.className}>
              Take a read though rulie&apos;s dev docs
            </p>
          </a>

          <a
            href="https://mailchi.mp/8be731bbee1d/rulie-alpha"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={poppins600.className}>
              💌 Get updates 
            </h2>
            <p className={poppins300.className}>
              Sign up for the alpha
            </p>
          </a>

          <a
            href="https://github.com/theronburger/Rulie"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={poppins600.className}>
              🐙 Git 
            </h2>
            <p className={poppins300.className}>
              Dive into the code on git
            </p>
          </a>
        </div>
      </main>
    </>
  )
}
