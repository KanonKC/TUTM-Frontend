import { faCaretDown, faCaretUp, faCross, faMusic, faX } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useState } from 'react'
import { Button, Col, Input, ListGroup, ListGroupItem, Row } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { searchRecognizer } from '../services/utility.module';
import { addMusic } from '../services/queue.service';
import { searchPlaylist, searchVideo } from '../services/search.service';
import { toastSuccess } from '../services/tostify.module';
import { toast } from 'react-toastify';

const SmartAddMusicInput = () => {

    const Type = {
        VIDEO: "Add Music",
        PLAYLIST: "Search Playlist",
        SEARCH: "Search Video"
    }

    const [inputValue, setinputValue] = useState(null)
    const [inputResult, setinputResult] = useState(["VIDEO"])

    const [startSearch,setstartSearch] = useState(false)

    const [loading, setloading] = useState(false)
    const [searchResult, setsearchResult] = useState([])

    const [toggleSearchResult, settoggleSearchResult] = useState(false)

    const handleSubmit = () => {
        let input = inputResult[1]
        setloading(true)
        switch (inputResult[0]) {
            case "VIDEO":
                handleAddMusic(1, input)
                break

            case "SEARCH":
                setstartSearch(true)
                searchVideo(input).then(response => {
                    setloading(false)
                    setsearchResult(response.data.result)
                    settoggleSearchResult(true)
                })
                break

            case "PLAYLIST":
                setstartSearch(true)
                searchPlaylist(input).then(response => {
                    setloading(false)
                    setsearchResult(response.data.result)
                    settoggleSearchResult(true)
                })
                break
        }
    }

    const handleAddMusic = (playlist_id, url) => {
        setloading(true)
        addMusic(playlist_id, url).then(response => {
            console.log("Success",response)
            setloading(false)
            setinputValue("")
            toastSuccess(`${response.data.video.title} has been added to Queue!`)
            // toastSuccess(<h1></h1>)
        })
    }

    useEffect(() => {
        if (inputValue) {
            setinputResult(searchRecognizer(inputValue))
            console.log(searchRecognizer(inputValue))
        }
    }, [inputValue])

    return (
        <div>
            <Row>
                <Col xs={12} md={9} xl={9} className="mb-2">
                    <Input onKeyDown={e => {
                        if(e.key === "Enter"){
                            handleSubmit()
                        }
                    }} value={inputValue} onChange={e => setinputValue(e.target.value)} />
                </Col>
                <Col className='flex md:inline'>
                    <Button
                        disabled={loading || inputValue === null}
                        onClick={handleSubmit}
                        color='success'
                        className='mx-auto float-right'
                    >
                        <FontAwesomeIcon icon={faMusic} className="pr-2" /><span className=''>{Type[inputResult[0]]}</span>
                    </Button>
                </Col>
            </Row>

            {startSearch && <h4 onClick={() => settoggleSearchResult(!toggleSearchResult)} className='text-white text-start mt-1 cursor-pointer'>Search Result ({searchResult.length}) <FontAwesomeIcon icon={!toggleSearchResult ? faCaretDown : faCaretUp} /></h4>}
            {(toggleSearchResult && searchResult.length > 0 && inputResult[0] !== "VIDEO") &&
                <div>
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
                                        <Col xs={3} className="flex justify-end"><Button disabled={loading} color='success' onClick={() => { handleAddMusic(1, inputResult[0] === 'SEARCH' ? music.id.videoId : music.resourceId.videoId) }}><FontAwesomeIcon icon={faMusic} className="pr-1 md:pr-2" />
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
    )
}

export default SmartAddMusicInput