import { useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import { addMusic, clearQueue, getAllQueues, playedIncrement, removeMusic } from '../services/queue.service';
import { Button, ButtonGroup, Col, Form, Input, ListGroup, ListGroupItem, Row } from 'reactstrap';
import Swal from 'sweetalert2';
import { MdQueueMusic } from 'react-icons/md';
import { BiArrowToRight, BiArrowToLeft } from 'react-icons/bi';
import { GrClearOption } from 'react-icons/gr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackwardStep, faEye, faForwardStep, faMinus, faMusic, faPlus, faSearch, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select'
import { search } from '../services/search.service';
import { getPlaylist, updatePlaylist } from '../services/playlist.service';
import AddMusicPopup from '../components/AddMusicPopup';
import { secondFormatting, urlFormatting } from '../services/utility.module';

const PlaylistView = () => {

  const [queues, setqueues] = useState([])
  const [loading, setloading] = useState(false)

  const [inputValue, setinputValue] = useState("")
  const [searchResult, setsearchResult] = useState([])
  const [toggleSearchResult, settoggleSearchResult] = useState(true)

  const [nowPlaying, setnowPlaying] = useState(null)

  const [isOpenPopup, setisOpenPopup] = useState(false)

  const loadQueue = () => {
    getAllQueues().then(response => {
      // console.log(response.data.queues)
      setqueues(response.data.queues)
    })

    getPlaylist().then(response => {
      // console.log(response.data)
      setnowPlaying(response.data)
    })
  }

  const addMusicToQueue = (url) => {
    let formatted_url = urlFormatting(url)
    console.log("FORMATTED",formatted_url)
    setloading(true)
    console.log("Begin")
    addMusic(1,formatted_url).then(response => {
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

  useEffect(() => {
    let interval = setInterval(loadQueue, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div>
      <AddMusicPopup isOpen={isOpenPopup} setisOpen={setisOpenPopup} />

      {(nowPlaying && nowPlaying.current_index >= 0) && <h2 className='text-white text-center mt-10 mx-[10%]'><span className='themed-color'>Now Playing</span>: {nowPlaying.video.title}</h2>}

      <div className='md:mb-2 md:mt-10'>
        <div className='mx-[5%] lg:mx-[15%] xl:mx-[20%]'>
          <Row>
            <Col xs={12} md={7} xl={8} className="mb-2">
              <Input placeholder='Add your music by search or paste URL here ...' value={inputValue} onChange={e => setinputValue(e.target.value)} />
            </Col>

            <Col className='flex justify-center'>
              <div className=''>
                <Button
                  disabled={loading || inputValue === ""}
                  color='success'
                  onClick={() => addMusicToQueue(inputValue)}
                >
                  <FontAwesomeIcon icon={faMusic} className="pr-2" />Add Music
                </Button>

                <Button className='ml-2' disabled={loading} color='primary' onClick={() => setisOpenPopup(true)}>
                  <FontAwesomeIcon icon={faPlus} className="pr-2" />More Options
                </Button>
              </div>

            </Col>

          </Row>
        </div>
        <div className='ml-[5%] lg:mx-[15%] xl:mx-[20%]'>

          <h4 className='text-white text-start mt-3'>Playlist ({queues.length})</h4>
          <ListGroup className='h-[45vh] md:h-[51.5vh] xl:h-[60vh]' style={{ overflowY: "scroll", width: "100%" }}>
            {queues && 
              queues.map((music, index) => (
                <ListGroupItem key={index} className='text-base text-left bg-grey ' active={nowPlaying && (index == nowPlaying.current_index)}>
                  <Row>
                    <Col>
                      <Row>
                        <Col xs={3} xl={2}>{music && <img src={music.video.thumbnail} />}</Col>
                        <Col className="text-clip">
                          <p className='mb-0 text-sm xl:text-base'>{music.video.title}</p>
                          <p className='mb-0 text-sm xl:text-base text-gray-400'>{music.video.channel_title}</p>
                        </Col>
                      </Row>
                    </Col>

                    <Col xs={1} className='flex justify-end cursor-default'>{secondFormatting(music.video.duration)}</Col>
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