import axios from "axios";
import { BACKEND_URL } from "./constant.service";

export async function getAllQueues(playlist_id=1){
    return axios.get(`${BACKEND_URL}/api/playlists/${playlist_id}/queues`)
}

export async function addMusic(playlist_id=1,url){
    console.log(playlist_id,url)
    return axios.post(`${BACKEND_URL}/api/playlists/${playlist_id}/queues`,{youtube_id: url})
}

export async function clearQueue(playlist_id=1){
    return axios.delete(`${BACKEND_URL}/api/playlists/${playlist_id}/queues`)
}

export async function playedIncrement(queue_id){
    return axios.put(`${BACKEND_URL}/api/queues/${queue_id}/increment`)
}

export async function getMusic(queue_id){
    return axios.delete(`${BACKEND_URL}/api/queues/${queue_id}`)
}

export async function removeMusic(queue_id){
    return axios.delete(`${BACKEND_URL}/api/queues/${queue_id}`)
}


