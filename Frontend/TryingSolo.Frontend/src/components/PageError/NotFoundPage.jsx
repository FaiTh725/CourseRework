import { Link } from "react-router-dom";
import notFoudPageImage from "../../assets/Errors/NotFoundPage.jpg"
import styles from "./Error.module.css"
import back from "../../assets/Profile/back.png"

const NotFoundPage = () => {
    return (
        <div className={styles.notFoundPageMain}>
            <header className={styles.notFoundPageHeader}>
                <Link to={"/Home"} className={styles.backButton}>
                    <img src={back} alt="" height={50}/>
                    <p>На главную</p>
                </Link>
            </header>
            <div className={styles.notFoundPageImageContainer}>
                <img src={notFoudPageImage} alt="" height={700}/>
            </div>
            <footer className={styles.NotFoundPageFooter}>
                <p>Данная страница не существует</p>
            </footer>
        </div>
    )
}

export default NotFoundPage;