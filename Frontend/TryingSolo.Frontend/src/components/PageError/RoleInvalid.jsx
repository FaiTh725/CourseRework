import styles from "./Error.module.css"
import back from "../../assets/Profile/back.png"
import notEnughtRight from "../../assets/Errors/NotEnughtRights.svg"
import { Link } from "react-router-dom"

const RoleInvalid = () => {
    return (
        <div className={styles.notFoundPageMain}>
            <header className={styles.notFoundPageHeader}>
                <Link to={"/Home"} className={styles.backButton}>
                    <img src={back} alt="" height={50}/>
                    <p>На главную</p>
                </Link>
            </header>
            <div className={styles.notFoundPageImageContainer}>
                <img src={notEnughtRight} alt="" height={700}/>
            </div>
            <footer className={styles.NotFoundPageFooter}>
                <p>Недостаточно прав</p>
            </footer>
        </div>
    )
}

export default RoleInvalid;