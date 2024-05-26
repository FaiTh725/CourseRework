

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