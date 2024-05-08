import styles from "./Modal.module.css"
import cross from "../../assets/Modal/cross.png"

const Modal = ({ isOpen, onClose, children }) => {
    return (
        <>
            {isOpen && (
                <main className={styles.modal}>
                    <div className={styles.wrapper}>
                        <div className={styles.content}>
                            <button onClick={onClose} className={styles.btnClose}>
                                <img src={cross} alt="cross" height={30} />
                            </button>
                            {children}
                        </div>
                    </div>
                </main>
            )}
        </>
    )
}

export default Modal