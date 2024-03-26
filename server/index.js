const express = require('express')
const path = require('path')
const multer  = require('multer')
const upload = multer()

const app = express()

const cors = require('cors');
// Allow all origins
app.use(cors());
let count = 15;


const port = 5000

const { url } = await put('articles/blob.txt', 'Hello World!', { access: 'public' });
app.use('/', function (req, res) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  res.send(process.cwd())

  })
  

app.post('/upload', upload.single('file'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    console.log(req.file, req.body)
  })

app.listen(port, () => {
    console.log("Server menyala")
})

