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
        const expiration = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12 horas
        console.log(`Generando key: ${key} con expiración: ${expiration}`);

        connection = await createConnection();
        console.log(`Conectado a la base de datos`);
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
        html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #000;
            color: #fff;
            font-family: 'JetBrains Mono', monospace;
            text-align: center;
        }
        .container {
            padding: 20px;
            border: 2px solid #09f;
            border-radius: 10px;
            background: rgba(0, 0, 0, 0.7);
            box-shadow: 0 0 20px #09f;
        }
        button {
            padding: 10px 20px;
            background-color: #09f;
            color: #000;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: 0.3s;
        }
        button:hover {
            background-color: #0cf;
        }
        input {
            width: 300px;
            padding: 10px;
            text-align: center;
            background: #111;
            color: #fff;
            border: none;
            box-shadow: 0 0 10px #09f;
        }
        #adblock-detected {
            display: none;
            color: red;
            font-size: 20px;
            margin-bottom: 20px;
        }
        .adsbygoogle {
            width: 1px;
            height: 1px;
            overflow: hidden;
            position: absolute;
            visibility: hidden;
        }
    </style>
</head>
<body>
<div class="container">
    <div id="adblock-detected">Por favor desactiva AdBlock para generar la Key.</div>
    <div id="ad-container" class="adsbygoogle"></div>
    <h1>Key UbitaExploit</h1>
    <button onclick="generateKey()">Generar Key</button><br>
    <input type="text" id="key" readonly>
    <button onclick="copyKey()">Copiar Key</button>
</div>
<script>
    window.onload = function () {
        const adContainer = document.getElementById("ad-container");
        const adblockMessage = document.getElementById("adblock-detected");

        if (window.getComputedStyle(adContainer).display === "none" || adContainer.offsetHeight === 0) {
            adblockMessage.style.display = "block";
            document.querySelector("button").disabled = true;
        }
    };

    async function generateKey() {
        const adblockMessage = document.getElementById("adblock-detected");
        if (adblockMessage.style.display === "block") {
            alert("Debes desactivar AdBlock para generar la Key");
            return;
        }
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
