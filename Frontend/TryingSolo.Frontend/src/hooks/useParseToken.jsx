import { jwtDecode } from "jwt-decode";


const useParseToken = (jwtToken) => {
    
    try
    {
        const infoToken = jwtDecode(jwtToken);
        const role = infoToken.Role;
        const login = infoToken.name;
        const id = infoToken.sub;
        return {id, login, role};
    }
    catch(error) 
    {
        console.log(error);
        return {};
    }
}

export default useParseToken;