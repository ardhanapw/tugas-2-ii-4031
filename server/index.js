const express = require('express')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const app = express()
const cors = require('cors');
// Allow all origins
app.use(cors());

const port = 5000

let count = 15;

app.get('/', function (req, res) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  res.send("Server menyala")
  })
  
app.post('/upload', upload.single('file'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    console.log(req.file, req.body)
  })

app.listen(port, () => {
    console.log("Server menyala")
  })

