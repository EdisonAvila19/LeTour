import { JSDOM } from 'jsdom'
// import * as fs  from 'node:fs'

async function getJSON () {
  const response = await fetch('https://www.letour.fr/es/clasificaciones/etapa-1')
  const html = await response.text()
  const dom = new JSDOM(html)
  let allLinks = [...dom.window.document.querySelectorAll('.simple-dropdown__options a')].map(link => link.href.replace('/es/clasificaciones/',''))
  const Etapas = {}
  Etapas['etapa-1'] = getTable(html)

  //Solo para tener el JSON ordenado
  await Promise.all(allLinks.map(link => Etapas[link] = {}))

  await Promise.all(allLinks.map(async (link) => {
    Etapas[link] = await fetchLink(link)
  }))

  // const jsonData = JSON.stringify(Etapas, null, 2)
  // fs.writeFile('data.json', jsonData, (err) => {
  //   if (err) {
  //     console.error('Error al escribir el archivo JSON:', err);
  //   } else {
  //     console.log('Archivo JSON creado exitosamente.');
  //   }
  // });

  return Etapas
}

//SECTION - Functions 

async function fetchLink (link) {
  const fixedLink = 'https://www.letour.fr/es/clasificaciones/' + link
  const response = await fetch(fixedLink)
  const html = await response.text()
  return getTable(html)
}
          
function getTable (htmlCode) {
  const fullTable = {}
  const dom = new JSDOM(htmlCode)
  const allRows = [...dom.window.document.querySelectorAll('.rankingTable tbody tr')]
  allRows.forEach((row, index) => {
    const Times = [...row.querySelectorAll('.time')]
    const Corredor = row.querySelector('.rankingTables__row__profile--name')
    const Equipo = row.querySelector('.team a')
    const regex = /\/([^/]+)$/;

    fullTable[index] = {
      Puesto : row.querySelector('.rankingTables__row__position span').innerHTML,
      CorredorID : row.querySelector('.flag--with-bib').dataset.bib.replace('#',''),
      Corredor : capitalize(regex.exec(Corredor)[1]),
      Equipo: capitalize(regex.exec(Equipo)[1]),
      Tiempos: Times[0].innerHTML,
      Diferencia: Times[1].innerHTML.replace('\n','').trim(),
      B: Times[2].innerHTML.replace('B : ',''),
      P: Times[3].innerHTML
    }
  })
  return (fullTable)
}

function capitalize (str) {
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export { getJSON }
