import { useContext } from "react";
import AuthContext from "../components/Context/AuthProvider";
import { useNavigate } from "react-router-dom";
import useParseToken from "./useParseToken";
import useUpdateToken from "./useParseToken";


// const useRediresctionRefreshToken = async (method) => {
//     const {auth, setAuth} = useContext(AuthContext);
//     const navigate = useNavigate();

//     console.log("Переадрисация на получение токена");

//     const { tokenSmall, tokenBig } = await useUpdateToken();

//     console.log(`${tokenSmall} - ${tokenBig}`);

//     if (tokenSmall == null || tokenBig == null) {
//         localStorage.removeItem("token");
//         setAuth({});
//         navigate("/Auth");
//     }
//     const { id, login, role } = useParseToken(tokenSmall);

//     localStorage.setItem("token", tokenSmall);
//     setAuth({ id, login, role });

//     await method();
// }

const useRediresctionRefreshToken = async (method, setAuth, navigate, useUpdateToken, useParseToken) => {
    console.log("Переадрисация на получение токена");

    const { tokenSmall, tokenBig } = await useUpdateToken();

    console.log(`${tokenSmall} - ${tokenBig}`);

    if (tokenSmall == null || tokenBig == null) {
        localStorage.removeItem("token");
        setAuth({});
        navigate("/Auth");
    }
    const { id, login, role } = useParseToken(tokenSmall);

    localStorage.setItem("token", tokenSmall);
    setAuth({ id, login, role });

    await method();
}

export default useRediresctionRefreshToken