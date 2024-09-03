// const express = require('express')
// const app = express()
const axios = require('axios')
const cheerio = require('cheerio')
const http = require('http')

const url = 'https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap'

const server = http.createServer((req, res) => {
    //res.end('Hola Mundo');
    axios.get(url).then((response) => {
        if(response.status === 200) {
        const html = response.data
        //console.log(html)
        const $ = cheerio.load(html)
        const h1 = $('h1').text()
        //console.log(h1)
        const imgs = []
        const parrafos = []
        $('img').each((index, element) => {
            const img = $(element).attr('src')
            imgs.push(img)
        })
        $('p').each((index, element) => {
            const parrafo = $(element)
            parrafo.push(parrafo)
        })
    console.log(parrafos)
        }    
    });
})
  
  server.listen(3001, () => {
    console.log('Servidor HTTP está escuchando en http://localhost:3001')
})