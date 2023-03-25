import { faCaretDown, faCaretUp, faMusic } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useState } from 'react'
import { Button, Col, Input, ListGroup, ListGroupItem, Row } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { searchRecognizer } from '../services/utility.module';
import { addMusic } from '../services/queue.service';
import { searchPlaylist, searchVideo } from '../services/search.service';

const SmartAddMusicInput = () => {

    const Type = {
        VIDEO: "Add Music",
        PLAYLIST: "Search Playlist",
        SEARCH: "Search Video"
    }

    const [inputValue, setinputValue] = useState(null)
    const [inputResult, setinputResult] = useState(["VIDEO"])

    const [loading, setloading] = useState(false)
    const [searchResult,setsearchResult] = useState([])

    const [toggleSearchResult,settoggleSearchResult] = useState(false)

    const handleSubmit = () => {
        let input = inputResult[1]
        switch (inputResult[0]) {
            case "VIDEO":
                addMusic(1, input)
                break

            case "PLAYLIST":
                searchPlaylist(input).then(response => {
                    console.log(response.data)
                    setsearchResult(response.data.result)
                    settoggleSearchResult(true)
                })
                break

            case "SEARCH":
                searchVideo(input).then(response => {
                    console.log(response.data)
                    setsearchResult(response.data.result)
                    settoggleSearchResult(true)
                })
                break
        }
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
                <Col xs={12} md={7} xl={9} className="mb-2">
                    <Input value={inputValue} onChange={e => setinputValue(e.target.value)} />
                </Col>
                <Col>
                    <Button
                        // disabled={loading || outsideInputValue === ""}
                        onClick={handleSubmit}
                        color='success'
                    // onClick={() => addMusicToQueue(outsideInputValue)}
                    >
                        <FontAwesomeIcon icon={faMusic} className="pr-2" />{Type[inputResult[0]]}
                    </Button>
                </Col>
            </Row>

            <h4 onClick={() => settoggleSearchResult(!toggleSearchResult)} className='text-white text-start mt-1 cursor-pointer'>Search Result ({searchResult.length}) <FontAwesomeIcon icon={!toggleSearchResult ? faCaretDown:faCaretUp}/></h4>
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
                                        <Col xs={3} className="flex justify-end"><Button disabled={loading} color='success' onClick={() => { addMusic(1,inputResult[0] === 'SEARCH' ? music.id.videoId : music.resourceId.videoId) }}><FontAwesomeIcon icon={faMusic} className="pr-1 md:pr-2" />
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