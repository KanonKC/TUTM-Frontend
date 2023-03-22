import { createContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import './App.css';
import { getPlaylist } from './services/playlist.service';
import { getAllQueues } from './services/queue.service';
import Views from './views';
import Player from './views/Player';

export const QueueContext = createContext()
export const NowPlayingContext = createContext()

function App() {

    const [queues, setqueues] = useState([])
    const [nowPlaying, setnowPlaying] = useState(null)

    const loadQueue = () => {
        getAllQueues().then(response => {
            setqueues(response.data.queues)
            return getPlaylist()
        }).then(response => {
            setnowPlaying(response.data)
        }).catch(err => {
            Swal.fire("Playlist Not Found","","error")
        })

        
    }

    let interval;
    useEffect(() => {
        interval = setInterval(loadQueue, 1000)
    
        return () => {
            clearInterval(interval)
        }
    }, [])

    return (
        <div>
            <NowPlayingContext.Provider value={[nowPlaying, setnowPlaying]}>
                <QueueContext.Provider value={[queues, setqueues]}>
                    <Views />
                </QueueContext.Provider>
            </NowPlayingContext.Provider>
        </div>
    )
}
export default App;