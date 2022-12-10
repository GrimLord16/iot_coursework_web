import { Link } from 'react-router-dom'
import styles from './Home.module.scss'

const Home = () => {
  return (
    <>
      <section className={styles.home}>
        <div className={styles.linkSection}>
          <h1>Your Graph Algorithm</h1>
          <Link to="/graph-algorithm" className={styles.link}><div>Start</div></Link>
        </div>
        <div className={styles.linkSection}>
          <h1>Your data structure</h1>
          <Link to="/data-structure" className={styles.link}><div>Start</div></Link>
        </div>
      </section>
      <footer>
        <div className={styles.footerIotText}>Internet of Things</div>
        <div className={styles.footerYear}>2022</div>
      </footer>
    </>
  )
}

export default Home