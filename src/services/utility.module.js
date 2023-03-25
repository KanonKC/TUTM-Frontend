import { getPlaylist } from "./playlist.service"
import { getAllQueues } from "./queue.service"

export function urlFormatting(url) {
    if (url.includes('youtu.be')) {
        let url_div = url.split("youtu.be/")
        return(url_div[1])
        return url_div[1]
    }
    else {
        let url_div = url.split("?v=")
        if (url_div.length !== 1) {
            let query_div = url_div[1].split("&")
            return query_div[0]
        }
        else {
            return url_div[0]
        }
    }
}

export function playlistUrlFormatting(url){
    if (url.includes('youtube.com')){
        const playlistReg = /list=.*&|list=.*/
        let result = playlistReg.exec(url)[0].slice(5)
        if(result[result.length-1] === '&'){
            result = result.slice(0,-1)
        }
        return result
    }
    else{
        return url
    }
}

export function secondFormatting(second) {
    let h = Math.floor(second / 3600)
    second = second % 3600
    let m = Math.floor(second / 60)
    second = second % 60

    let result = ""
    if (second < 10) {
        result = "0" + String(second)
    }
    else {
        result = String(second)
    }
    if (h > 0 && m < 10) {
        result = `0${m}:${result}`
    }
    else {
        result = `${m}:${result}`
    }
    if (h > 0) {
        result = `${h}:${result}`
    }
    return result
}

export function searchRecognizer(input){
    let result
    if(input.includes('youtu.be')){
        return(['VIDEO',input.split('/')[3]])
    }
    else if(input.includes('list=')){
        const videoReg = /list=(.*?)&|list=(.*?)/
        result = videoReg.exec(input)[0]
        if(result[result.length-1] === '&'){
            return(['PLAYLIST',result.slice(5,-1)])
        }
        else{
            return(['PLAYLIST',result.slice(5)])
        }
    }
    else if(input.includes('v=')){
        const videoReg = /v=.*&|v=.*/
        result = videoReg.exec(input)[0]
        // return(result[0],result[0][result[0].length-1])
        if(result[result.length-1] === '&'){
            return(['VIDEO',result.slice(2,-1)])
        }
        else{
            return(['VIDEO',result.slice(2)])
        }
    }
    else{
        return(['SEARCH',input])
    }
}