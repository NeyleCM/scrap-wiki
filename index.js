const express = require('express');  // Express para manejar el servidor HTTP
const axios = require('axios');      // Axios para realizar solicitudes HTTP
const cheerio = require('cheerio');  // Cheerio para analizar y manipular HTML

const app = express();
const PORT = 3001;

// URL base de Wikipedia en español
const baseUrl = 'https://es.wikipedia.org';
// URL específica de la categoría "Músicos de rap"
const url = `${baseUrl}/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap`;

// Función para obtener datos de una URL específica
const getDataUrl = (pageUrl) => {
    return axios.get(pageUrl)  // Realiza una solicitud HTTP GET a la URL proporcionada
        .then(response => {
            const html = response.data; // Obtiene el HTML de la respuesta
            const $ = cheerio.load(html); // Carga el HTML en cheerio para manipulación
            const h1 = $('h1').text(); // Extrae el texto del primer elemento <h1>
            const imgs = []; // Inicializa arrays para almacenar imágenes y párrafos
            const parrafos = [];

            // Itera sobre todos los elementos <img> y extrae el atributo src de las imágenes
            $('img').each((index, element) => {
                const img = $(element).attr('src');
                imgs.push(img); // Añade la URL de la imagen al array
            });

            // Itera sobre todos los elementos <p> y extrae el texto
            $('p').each((index, element) => {
                const parrafoText = $(element).text();
                parrafos.push(parrafoText); // Añade el texto al array
            });

            // Devuelve un objeto con los datos extraídos
            return { titulo: h1, imagenes: imgs, textos: parrafos };
        })
        .catch(error => {
            console.error(`Error al acceder a la URL: ${pageUrl}`, error.message);
            return null; // Devuelve null en caso de error
        });
};

// Función principal para hacer el scraping de Wikipedia
const scrapeWikipedia = () => {
    return axios.get(url)  // Hacemos una solicitud GET a la URL principal de la categoría
        .then(response => {
            const html = response.data; // Obtenemos el HTML de la respuesta
            const $ = cheerio.load(html); // Cargamos el HTML en cheerio para su manipulación
            const enlaces = []; // Array para almacenar las URLs de las páginas internas

            // Obtener enlaces dentro del div con id mw-pages
            $('#mw-pages a').each((index, element) => {
                const link = $(element).attr('href');
                if (link) {
                    enlaces.push(baseUrl + link); // Construimos la URL completa y la añadimos al array
                }
            });

            // Crear una promesa para cada enlace y esperar a que todas terminen
            const promesas = enlaces.map(enlace => {
                console.log(`Scraping ${enlace}...`);
                return getDataUrl(enlace); // Llamamos a getDataUrl para extraer los datos de cada página
            });

            // Ejecutar todas las promesas y obtener los resultados
            return Promise.all(promesas)
                .then(paginas => {
                    const paginasValidas = paginas.filter(pagina => pagina !== null);
                    return paginasValidas; // Devolvemos las páginas válidas
                });
        })
        .catch(error => {
            console.error('Error al hacer scraping de Wikipedia:', error.message);
            return []; // Devuelve un array vacío en caso de error
        });
};

// Ruta para iniciar el scraping cuando se accede a la raíz del servidor
app.get('/', async (req, res) => {
    console.log('Iniciando scraping de Wikipedia...');
    
    try {
        const paginas = await scrapeWikipedia(); // Esperamos a que scrapeWikipedia termine
        res.json(paginas); // Enviamos los datos obtenidos en formato JSON como respuesta
    } catch (err) {
        res.status(500).send('Ocurrió un error al hacer scraping');
    }
});

// Iniciamos el servidor Express y lo ponemos a escuchar en el puerto definido
app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
});

   /*
    app.get('/', (req, res)=> {
    //res.send('Hola Mundo');
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
    return { titulo: h1, imagenes: imgs, textos: parrafos };
        }    
    }).catch(error => {
        console.error(`Error al acceder a la URL: ${url}`, error.message);
        return null;
    })
})
  

  server.listen(PORT, () => {
    console.log(`Servidor HTTP está escuchando en http://localhost:${PORT}`)
})


*/

//-----PRIMERO INICIADO---

// const express = require('express')
// const app = express()
// const axios = require('axios')
// const cheerio = require('cheerio')
// const http = require('http')

// const url = 'https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap'

// const server = http.createServer((req, res) => {
//     //res.end('Hola Mundo');
//     axios.get(url, {
//         headers: {
//             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
//         }
//     }).then((response) => {
//         if(response.status === 200) {
//         const html = response.data
//         //console.log(html)
//         const $ = cheerio.load(html)
//         const h1 = $('h1').text()
//         //console.log(h1)
//         const imgs = []
//         const parrafos = []
//         $('img').each((index, element) => {
//             const img = $(element).attr('src')
//             imgs.push(img)
//         })
//         $('p').each((index, element) => {
//             const parrafo = $(element).text()
//             parrafos.push(parrafo)
//         })
//     //console.log(parrafos)
//         res.writeHead(200, { 'Content-Type': 'text/html' }) 
//         res.write(
//             `<!DOCTYPE html>
//                 <html lang="eS">
//                 <head>
//                     <meta charset="UTF-8">
//                     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                     <title>${h1}</title>
//                 </head>
//                     <body>
//                         <h2>Imágenes</h2>
//                             <ul>
//                                 ${parrafos.map(parrafo => `<li><a href="${url}${parrafo}">${parrafo}</a></li>`).join('')}
//                             </ul>
//                         <h2>Párrafos</h2>
//                             <ul>
//                                 ${imgs.map(img => `<li><a href="${url}${img}">${img}</a></li>`).join('')}
//                             </ul>
//                     </body>
//                 </html>
//         `)
//         res.end();
//         }    
//     }).catch((error) => {
//         res.writeHead(500, { 'Content-Type': 'text/plain' });
//         res.end('Error fetching data');
//         console.error(error);
//     })
// })
  
//   server.listen(3001, () => {
//     console.log('Servidor HTTP está escuchando en http://localhost:3001')
// })