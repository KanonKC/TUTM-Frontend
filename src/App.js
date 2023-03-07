import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import { addMusic, clearQueue, getAllQueues, removeMusic } from './services/queue.service';
import { Button, Col, Form, Input, ListGroup, ListGroupItem, Row } from 'reactstrap';
import Swal from 'sweetalert2';
import { MdQueueMusic } from 'react-icons/md';
import { BiArrowToRight, BiArrowToLeft } from 'react-icons/bi';
import { GrClearOption } from 'react-icons/gr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackwardStep, faForwardStep, faMusic, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';


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
    // console.log("Ready", playlist_index)
    setTimeout(() => {
      // console.log("Play")
      e.target.playVideo();
    }, 1000)
  }

  const handleEnd = (e) => {
    // console.log("End", playlist_index)
    setplaylist_index((playlist_index + 1) % Playlist.length)
  }

  const addMusicToQueue = (e) => {
    e.preventDefault()
    let formatted_url = urlFormatting(e.target.url.value)
    console.log(formatted_url)
    setloading(true)
    addMusic(formatted_url).then(response => {
      console.log(response.data)
      setloading(false)
      document.getElementById('request-music-form').reset()
    }).catch(err => {
      setloading(false)
      console.log(err)
      if (err.response.status >= 500) {
        Swal.fire('Exceed Limit!', 'The request cannot be completed because it has exceeded Youtube API quota. Please try again later.', 'error')
      }
    })
  }

  const urlFormatting = (url) => {
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

  const secondFormatting = (second) => {
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
    let interval = setInterval(loadQueue, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="App">
      <div className='mt-32'>
        <div className=''>
          {/* <h1>Turn Up The Music (BETA)</h1> */}
          <Row className='my-2'>
            <Col >
              {/* <h1 className='text-white text-start'>Now Playing</h1> */}
              <div className='flex justify-end'>
              <YouTube
                videoId={Playlist[playlist_index]}
                onReady={e => handleReady(e)}
                onEnd={e => handleEnd(e)}
              />
              </div>
            </Col>
            <Col className='w-1/2 mr-10'>
              <Form id='request-music-form' className='mb-2' onSubmit={e => addMusicToQueue(e)}>
                <Row>
                  <Col><Input placeholder='Add your music by paste URL here...' id='url' className='' /></Col>
                  <Col xs={3} className='flex justify-start'><Button disabled={loading} color='success' type='submit'> <FontAwesomeIcon icon={faMusic} className="pr-2" />Add Music</Button></Col>
                </Row>


              </Form>
              <ListGroup style={{ height: "330px", overflowY: "scroll" }}>
                {
                  queues.map((music, index) => (
                    <Row>
                    <Col><ListGroupItem onClick={() => setplaylist_index(index)} type="button" className='text-base text-left bg-grey ' active={index == playlist_index}>
                      <Row>
                        <Col className='dotted-text'>{music.title}</Col>
                        <Col className='flex  justify-end' xs={1}>{secondFormatting(music.duration)}</Col>
                      </Row>
                    </ListGroupItem></Col>
                    <Col xs={1}>
                    <Button color='danger' onClick={() => {removeMusic(music.queue_id)}}><FontAwesomeIcon icon={faXmark}/></Button>
                    </Col>
                    </Row>
                  ))
                }
              </ListGroup>
            </Col>
          </Row>

          <div className=' mt-2'>
            <Button color='light' onClick={() => setplaylist_index((((playlist_index - 1) % Playlist.length) + Playlist.length) % Playlist.length)}>
              <FontAwesomeIcon icon={faBackwardStep} className="mr-0  "/> Prev
            </Button>
            <Button color='light' className='mx-2' onClick={() => setplaylist_index((playlist_index + 1) % Playlist.length)}>
              Next <FontAwesomeIcon icon={faForwardStep} className="ml-0"/>
            </Button>
            <Button className='text-white' disabled={loading} onClick={handleClear} color="danger">
              <FontAwesomeIcon icon={faTrash} className="mr-2"/>Clear Queue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
