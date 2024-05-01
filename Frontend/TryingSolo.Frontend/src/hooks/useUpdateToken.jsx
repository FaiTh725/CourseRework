import api from "../api/helpAxios";
import Cookies from "js-cookie";


const UpdateToken = async () => {
    try {
        var refreshToken = Cookies.get("RefreshToken");
        var responseRefresh = await api.get("/Account/Refresh", {
            withCredentials: true,
            params: {
                refreshToken: refreshToken
            }
        });
        console.log(responseRefresh);
        if (responseRefresh.data.statusCode == 0) {
            const tokenSmall = responseRefresh.data.data.token;
            const tokenBig = responseRefresh.data.data.refreshToken;
            return { tokenSmall, tokenBig };
        }

        return {};
    }
    catch (error) {
        console.log(error);
        return {};
    }
}

export default UpdateToken;