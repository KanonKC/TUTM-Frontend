import { useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import { addMusic, clearQueue, getAllQueues, playedIncrement, removeMusic } from '../services/queue.service';
import { Button, ButtonGroup, Col, Form, Input, ListGroup, ListGroupItem, Row } from 'reactstrap';
import Swal from 'sweetalert2';
import { MdQueueMusic } from 'react-icons/md';
import { BiArrowToRight, BiArrowToLeft } from 'react-icons/bi';
import { GrClearOption } from 'react-icons/gr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackwardStep, faEye, faForwardStep, faMinus, faMusic, faSearch, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select'
import { search } from '../services/search.service';
import { getPlaylist, updatePlaylist } from '../services/playlist.service';
import AddMusicPopup from '../components/AddMusicPopup';

const PlaylistView = () => {

  const [queues, setqueues] = useState([])
  const [loading, setloading] = useState(false)

  const [inputValue, setinputValue] = useState("")
  const [searchResult, setsearchResult] = useState([])
  const [toggleSearchResult, settoggleSearchResult] = useState(true)

  const [nowPlaying, setnowPlaying] = useState(null)

  const [isOpenPopup,setisOpenPopup] = useState(false)

  const loadQueue = () => {
    getAllQueues().then(response => {
      console.log(response.data.queues.map((music, index) => ({ ...music, index: index })))
      setqueues(response.data.queues.map((music, index) => ({ ...music, index: index })))
    })

    getPlaylist().then(response => {
      console.log(response.data)
      setnowPlaying(response.data)
    })
  }

  const searchMusic = () => {
    setloading(true)
    search(inputValue).then(response => {
      setloading(false)
      setsearchResult(response.data.result)
    }).catch(err => {
      setloading(false)
    })
  }

  const addMusicToQueue = (url) => {
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

  useEffect(() => {
    let interval = setInterval(loadQueue, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div>
      <AddMusicPopup isOpen={isOpenPopup} setisOpen={setisOpenPopup}/>
      {nowPlaying && <h2 className='text-white text-center mt-10 mx-[10%]'><span className='themed-color'>Now Playing</span>: {nowPlaying.current.title}</h2>}

      <div className='mb-2 md:mt-10'>
        <div className='mx-[5%] lg:mx-[15%] xl:mx-[20%]'>
          <Row>
            <Col xs={12} md={6} xl={7}>
              <Input placeholder='Add your music by search or paste URL here ...' value={inputValue} onChange={e => setinputValue(e.target.value)} />
            </Col>

            <Col className='flex justify-center'>
              <div className='hidden lg:block'>

                <ButtonGroup className='mr-2'>
                  <Button className='' disabled={loading || inputValue === ""} color='primary' onClick={() => searchMusic()}>
                    <FontAwesomeIcon icon={faSearch} className="pr-2" />Search
                  </Button>
                  <Button disabled={loading || searchResult.length == 0} color='secondary' onClick={() => settoggleSearchResult(!toggleSearchResult)}>
                    <FontAwesomeIcon icon={toggleSearchResult ? faMinus : faEye} className="pr-2" /> {
                      toggleSearchResult ? "Close" : `Show (${searchResult.length})`
                    }
                  </Button>
                </ButtonGroup>

                <Button
                  disabled={loading || inputValue === ""}
                  color='success'
                  onClick={() => addMusicToQueue(inputValue)}
                >
                  <FontAwesomeIcon icon={faMusic} className="pr-2" />Add <span className='hidden xl:inline'>Music</span>
                </Button>
              </div>

              <div className='lg:hidden mt-2'>

                <ButtonGroup className='mr-2'>
                  <Button disabled={loading || inputValue === ""} color='primary' onClick={() => searchMusic()}>
                    <FontAwesomeIcon icon={faSearch} className="pr-0" />
                  </Button>
                  <Button disabled={loading || searchResult.length == 0} color='secondary' onClick={() => settoggleSearchResult(!toggleSearchResult)}>
                    <FontAwesomeIcon icon={toggleSearchResult ? faMinus : faEye} className="pr-0" />
                  </Button>
                </ButtonGroup>

                <Button
                  disabled={loading || inputValue === ""}
                  color='success'
                  onClick={() => addMusicToQueue(inputValue)}
                >
                  <FontAwesomeIcon icon={faMusic} className="pr-2" />Add
                </Button>
              </div>

            </Col>

          </Row>
        </div>
        <div className='ml-[5%] lg:mx-[15%] xl:mx-[20%]'>

          {(toggleSearchResult && searchResult.length > 0) &&
            <div>
              <h4 className='text-white text-start mt-1'>Search Result ({searchResult.length})</h4>
              <ListGroup className='mb-2' style={{ overflowY: "scroll", width: "100%" }}>
                {
                  searchResult.map((music, index) => (
                    <ListGroupItem key={index} className='text-base text-left bg-grey'>
                      <Row>
                        <Col className='cursor-pointer'>
                          <Row>
                            <Col xs={3} xl={2}>{music && <img src={music.thumbnails.medium.url} />}</Col>
                            <Col className="text-clip">
                              <p className='mb-0 text-sm xl:text-base'>{music.title}</p>
                              <p className='mb-0 text-sm xl:text-base text-gray-400'>{music.channelTitle}</p>
                            </Col>
                          </Row>
                        </Col>

                        {/* <Col xs={1} className='flex justify-end cursor-default'>{secondFormatting(music.duration)}</Col> */}
                        <Col xs={3} className="flex justify-end"><Button disabled={loading} color='success' onClick={() => { addMusicToQueue(music.id.videoId) }}><FontAwesomeIcon icon={faMusic} className="pr-1 md:pr-2" />
                          <span className='hidden md:block'>
                            Add Music
                          </span>
                        </Button></Col>
                      </Row>
                    </ListGroupItem>
                  ))
                }
              </ListGroup>
            </div>
          }

          <h4 className='text-white text-start mt-3'>Playlist ({queues.length})</h4>
          <ListGroup className='h-[45vh] md:h-[51.5vh] xl:h-[60vh]' style={{ overflowY: "scroll", width: "100%" }}>
            {
              queues.map((music, index) => (
                <ListGroupItem key={index} className='text-base text-left bg-grey ' active={nowPlaying && (index == queues.filter(music => music.queue_id === nowPlaying.current_queue_id)[0].index)}>
                  <Row>
                    <Col>
                      <Row>
                        <Col xs={3} xl={2}>{music && <img src={music.thumbnail} />}</Col>
                        <Col className="text-clip">
                          <p className='mb-0 text-sm xl:text-base'>{music.title}</p>
                          <p className='mb-0 text-sm xl:text-base text-gray-400'>{music.channel_title}</p>
                        </Col>
                      </Row>
                    </Col>

                    <Col xs={1} className='flex justify-end cursor-default'>{secondFormatting(music.duration)}</Col>
                  </Row>
                </ListGroupItem>
              ))
            }
          </ListGroup>

        </div>
      </div>
    </div>
  )
}

export default PlaylistView