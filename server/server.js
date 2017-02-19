'use strict'

const express = require('express')
const path = require('path')
const fs      = require('fs')

//----------------
const NODE_ENV = process.env.NODE_ENV
const config = {
    NODE_ENV: NODE_ENV,
    isProduction: NODE_ENV == 'production',
    isDevelopment: NODE_ENV == 'development',
}
//----------------

if(config.isDevelopment) {
  if (!require("piping")("./server/server.js")) { return }
}

//SERVER--------------------------------------------------------------------------
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, '/../site/index.html');

const app = express()
app.use("/site/bin", express.static('site/bin'))

app.route('/')
  .get((req, res) => {
    res.sendFile(INDEX)
  })

app.get('/env', function(req, res) {
  res.end('config: ' + JSON.stringify(config, null, 2))
})

const ASSETS_DIR = './server/assets'
app.post('/save/:name', (req, res) => {
  let buffer = '';
  req.on('data', function (chunk) {
    buffer += chunk
  })
  req.on('end', function() {
    const name = req.params.name
    const data = JSON.parse(buffer)
    console.log(name, data)

    fs.writeFile(ASSETS_DIR + '/' + name, JSON.stringify(data), (err) => {if(err)console.log('write file error', err)})

    res.end('success')
  });
})

app.get('/load/:name', (req,res) => {
  const name = req.params.name
  const localPath = ASSETS_DIR + '/' + name

  if(fs.existsSync(localPath)) {
    console.log('loaded')
    res.end(fs.readFileSync(localPath, 'utf8'))
  }
  else {
    console.log('file not found, name=', name)
    res.end({})
  }
})

const server = app.listen(PORT, () => {
    console.log(`Listening on ${ PORT }`)
})