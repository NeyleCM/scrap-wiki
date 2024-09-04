// const express = require('express')
// const app = express()
const axios = require('axios')
const cheerio = require('cheerio')
const http = require('http')

const url = 'https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap'

const server = http.createServer((req, res) => {
    //res.end('Hola Mundo');
    axios.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
        }
    }).then((response) => {
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
            const parrafo = $(element).text()
            parrafos.push(parrafo)
        })
    //console.log(parrafos)
        res.writeHead(200, { 'Content-Type': 'text/html' }) 
        res.write(
            `<!DOCTYPE html>
                <html lang="eS">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${h1}</title>
                </head>
                    <body>
                        <h2>Imágenes</h2>
                            <ul>
                                ${parrafos.map(parrafo => `<li><a href="${url}${parrafo}">${parrafo}</a></li>`).join('')}
                            </ul>
                        <h2>Párrafos</h2>
                            <ul>
                                ${imgs.map(img => `<li><a href="${url}${img}">${img}</a></li>`).join('')}
                            </ul>
                    </body>
                </html>
        `)
        res.end();
        }    
    }).catch((error) => {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error fetching data');
        console.error(error);
    })
})
  
  server.listen(3001, () => {
    console.log('Servidor HTTP está escuchando en http://localhost:3001')
})