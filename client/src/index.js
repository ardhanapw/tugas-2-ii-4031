import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

/*
const express = require('express')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const app = express()

const port = process.env.port || process.env.PORT || 5000

let count = 0;
*/
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/*
app.post('/api', function (req, res) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  res.json({count})
})

app.post('/upload', upload.single('file'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  console.log(req.file, req.body)
})

app.listen(port, () => {
  console.log("Server menyala")
})
*/

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

