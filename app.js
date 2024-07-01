import express from 'express'
import { getJSON } from './consulta.js'
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json())
const port = process.env.Port || 3000;

// Ruta para obtener datos
app.get('/', (req, res) => {
    res.send("Welcome")
})
app.get('/datos', async (req, res) => {
    try {
        const data = {
            data: await getJSON(),
            fecha: new Date()
        };
        res.json(data);
    } catch (e) {
        console.error('Error al obtener datos:', error);
        res.status(500).json({ error: 'Error al obtener datos' });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`API escuchando en http://localhost:${port}`);
});