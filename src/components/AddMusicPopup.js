import React, { useState } from 'react'
import { Modal } from 'reactstrap'

const AddMusicPopup = ({ isOpen,setisOpen }) => {

    return (
        <Modal isOpen={isOpen} toggle={() => setisOpen(!isOpen)}>
            Hello
        </Modal>
    )
}

export default AddMusicPopup