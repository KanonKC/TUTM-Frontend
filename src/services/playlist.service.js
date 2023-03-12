import axios from "axios";
import { BACKEND_URL } from "./constant.service";

export async function getPlaylist(playlist_id=1){
    return axios.get(`${BACKEND_URL}/api/playlists/${playlist_id}`)
}

export async function updatePlaylist(playlist_id=1,body){
    return axios.put(`${BACKEND_URL}/api/playlists/${playlist_id}`,body)
}