import axios from "axios";
import { BACKEND_URL } from "./constant.service";

export async function createPlaylist(){
    return axios.post(`${BACKEND_URL}/api/playlists`)
}

export async function getPlaylist(playlist_id=1){
    return axios.get(`${BACKEND_URL}/api/playlists/${playlist_id}`)
}

export async function updatePlaylist(playlist_id=1,body){
    return axios.put(`${BACKEND_URL}/api/playlists/${playlist_id}`,body)
}

export async function playIndex(playlist_id=1,index){
    return axios.put(`${BACKEND_URL}/api/playlists/${playlist_id}/play/index/${index}`)
}

export async function playNextVideo(playlist_id=1){
    return axios.put(`${BACKEND_URL}/api/playlists/${playlist_id}/play/next`)
}

export async function playPrevVideo(playlist_id=1){
    return axios.put(`${BACKEND_URL}/api/playlists/${playlist_id}/play/prev`)
}

export async function playAlgorithm(playlist_id=1){
    return axios.put(`${BACKEND_URL}/api/playlists/${playlist_id}/play/algorithm`)
}