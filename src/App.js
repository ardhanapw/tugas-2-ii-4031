import React from 'react';
import Home from './components/home';
import AffineCipher from './components/affineCipher';
import ExtendedVigenereCipher from './components/extendedVigenereCipher';
import PlayCipher from './components/playfairCipher';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import './App.css';



const App = () => {
  return(
    <>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Home/>}/>  
          <Route path='/affinecipher' element={<AffineCipher/>}/>
          <Route path='/extendedvigenerecipher' element={<ExtendedVigenereCipher/>}/>  
          <Route path='/playfaircipher' element={<PlayCipher/>}/>  
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
