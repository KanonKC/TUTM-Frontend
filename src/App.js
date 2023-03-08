import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import { addMusic, clearQueue, getAllQueues, removeMusic } from './services/queue.service';
import { Button, ButtonGroup, Col, Form, Input, ListGroup, ListGroupItem, Row } from 'reactstrap';
import Swal from 'sweetalert2';
import { MdQueueMusic } from 'react-icons/md';
import { BiArrowToRight, BiArrowToLeft } from 'react-icons/bi';
import { GrClearOption } from 'react-icons/gr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackwardStep, faEye, faForwardStep, faMinus, faMusic, faSearch, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select'
import { search } from './services/search.service';


function App() {

    const [queues, setqueues] = useState([])
    const [Playlist, setPlaylist] = useState([])
    const [playlist_index, setplaylist_index] = useState(0)
    const [loading, setloading] = useState(false)

    const [inputValue, setinputValue] = useState("")
    const [searchResult, setsearchResult] = useState([])
    const [toggleSearchResult, settoggleSearchResult] = useState(true)

    const loadQueue = () => {
        getAllQueues().then(response => {
            setqueues(response.data.queues)
            setPlaylist(response.data.queues.map(music => music.url))
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

    const confirmationRemoveMusic = (queue_id, index) => {
        Swal.fire({
            title: 'Remove Warning',
            text: 'Are you sure that you want to remove this music?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                handleRemoveMusic(queue_id, index)
            }
        })
    }

    const handleRemoveMusic = (queue_id, index) => {
        removeMusic(queue_id).then(() => {
            console.log(index, playlist_index)
            if (index < playlist_index) {
                setplaylist_index(playlist_index - 1)
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
                    <Row className='my-2'>
                        <Col>
                            <div className='flex justify-end'>
                                <div className='themed-border'>
                                <YouTube
                                    videoId={Playlist[playlist_index]}
                                    onReady={e => handleReady(e)}
                                    onEnd={e => handleEnd(e)}
                                />
                                </div>
                            </div>
                            <div className='flex justify-end mt-3'>
                                <Button color='light' onClick={() => setplaylist_index((((playlist_index - 1) % Playlist.length) + Playlist.length) % Playlist.length)}>
                                    <FontAwesomeIcon icon={faBackwardStep} className="mr-0  " /> Prev
                                </Button>
                                <Button color='light' className='mx-2' onClick={() => setplaylist_index((playlist_index + 1) % Playlist.length)}>
                                    Next <FontAwesomeIcon icon={faForwardStep} className="ml-0" />
                                </Button>
                                <Button className='text-white' disabled={loading} onClick={handleClear} color="danger">
                                    <FontAwesomeIcon icon={faTrash} className="mr-2" />Clear Queue
                                </Button>
                            </div>
                        </Col>
                        <Col className='w-1/2 mr-10'>
                            <div className='mb-2'>
                                <Row className='mb-2'>
                                    <Col>
                                        <Input placeholder='Add your music by search or paste URL here ...' value={inputValue} onChange={e => setinputValue(e.target.value)} />
                                    </Col>
                                    <Col xs={5} className='flex justify-center'>
                                        <ButtonGroup className='mr-2'>
                                            <Button disabled={loading || inputValue === ""} color='primary' onClick={() => searchMusic()}>
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
                                            <FontAwesomeIcon icon={faMusic} className="pr-2" />Add Music
                                        </Button>
                                    </Col>
                                </Row>
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
                                        <ListGroupItem key={index} className='text-base text-left bg-grey ' active={index == playlist_index}>
                                            <Row>
                                                <Col xs={10} className='cursor-pointer' onClick={() => setplaylist_index(index)}>
                                                    <Row>
                                                        <Col xs={3} xl={2}>{music && <img src={music.thumbnail} />}</Col>
                                                        <Col className="text-clip">
                                                            <p className='mb-0'>{music.title}</p>
                                                            <p className='mb-0 text-gray-400'>{music.channel_title}</p>
                                                        </Col>
                                                    </Row>
                                                </Col>

                                                <Col xs={1} className='flex justify-end cursor-default'>{secondFormatting(music.duration)}</Col>
                                                <Col xs={1}><Button color='danger' onClick={() => { confirmationRemoveMusic(music.queue_id, index) }}><FontAwesomeIcon icon={faXmark} /></Button></Col>
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

export default App;
