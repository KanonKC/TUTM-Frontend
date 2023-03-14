import React, { useState, useEffect } from 'react'
import { Modal, Button, ButtonGroup, Col, Form, Input, ListGroup, ListGroupItem, Row } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackwardStep, faEye, faForwardStep, faMinus, faMusic, faSearch, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { addMusic, clearQueue, getAllQueues, playedIncrement, removeMusic } from '../services/queue.service';
import { getPlaylist, updatePlaylist } from '../services/playlist.service';
import { search } from '../services/search.service';

const AddMusicPopup = ({ isOpen, setisOpen }) => {
    const [queues, setqueues] = useState([])
    const [loading, setloading] = useState(false)

    const [inputValue, setinputValue] = useState("")
    const [searchResult, setsearchResult] = useState([])
    const [toggleSearchResult, settoggleSearchResult] = useState(true)

    const [nowPlaying, setnowPlaying] = useState(null)

    const [isOpenPopup, setisOpenPopup] = useState(false)

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

    useEffect(() => {
        let interval = setInterval(loadQueue, 1000)
        return () => {
            clearInterval(interval)
        }
    }, [])
    return (
        <Modal isOpen={isOpen} toggle={() => setisOpen(!isOpen)} size="lg">
            <div className='p-3 md:ml-3'>
                <Row>
                    <Col xs={12} md={6} xl={6}>
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

                {(toggleSearchResult && searchResult.length > 0) &&
                    <div>
                        <h4 className='text-white text-start mt-1'>Search Result ({searchResult.length})</h4>
                        <ListGroup flush className='mb-2' style={{ overflowY: "scroll", width: "100%" }}>
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
            </div>
        </Modal>
    )
}

export default AddMusicPopup