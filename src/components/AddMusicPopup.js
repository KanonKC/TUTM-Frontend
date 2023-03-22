import React, { useState, useEffect, useContext } from 'react'
import { Modal, Button, ButtonGroup, Col, Form, Input, ListGroup, ListGroupItem, Row, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackwardStep, faEye, faForwardStep, faLink, faListUl, faMinus, faMusic, faPlay, faPlus, faSearch, faTrash, faVideo, faXmark } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { addMusic, clearQueue, getAllQueues, playedIncrement, removeMusic } from '../services/queue.service';
import { getPlaylist, updatePlaylist } from '../services/playlist.service';
import { search, searchPlaylist, searchVideo } from '../services/search.service';
import { playlistUrlFormatting } from '../services/utility.module';
import { NowPlayingContext, QueueContext } from '../App';

const AddMusicPopup = () => {

    const placeHolderContent = [
        "Add your music by paste URL here ...",
        "Add your music by search from Youtube videos ...",
        "Paste Youtune Playlist url and add your music ..."
    ]


    const [queues, setqueues] = useContext(QueueContext)
    const [nowPlaying, setnowPlaying] = useContext(NowPlayingContext)

    const [isOpen, setisOpen] = useState(false)
    const [loading, setloading] = useState(false)

    const [searchType, setsearchType] = useState(1)

    const [outsideInputValue, setoutsideInputValue] = useState("")
    const [inputValue, setinputValue] = useState("")

    const [searchResult, setsearchResult] = useState([])
    const [playlistResult, setplaylistResult] = useState([])
    const [toggleSearchResult, settoggleSearchResult] = useState(true)


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
        console.log("Handle")
        let formatted_url = playlistUrlFormatting(inputValue)
        setloading(true)
        searchPlaylist(formatted_url).then(response => {
            setloading(false)
            setplaylistResult(response.data.result)
        }).catch(err => {
            setloading(false)
        })
    }

    const addMusicToQueue = (url) => {
        console.log(console.log(url))
        let formatted_url;
        formatted_url = urlFormatting(url)
        console.log(formatted_url)
        setloading(true)
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

    // useEffect(() => {
    //     let interval = setInterval(loadQueue, 1000)
    //     return () => {
    //         clearInterval(interval)
    //     }
    // }, [])

    return (
        <div>
            <Row>
                <Col xs={12} md={7} xl={8} className="mb-2">
                    <Input placeholder='Add your music by search or paste URL here ...' value={outsideInputValue} onChange={e => setoutsideInputValue(e.target.value)} />
                </Col>

                <Col className='flex justify-center'>
                    <div className=''>
                        <Button
                            disabled={loading || outsideInputValue === ""}
                            color='success'
                            onClick={() => addMusicToQueue(outsideInputValue)}
                        >
                            <FontAwesomeIcon icon={faMusic} className="pr-2" />Add Music
                        </Button>

                        <Button className='ml-2' disabled={loading} color='primary' onClick={() => setisOpen(true)}>
                            <FontAwesomeIcon icon={faPlus} className="pr-2" />More Options
                        </Button>
                    </div>

                </Col>

            </Row>
            <Modal isOpen={isOpen} toggle={() => setisOpen(!isOpen)} size="lg">
                <div className='py-3 pl-3 md:ml-3'>
                    <div className='flex'>
                        <Pagination className='mx-auto' listClassName='text-black'>
                            <PaginationItem onClick={() => setsearchType(0)} active={searchType === 0}>
                                <PaginationLink>
                                    <FontAwesomeIcon icon={faLink} className="pr-1" /><span className='hidden md:inline'>Add by</span> URL
                                </PaginationLink>
                            </PaginationItem >
                            <PaginationItem onClick={() => setsearchType(1)} active={searchType === 1}>
                                <PaginationLink>
                                    <FontAwesomeIcon icon={faPlay} className="pr-1" /><span className='hidden md:inline'>Search</span> Video
                                </PaginationLink>
                            </PaginationItem>
                            <PaginationItem onClick={() => setsearchType(2)} active={searchType === 2}>
                                <PaginationLink>
                                    <FontAwesomeIcon icon={faListUl} className="pr-1" /><span className='hidden md:inline'>Search</span> Playlist
                                </PaginationLink>
                            </PaginationItem>
                        </Pagination>
                    </div>

                    <Row>
                        <Col xs={12} md={9} xl={9}>
                            <Input className='w-[97%!important] mb-2' placeholder={placeHolderContent[searchType]} value={inputValue} onChange={e => setinputValue(e.target.value)} />
                        </Col>

                        <Col className='flex justify-center'>
                            <div className=''>

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

                        
                        </Col>

                    </Row>

                    {(toggleSearchResult && searchResult.length > 0 && searchType === 1) &&
                        <div>
                            <h4 className='text-white text-start mt-1'>Search Result ({searchResult.length})</h4>
                            <ListGroup flush className='mb-2 h-[50vh]' style={{ overflowY: "scroll", width: "100%" }}>
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
                                                <Col xs={3} className="flex justify-end"><Button disabled={loading} color='success' onClick={() => { console.log(music); addMusicToQueue(music.resourceId.videoId) }}><FontAwesomeIcon icon={faMusic} className="pr-1 md:pr-2" />
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
        </div>
    )
}

export default AddMusicPopup