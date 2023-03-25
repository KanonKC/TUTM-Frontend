import { useContext, useEffect, useState } from 'react';
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
import { NowPlayingContext, QueueContext } from '../App';
import SmartAddMusicInput from '../components/SmartAddMusicInput';

const PlaylistView = () => {

  const [queues, setqueues] = useContext(QueueContext)
  const [nowPlaying, setnowPlaying] = useContext(NowPlayingContext)

  const [loading, setloading] = useState(false)

  const [inputValue, setinputValue] = useState("")
  const [searchResult, setsearchResult] = useState([])
  const [toggleSearchResult, settoggleSearchResult] = useState(true)


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
    console.log("FORMATTED", formatted_url)
    setloading(true)
    console.log("Begin")
    addMusic(1, formatted_url).then(response => {
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

  return (
    <div>



      {(nowPlaying && nowPlaying.current_index >= 0 && nowPlaying.video) && <h2 className='text-white text-center mt-10 mx-[5%] lg:mx-[15%] xl:mx-[20%] py-4 themed-border'><span className='themed-color'>Now Playing</span>: {nowPlaying.video.title}</h2>}

      <div className='md:mb-2 md:mt-10'>

        <div className='mx-[5%] lg:mx-[15%] xl:mx-[20%]'>
          <SmartAddMusicInput/>
        </div>

        <div className='ml-[5%] lg:mx-[15%] xl:mx-[20%]'>

          <h4 className='text-white text-start mt-3'>Playlist ({queues.length})</h4>
          <ListGroup className='h-[45vh] md:h-[50vh] xl:h-[55vh] lg:w-[100%] md:w-[95%] lg:w-[100%]' style={{ overflowY: "scroll"}}>
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