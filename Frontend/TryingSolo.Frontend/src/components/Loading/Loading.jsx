
import { Bars } from "react-loader-spinner";
import styles from "./Loading.module.css"

const Loading = () => {
    return (
        <div className={styles.wrapper}>
            <Bars
                height="280"
                width="280"
                color="#209e50"
                ariaLabel="bars-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
            />
        </div>
    )
}

export default Loading;