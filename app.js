import express from 'express'
import { getJSON } from '../testNode/consulta.js'
const app = express();
const port = 3000;

// Ruta para obtener datos
app.get('/', async (req, res) => {
    // Aquí puedes definir el JSON que deseas devolver
    const data = {
        data: await getJSON(),
        fecha: new Date()
    };
    res.json(data);
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`API escuchando en http://localhost:${port}`);
});