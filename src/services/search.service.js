import axios from "axios";
import { BACKEND_URL } from "./constant.service";

export async function searchVideos(query){
    return axios.get(`${BACKEND_URL}/api/search/${query}`)
}