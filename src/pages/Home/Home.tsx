import { Link } from 'react-router-dom'
import styles from './Home.module.scss'

const Home = () => {
  return (
    <section className={styles.home}>
      <div className={styles.choice}>
          <h3>Your Graph Algorithm</h3>
          <h3>Your data structure</h3>
      </div>

      <div className={styles.buttons}>
        <Link to="/graph-algorithm"><div>Start</div></Link>
        <button>Start</button>
      </div>
    </section>
  )
}

export default Home