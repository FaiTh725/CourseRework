import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const api = axios.create({
    baseURL: "https://localhost:5001"
});


export default api;