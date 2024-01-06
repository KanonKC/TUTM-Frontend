import { createContext, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import './App.css';
import { createPlaylist, getPlaylist } from './services/playlist.service';
import { getAllQueues } from './services/queue.service';
import Views from './views';

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
        }).catch(({ response }) => {
            if (!response) {
                Swal.fire("Connection Error", "Please check your internet connection, and try again.", "error")
            }
            else if (response.status === 404) {
                // Swal.fire("Playlist Not Found", "The playlist doesn't exist, Please create a new one.", "error")
                return createPlaylist()
            }
        })
    }

    useEffect(() => {
        loadQueue()
    })

    return (
        <div>
            <NowPlayingContext.Provider value={[nowPlaying, setnowPlaying]}>
                <QueueContext.Provider value={[queues, setqueues]}>
                    <Views />
                </QueueContext.Provider>
            </NowPlayingContext.Provider>

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    )
}
export default App;