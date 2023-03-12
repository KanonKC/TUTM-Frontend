import React from 'react'
import { Route, Router, Routes } from 'react-router-dom'
import Player from './Player'

const Views = () => {
  return (
    <Routes>
        <Route path='/player' element={<Player  />}/>
    </Routes>
  )
}

export default Views