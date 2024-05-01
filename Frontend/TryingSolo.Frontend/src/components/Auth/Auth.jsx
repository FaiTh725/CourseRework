import { useState } from "react"
import Login from "./Login";
import logo from "../../assets/Auth/logo.png";
import useless from "../../assets/Auth/useless.jpg";
import styles from "./Auth.module.css"

const Auth = () => {
    const [page, setPage] = useState(<Login SwithPage={SwithPage}/>);

    function SwithPage(page) {
        setPage(page);
    }

    return(
        <main className={styles.main}>
            <section className={styles.active}>
                <header className={styles.header}>
                    <img src={logo} alt="logo" height={80} />
                </header>
                <div className={styles.page}>
                    {page}
                </div>
            </section>
            <section className={styles.noActive}>
                <img src={useless} alt="random img" />
            </section>
        </main>
    )
}

export default Auth