import React from 'react';
import Home from './components/home';
import RC4 from './components/RC4';
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
          <Route path='/rc4' element={<RC4/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
