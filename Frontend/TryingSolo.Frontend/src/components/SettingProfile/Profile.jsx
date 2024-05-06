import styles from "./Profile.module.css";
import Notitifcation from "./Notification";
import PersonalData from "./PersonalData";
import ResetPassword from "./ResetPassword";
import { useState } from "react";

// в последнюю очередь сделать всплывающее окно
const Profile = () => {
    const [tab, setTab] = useState(1);

    return (

        <main className={styles.main}>
            <h1>Настройки</h1>
            <div className={styles.container}>
                <div className={styles.tabs}>
                    <button type="button" onClick={() => { setTab(1) }} className={tab === 1 ? `${styles.tabsBtn} ${styles.checked}` : styles.tabsBtn}>Персональные данные</button>
                    <button type="button" onClick={() => { setTab(2) }} className={tab === 2 ? `${styles.tabsBtn} ${styles.checked}` : styles.tabsBtn}>Уведомления</button>
                    <button type="button" onClick={() => { setTab(3) }} className={tab === 3 ? `${styles.tabsBtn} ${styles.checked}` : styles.tabsBtn}>Восстановления пароля</button>
                </div>

                <section className={styles.viewTab}>
                    {tab == 1 ? <PersonalData /> : null}
                    {tab == 2 ? <Notitifcation /> : null}
                    {tab == 3 ? <ResetPassword /> : null}

                </section>
            </div>
        </main>
    )
};

export default Profile;