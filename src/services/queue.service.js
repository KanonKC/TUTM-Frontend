import axios from "axios";
import { BACKEND_URL } from "./constant.service";

export async function getAllQueues(){
    return axios.get(`${BACKEND_URL}/api/queues`)
}

export async function addMusic(url){
    return axios.post(`${BACKEND_URL}/api/queues`,{url: url})
}

export async function updateMusic(queue_id,is_played){
    return axios.put(`${BACKEND_URL}/api/queues/${queue_id}`,{is_played: is_played})
}

export async function removeMusic(queue_id){
    return axios.delete(`${BACKEND_URL}/api/queues/${queue_id}`)
}
