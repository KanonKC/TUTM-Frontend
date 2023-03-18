import { getPlaylist } from "./playlist.service"
import { getAllQueues } from "./queue.service"

export function urlFormatting(url) {
    if (url.includes('youtu.be')) {
        let url_div = url.split("youtu.be/")
        console.log(url_div[1])
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