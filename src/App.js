import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import { getAllQueues } from './services/queue.service';

function App() {
  
  const [Playlist,setPlaylist] = useState(['hBONI483Z-8']) 
  const [listNo,setlistNo] = useState(0)
  
  const handleReady = (e) => {
    console.log("Ready",listNo)
    setTimeout(() => {
      e.target.playVideo();
    },1000)
  }

  const handleEnd = (e) => {
    console.log("End",listNo)
    setlistNo((listNo + 1) % Playlist.length)
  }

  useEffect(() => {
    getAllQueues().then(response => {
      setPlaylist(response.data.queues)
      setlistNo(0)
    })
  },[])

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello</h1>
        {/* <iframe width="560" height="315" src={`https://www.youtube.com/embed/${Playlist[listNo]}`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe> */}
      <YouTube
        videoId={Playlist[listNo]}
        onReady={e => handleReady(e)}
        onEnd={e => handleEnd(e)}
      />
      <button onClick={() => setlistNo((listNo + 1)%Playlist.length)}>
        Next >>>
      </button>
      </header>
    </div>
  );
}

export default App;
