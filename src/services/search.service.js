import axios from "axios";
import { BACKEND_URL } from "./constant.service";

export async function search(query){
    return axios.get(`${BACKEND_URL}/api/search/${query}`)
}