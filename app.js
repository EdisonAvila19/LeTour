import express from 'express'
import { getJSON } from './consulta.js'
import bodyParser from "body-parser"
import cors from 'cors';
import 'dotenv/config'

const app = express()

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://smartbank-dep.netlify.app'
]
const options = {
  origin: allowedOrigins
}

app.use(cors(options))

app.use(bodyParser.json())
const port = process.env.PORT || 3001


const Usuarios = {
  Admin: {
    userName: 'Admin',
    password: 'Admin123',
    tipoUsuario: 'Admin',
    token: '3eee086a-91d9-4702-a3a1-d7951ed1b704'
  },
  User1: {
    userName: 'User1',
    password: 'contraseña',
    tipoUsuario: 'Cliente',
    token: '08414010-2d89-49ac-8c46-0baeebc0289c'
  },
  User2: {
    userName: 'User2',
    password: 'contraseña',
    tipoUsuario: 'Cliente',
    token: '51e2a4ff-ccd8-4fdf-afcd-593cb7bae60c'
  },
}

// * Ruta para obtener datos
app.get('/', (req, res) => {
  res.send("Welcome")
})
app.get('/datos', async (req, res) => {
  try {
    const data = {
      data: await getJSON(),
      fecha: new Date()
    }
    res.json(data)
  } catch (e) {
    console.error('Error al obtener datos:', error)
    res.status(500).json({ error: 'Error al obtener datos' })
  }
})

app.post('/login', async (req, res) => {
  /**
   * TODO
   * Consultar todos los usuarios de la db
   * Extraer info del header
   * buscar usuario del header en la consulta general
   * retornar info del usuario o error 
   */
  try {
    console.log('body: ',req.body);
    const { name, password } = req.body
    
    if(!name || !password) throw new Error('Falta Usuario y/o contraseña')
    if(!Usuarios[name]) throw new Error('El usuario no existe')
    if(password !== Usuarios[name].password) throw new Error('Contraseña incorrecta')
    const { userName, tipoUsuario, token } = Usuarios[name]
    res.json({ userName, tipoUsuario, token })
  }
  catch (e) {
    console.log(e.message)
    res.status(401).json({ error: `${e.message}` })
  }
})

// Iniciar el servidor
app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`)
})