import { useContext, useEffect, useState } from 'react';
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
import { search, searchVideo } from '../services/search.service';
import { getPlaylist, playAlgorithm, playIndedx, playIndex, playNextVideo, playPrevVideo, updatePlaylist } from '../services/playlist.service';
import { secondFormatting, urlFormatting } from '../services/utility.module';
import ReactPlayer from 'react-player';
import AddMusicPopup from '../components/AddMusicPopup';
import { NowPlayingContext, QueueContext } from '../App';

const Player = () => {
    const [queues, setqueues] = useContext(QueueContext)
    const [nowPlaying, setnowPlaying] = useContext(NowPlayingContext)
    const [loading, setloading] = useState(false)

    const [inputValue, setinputValue] = useState("")
    const [searchResult, setsearchResult] = useState([])
    const [toggleSearchResult, settoggleSearchResult] = useState(true)

    const searchMusic = () => {
        setloading(true)
        searchVideo(inputValue).then(response => {
            setloading(false)
            setsearchResult(response.data.result)
        }).catch(err => {
            setloading(false)
        })
    }

    const handleReady = (e) => {
        // setTimeout(() => {
        //     console.log("Hello")
        //     e.target.playVideo();
        // }, 1000)
        console.log("Ready")
    }

    const handleEnd = (e) => {
        playedIncrement(queues[nowPlaying.current_index].queue_id).then(response => {
            console.log(response)
            return playAlgorithm(1)
        })
        // let queue_id = queues.filter((music, index) => index === playlist_index)[0].queue_id
        // playedIncrement(queue_id).then(response => {
        //     return loadQueue()
        // }).then(response => {
        //     let nm = selectNextMusic()
        //     console.log(nm)
        //     setplaylist_index(nm)
        // })
        console.log("End")
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


    const handleClear = () => {
        // setplaylist_index(0)
        // setplayLoop(false)
        // setindex_mode({ loop: 0, last: 0 })
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

    const confirmationRemoveMusic = (queue_id) => {
        Swal.fire({
            title: 'Remove Warning',
            text: 'Are you sure that you want to remove this music?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                removeMusic(queue_id)
            }
        })
    }

    

    return (
        <div className="App">
                <h1 className='my-16 themed-color'>TURN UP THE MUSIC</h1>
            <div className=''>
                <div className='' style={{ width: "99%" }}>
                    <Row className='my-2'>
                        <Col xs={12} md={6}>
                            {/* {nowPlaying && <h4 className='text-white'>Now Playing: {nowPlaying.current.title}</h4>} */}
                            <div className='flex justify-end'>  
                                <div className='themed-border'>
                                    <ReactPlayer
                                        light={true}
                                        controls
                                        playing
                                        url={`https://www.youtube.com/watch?v=${(queues.length > 0 && nowPlaying) && queues[nowPlaying.current_index].video.youtube_id}`}
                                        // url="https://www.twitch.tv/videos/1768582540"
                                        onReady={e => handleReady(e)}
                                        onEnded={e => handleEnd(e)}
                                    />
                                </div>
                            </div>
                            <div className='flex justify-end mt-3'>
                                <Button color='light' onClick={() => playPrevVideo() }>
                                    <FontAwesomeIcon icon={faBackwardStep} className="mr-0  " /> Prev
                                </Button>
                                <Button color='light' className='mx-2' onClick={() => playNextVideo()}>
                                    Next <FontAwesomeIcon icon={faForwardStep} className="ml-0" />
                                </Button>
                                <Button className='text-white' disabled={loading} onClick={handleClear} color="danger">
                                    <FontAwesomeIcon icon={faTrash} className="mr-2" />Clear Queue
                                </Button>
                            </div>
                        </Col>
                        <Col className='w-1/2'>
                            <div className='mb-2'>
                                <AddMusicPopup/>
                            </div>

                            {(toggleSearchResult && searchResult.length > 0) &&
                                <div>
                                    <h4 className='text-white text-start'>Search Result ({searchResult.length})</h4>
                                    <ListGroup className='mb-2' style={{ height: "315px", overflowY: "scroll", width: "100%" }}>
                                        {
                                            searchResult.map((music, index) => (
                                                <ListGroupItem key={index} className='text-base text-left bg-grey'>
                                                    <Row>
                                                        <Col className='cursor-pointer'>
                                                            <Row>
                                                                <Col xs={3} xl={2}>{music && <img src={music.thumbnails.medium.url} />}</Col>
                                                                <Col className="text-clip">
                                                                    <p className='mb-0'>{music.title}</p>
                                                                    <p className='mb-0 text-gray-400'>{music.channelTitle}</p>
                                                                </Col>
                                                            </Row>
                                                        </Col>

                                                        {/* <Col xs={1} className='flex justify-end cursor-default'>{secondFormatting(music.duration)}</Col> */}
                                                        <Col xs={3} className="flex justify-end"><Button disabled={loading} color='success' onClick={() => { addMusicToQueue(music.id.videoId) }}><FontAwesomeIcon icon={faMusic} className="pr-2" />Add Music</Button></Col>
                                                    </Row>
                                                </ListGroupItem>
                                            ))
                                        }
                                    </ListGroup>
                                </div>
                            }

                            <h4 className='text-white text-start'>Playlist ({queues.length})</h4>
                            <ListGroup style={{ height: "330px", overflowY: "scroll", width: "100%" }}>
                                {
                                    queues.map((music, index) => (
                                        <ListGroupItem key={index} className='text-base text-left bg-grey ' active={nowPlaying && (index == nowPlaying.current_index)}>
                                            <Row>
                                                <Col xs={10} className='cursor-pointer' onClick={() => {playIndex(1,index)}}>
                                                    <Row>
                                                        <Col xs={3} xl={2}>{music && <img src={music.video.thumbnail} />}</Col>
                                                        <Col className="text-clip">
                                                            <p className='mb-0'>{music.video.title}</p>
                                                            <p className='mb-0 text-gray-400'>{music.video.channel_title}</p>
                                                        </Col>
                                                    </Row>
                                                </Col>

                                                <Col xs={1} className='flex justify-end cursor-default'>{secondFormatting(music.video.duration)}</Col>
                                                <Col xs={1}><Button color='danger' onClick={() => { confirmationRemoveMusic(music.queue_id) }}><FontAwesomeIcon icon={faXmark} /></Button></Col>
                                            </Row>
                                        </ListGroupItem>


                                    ))
                                }
                            </ListGroup>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
}

export default Player