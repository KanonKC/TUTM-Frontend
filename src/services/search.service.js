import axios from "axios";
import { BACKEND_URL } from "./constant.service";

export async function searchVideo(query){
    return axios.get(`${BACKEND_URL}/api/search/video/${query}`)
}

export async function searchPlaylist(id){
    return axios.get(`${BACKEND_URL}/api/search/playlist/${id}`)
}