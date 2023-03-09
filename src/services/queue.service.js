import axios from "axios";
import { BACKEND_URL } from "./constant.service";

export async function getAllQueues(){
    return axios.get(`${BACKEND_URL}/api/queues`)
}

export async function addMusic(url){
    return axios.post(`${BACKEND_URL}/api/queues`,{url: url})
}

export async function updateMusic(queue_id,is_cleared){
    return axios.put(`${BACKEND_URL}/api/queues/${queue_id}`,{is_cleared: is_cleared})
}

export async function removeMusic(queue_id){
    return axios.delete(`${BACKEND_URL}/api/queues/${queue_id}`)
}

export async function clearQueue(){
    return axios.delete(`${BACKEND_URL}/api/queues/clear`)
}

export async function playedIncrement(queue_id){
    return axios.put(`${BACKEND_URL}/api/queues/${queue_id}/played`)
}