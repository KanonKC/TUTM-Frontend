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

export function addMusicToQueue(url) {
    let formatted_url = urlFormatting(url)
    console.log(formatted_url)
    setloading(true)
    addMusic(formatted_url).then(response => {
        console.log(response.data)
        setloading(false)
        setinputValue("")
    }).catch(err => {
        setloading(false)
        console.log(err)
        if (err.response.status >= 500) {
            Swal.fire('Exceed Limit!', 'The request cannot be completed because it has exceeded Youtube API quota. Please try again later.', 'error')
        }
        else if (err.response.status >= 400) {
            Swal.fire('Bad Input', 'To add music to the playlist by using search box, Please make sure that an input has a valid Youtube url.', 'error')
        }
    })
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

export function searchMusic() {
    setloading(true)
    search(inputValue).then(response => {
        setloading(false)
        setsearchResult(response.data.result)
    }).catch(err => {
        setloading(false)
    })
}

export function loadQueue() {
    getAllQueues().then(response => {
        // console.log(response.data.queues.map((music,index) => ({played_count: music.played_count,index: index})))
        setqueues(response.data.queues.map((music, index) => ({ ...music, index: index })))
        setPlaylist(response.data.queues.map(music => music.url))
    })

    getPlaylist().then(response => {
        setnowPlaying(response.data)
        // setplaylist_index(response.data.current_queue_id)
    })
}