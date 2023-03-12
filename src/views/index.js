import React from 'react'
import { Route, Router, Routes } from 'react-router-dom'
import Player from './Player'
import PlaylistView from './PlaylistView'

const Views = () => {
  return (
    <Routes>
        <Route path='/player' element={<Player  />}/>
        <Route path='/*' element={<PlaylistView/>}/>
    </Routes>
  )
}

export default Views