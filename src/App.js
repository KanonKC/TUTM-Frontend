import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import { addMusic, clearQueue, getAllQueues } from './services/queue.service';
import { Button, Col, Form, Input, ListGroup, ListGroupItem, Row } from 'reactstrap';
import Swal from 'sweetalert2';

function App() {

  const [queues, setqueues] = useState([])
  const [Playlist, setPlaylist] = useState([])
  const [playlist_index, setplaylist_index] = useState(0)
  const [loading, setloading] = useState(false)

  const loadQueue = () => {
    getAllQueues().then(response => {
      setqueues(response.data.queues)
      setPlaylist(response.data.queues.map(music => music.url))
    })
  }

  const handleReady = (e) => {
    console.log("Ready", playlist_index)
    setTimeout(() => {
      console.log("Play")
      e.target.playVideo();
    }, 1000)
  }

  const handleEnd = (e) => {
    console.log("End", playlist_index)
    setplaylist_index((playlist_index + 1) % Playlist.length)
  }

  const addMusicToQueue = (e) => {
    e.preventDefault()
    let formatted_url = urlFormatting(e.target.url.value)
    setloading(true)
    addMusic(formatted_url).then(response => {
      setloading(false)
      document.getElementById('request-music-form').reset()
    })
  }

  const urlFormatting = (url) => {
      if(url.includes('youtu.be')){
        let url_div = url.split("youtu.be/")
        console.log(url_div[1])
        return url_div[1]
      }
      else{
        let url_div = url.split("?v=")
        if(url_div.length !== 1){
          let query_div = url_div[1].split("&")
          return query_div[0]
        }
        else{
          return url_div[0]
        }
      }
  }

  const secondFormatting = (second) => {
      let h = Math.floor(second/3600)
      second = second % 3600
      let m = Math.floor(second/60)
      second = second % 60
      
      let result = ""
      if(second < 10){
        result = "0" + String(second)
      }
      else{
        result = String(second)
      }
      if(h > 0 && m < 10){
        result = `0${m}:${result}`
      }
      else{
        result = `${m}:${result}`
      }
      if(h > 0){
        result = `${h}:${result}`
      }
      return result
  }

  const handleClear = () => {
    Swal.fire({
      title: 'Are you sure that you want to clear all music in playlist?',
      text: "This will remove all music, and you won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, clear it!'
    }).then((result) => {
      if (result.isConfirmed) {
        clearQueue().then(response => {
          Swal.fire(
            'Success!',
            'Your playlist is now empty.',
            'success'
          )
        })
      }
    })
  }

  useEffect(() => {
    setInterval(loadQueue,1000)
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        {/* <h1>Turn Up The Music (BETA)</h1> */} 
        <Row className='my-2'>
          <Col>
            <YouTube
              videoId={Playlist[playlist_index]}
              onReady={e => handleReady(e)}
              onEnd={e => handleEnd(e)}
            />
          </Col>
          <Col>

            <Form id='request-music-form' className='mb-2 flex' onSubmit={e => addMusicToQueue(e)}>
              <Input placeholder='Add your music by paste URL here...' id='url'/>
              <Button disabled={loading} color='success' type='submit'>+</Button>
            </Form>
            <ListGroup style={{ height: "315px", overflowY: "scroll" }}>
              {
                queues.map((music, index) => (
                  <ListGroupItem onClick={() => setplaylist_index(index)} type="button" className='text-base text-left' active={index == playlist_index}>
                    <Row>
                      <Col>{music.title}</Col>
                      <Col className='text-right' xs={2}>{secondFormatting(music.duration)}</Col>
                    </Row>
                  </ListGroupItem>
                ))
              }
            </ListGroup>
          </Col>
        </Row>

        <div className='flex mt-2'>
          <Button color='light' onClick={() => setplaylist_index((((playlist_index - 1) % Playlist.length) + Playlist.length) % Playlist.length)}>
            &lt;&lt; Prev
          </Button>
          <Button color='light' className='mx-2' onClick={() => setplaylist_index((playlist_index + 1) % Playlist.length)}>
           Next &gt;&gt; 
          </Button>
          <Button disabled={loading} onClick={handleClear} color="danger">
            Clear Queue
          </Button>
        </div>

      </header>
    </div>
  );
}

export default App;
