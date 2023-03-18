import React, { useState, useEffect } from 'react'
import { Modal, Button, ButtonGroup, Col, Form, Input, ListGroup, ListGroupItem, Row, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackwardStep, faEye, faForwardStep, faMinus, faMusic, faSearch, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { addMusic, clearQueue, getAllQueues, playedIncrement, removeMusic } from '../services/queue.service';
import { getPlaylist, updatePlaylist } from '../services/playlist.service';
import { search, searchPlaylist, searchVideo } from '../services/search.service';

const AddMusicPopup = ({ isOpen, setisOpen }) => {

    const placeHolderContent = [
        "Add your music by paste URL here ...",
        "Add your music by search from Youtube videos ...",
        "Paste Youtune Playlist url and add your music ..."
    ]

    const [queues, setqueues] = useState([])
    const [loading, setloading] = useState(false)

    const [searchType, setsearchType] = useState(1)

    const [inputValue, setinputValue] = useState("")
    const [searchResult, setsearchResult] = useState([])
    const [playlistResult, setplaylistResult] = useState([])
    const [toggleSearchResult, settoggleSearchResult] = useState(true)

    const [nowPlaying, setnowPlaying] = useState(null)

    const [isOpenPopup, setisOpenPopup] = useState(false)

    const loadQueue = () => {
        getAllQueues().then(response => {
            // console.log(response.data.queues.map((music, index) => ({ ...music, index: index })))
            setqueues(response.data.queues.map((music, index) => ({ ...music, index: index })))
        })

        getPlaylist().then(response => {
            // console.log(response.data)
            setnowPlaying(response.data)
        })
    }

    const handleSearchVideo = () => {
        setloading(true)
        searchVideo(inputValue).then(response => {
            setloading(false)
            setsearchResult(response.data.result)
        }).catch(err => {
            setloading(false)
        })
    }

    const handleSearchPlaylist = () => {
        setloading(true)
        searchPlaylist(inputValue).then(response => {
            setloading(false)
            setplaylistResult(response.data.result)
        }).catch(err => {
            setloading(false)
        })
    }

    const addMusicToQueue = (url) => {
        console.log(console.log(url))
        let formatted_url = urlFormatting(url)
        setloading(true)
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
            <div className='py-3 pl-3 md:ml-3'>
                <div className='flex'>
                    <Pagination className='mx-auto' listClassName='text-black'>
                        <PaginationItem onClick={() => setsearchType(0)} active={searchType === 0}>
                            <PaginationLink>
                                Add by URL
                            </PaginationLink>
                        </PaginationItem >
                        <PaginationItem onClick={() => setsearchType(1)} active={searchType === 1}>
                            <PaginationLink>
                                Search Video
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem onClick={() => setsearchType(2)} active={searchType === 2}>
                            <PaginationLink>
                                Search Playlist
                            </PaginationLink>
                        </PaginationItem>
                    </Pagination>
                </div>

                <Row>
                    <Col xs={12} md={9} xl={9}>
                        <Input placeholder={placeHolderContent[searchType]} value={inputValue} onChange={e => setinputValue(e.target.value)} />
                    </Col>

                    <Col className='flex justify-center'>
                        <div className='hidden lg:block'>

                            {searchType === 0 && <Button
                                disabled={loading || inputValue === ""}
                                color='success'
                                onClick={() => addMusicToQueue(inputValue)}
                            >
                                <FontAwesomeIcon icon={faMusic} className="pr-2" />Add <span className='hidden xl:inline'>Music</span>
                            </Button>
                            }

                            {searchType === 1 && <Button className='' disabled={loading || inputValue === ""} color='primary' onClick={() => handleSearchVideo()}>
                                <FontAwesomeIcon icon={faSearch} className="pr-2" />Search Video
                            </Button>}

                            {searchType === 2 && <Button className='' disabled={loading || inputValue === ""} color='primary' onClick={() => handleSearchPlaylist()}>
                                <FontAwesomeIcon icon={faSearch} className="pr-2" />Search Playlist
                            </Button>}
                        </div>

                        <div className='lg:hidden mt-2'>

                            <ButtonGroup className='mr-2'>
                                <Button disabled={loading || inputValue === ""} color='primary' onClick={() => searchVideo()}>
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

                {(toggleSearchResult && searchResult.length > 0 && searchType === 1) &&
                    <div>
                        <h4 className='text-white text-start mt-1'>Search Result ({searchResult.length})</h4>
                        <ListGroup flush className='mb-2' style={{ overflowY: "scroll", width: "100%" }}>
                            {
                                searchResult.map((music, index) => (
                                    <ListGroupItem key={index} className='text-base text-left bg-grey'>
                                        <Row>
                                            <Col className=''>
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

                {(toggleSearchResult && playlistResult.length > 0 && searchType === 2) &&
                    <div>
                        <h4 className='text-white text-start mt-1'>Search Result ({playlistResult.length})</h4>
                        <ListGroup flush className='mb-2 h-[50vh]' style={{ overflowY: "scroll", width: "100%" }}>
                            {
                                playlistResult.map((music, index) => (
                                    <ListGroupItem key={index} className='text-base text-left bg-grey'>
                                        <Row>
                                            <Col className=''>
                                                <Row>
                                                    <Col xs={3} xl={2}>{music.thumbnails.medium && <img src={music.thumbnails.medium.url} />}</Col>
                                                    <Col className="text-clip">
                                                        <p className='mb-0 text-sm xl:text-base'>{music.title}</p>
                                                        <p className='mb-0 text-sm xl:text-base text-gray-400'>{music.channelTitle}</p>
                                                    </Col>
                                                </Row>
                                            </Col>

                                            {/* <Col xs={1} className='flex justify-end cursor-default'>{secondFormatting(music.duration)}</Col> */}
                                            <Col xs={3} className="flex justify-end"><Button disabled={loading} color='success' onClick={() => { console.log(music);addMusicToQueue(music.resourceId.videoId) }}><FontAwesomeIcon icon={faMusic} className="pr-1 md:pr-2" />
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