import { useContext } from 'react';
import { Button, Col, ListGroup, ListGroupItem, Row } from 'reactstrap';
import { secondFormatting } from '../services/utility.module';
import { NowPlayingContext, QueueContext } from '../App';
import SmartAddMusicInput from '../components/SmartAddMusicInput';
import { useNavigate } from 'react-router-dom';

const PlaylistView = () => {

  const nevigate = useNavigate()

  const [queues] = useContext(QueueContext)
  const [nowPlaying] = useContext(NowPlayingContext)

  return (
    <div>



      {(nowPlaying && nowPlaying.current_index >= 0 && nowPlaying.video) && <h2 className='text-white text-center mt-10 mx-[5%] lg:mx-[15%] xl:mx-[20%] py-4 themed-border'><span className='themed-color'>Now Playing</span>: {nowPlaying.video.title}</h2>}

      <div className='md:mb-2 md:mt-10'>

        <div className='mx-[5%] lg:mx-[15%] xl:mx-[20%]'>
          <SmartAddMusicInput />
        </div>

        <div className='ml-[5%] lg:mx-[15%] xl:mx-[20%]'>

          <h4 className='text-white text-start mt-3'>Playlist ({queues.length})</h4>
          <ListGroup className='h-[45vh] md:h-[50vh] xl:h-[55vh] lg:w-[100%] md:w-[95%] lg:w-[100%]' style={{ overflowY: "scroll" }}>
            {queues &&
              queues.map((music, index) => (
                <ListGroupItem key={index} className='text-base text-left bg-grey ' active={nowPlaying && (index === nowPlaying.current_index)}>
                  <Row>
                    <Col>
                      <Row>
                        <Col xs={3} xl={2}>{music && <img src={music.video.thumbnail} alt="Thumbnail"/>}</Col>
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

            <div className='flex'>

          <Button className='mx-auto mt-3' onClick={() => nevigate("./player")}>
            Go To Player
          </Button>
            </div>

        </div>
      </div>
    </div>
  )
}

export default PlaylistView