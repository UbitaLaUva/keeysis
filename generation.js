const express = require('express');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let currentKey = generateKey();
let keyExpiration = Date.now() + 12 * 60 * 60 * 1000; // 12 horas

function generateKey() {
    return crypto.randomBytes(16).toString('hex');
}

function regenerateKey() {
    currentKey = generateKey();
    keyExpiration = Date.now() + 12 * 60 * 60 * 1000;
}

// Regenerar la key cada 12 horas automáticamente
setInterval(regenerateKey, 12 * 60 * 60 * 1000);

// Endpoint para obtener la key actual
app.get('/generate', (req, res) => {
    if (Date.now() > keyExpiration) {
        regenerateKey();
    }
    res.json({ key: currentKey });
});

// Endpoint para validar la key
app.post('/validate', (req, res) => {
    const { key } = req.body;
    if (key === currentKey && Date.now() <= keyExpiration) {
        res.json({ valid: true });
    } else {
        res.json({ valid: false });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
