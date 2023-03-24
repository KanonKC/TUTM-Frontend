import { faMusic } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import { Button, Col, Input, Row } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SmartAddMusicInput = () => {
    return (
        <div>
            <Row>
                <Col xs={12} md={7} xl={10} className="mb-2">
                    <Input />
                </Col>
                <Col>
                    <Button
                        // disabled={loading || outsideInputValue === ""}
                        color='success'
                        // onClick={() => addMusicToQueue(outsideInputValue)}
                    >
                        <FontAwesomeIcon icon={faMusic} className="pr-2" />Add Music
                    </Button>
                </Col>
            </Row>
        </div>
    )
}

export default SmartAddMusicInput