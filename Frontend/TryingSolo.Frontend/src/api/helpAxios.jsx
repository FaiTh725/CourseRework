import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const api = axios.create({
    baseURL: "https://localhost:7214"
});


export default api;