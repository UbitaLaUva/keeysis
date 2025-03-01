const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Middleware para verificar referer
app.use((req, res, next) => {
    const referer = req.get('referer');
    const allowedReferer = 'https://lootdest.org/s?XixXQB1d';
    const siteUrl = 'https://keysistem.vercel.app';

    if (referer && referer.startsWith(allowedReferer)) {
        next();
    } else if (req.originalUrl === '/') {
        const htmlResponse = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Acceso Denegado</title>
            <script>
                alert("Pasa primero por ${allowedReferer} para poder acceder");
                window.location.href = "${allowedReferer}";
            </script>
        </head>
        <body>
        </body>
        </html>
        `;
        res.send(htmlResponse);
    } else {
        next();
    }
});

async function createConnection() {
    return await mysql.createConnection({
        host: "srv1244.hstgr.io",
        user: "u972882902_2B8UOLu7hm8V",
        password: "wF$KMi&t/M0",
        database: "u972882902_keySistem",
    });
}

async function generateAndStoreKey() {
    let connection;
    try {
        const key = crypto.randomBytes(16).toString('hex');
        const expiration = new Date(Date.now() + 12 * 60 * 60 * 1000);
        console.log(`Generando key: ${key} con expiración: ${expiration}`);

        connection = await createConnection();
        await connection.execute('INSERT INTO claves (key_value, expiration) VALUES (?, ?)', [key, expiration]);
        console.log('Key insertada correctamente');
        return { key, expiration };
    } catch (error) {
        console.error('Error al insertar la key:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('Conexión cerrada');
        }
    }
}

async function scheduleKeyGeneration() {
    const { key } = await generateAndStoreKey();
    console.log(`Nueva key generada: ${key}`);
    setTimeout(scheduleKeyGeneration, 12 * 60 * 60 * 1000);
}

scheduleKeyGeneration();

app.get('/generate', async (req, res) => {
    const { key } = await generateAndStoreKey();
    res.json({ key });
});

app.post('/validate', async (req, res) => {
    const { key } = req.body;
    const connection = await createConnection();
    const [rows] = await connection.execute('SELECT * FROM claves WHERE key_value = ? AND expiration > NOW()', [key]);
    await connection.end();

    if (rows.length > 0) {
        res.json({ valid: true });
    } else {
        res.json({ valid: false });
    }
});

app.get('/', (req, res) => {
    const htmlResponse = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generador de Keys</title>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body { text-align: center; font-family: 'JetBrains Mono', monospace; }
    </style>
</head>
<body>
<h1>Key UbitaExploit</h1>
<button onclick="generateKey()">Generar Key</button>
<input type="text" id="key" readonly>
<button onclick="copyKey()">Copiar Key</button>
<script>
    async function generateKey() {
        const response = await fetch("/generate");
        const data = await response.json();
        document.getElementById("key").value = data.key;
    }
    function copyKey() {
        const keyInput = document.getElementById("key");
        keyInput.select();
        document.execCommand("copy");
        alert("Key copiada al portapapeles");
    }
</script>
</body>
</html>`;
    res.send(htmlResponse);
});

module.exports = app;

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Servidor corriendo en el puerto ${port}`);
    });
}
