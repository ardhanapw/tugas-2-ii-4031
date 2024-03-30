import React from 'react';
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
          <Route path='/' element={<RC4/>}/>  
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
