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
        console.log(`Ejecutando consulta: INSERT INTO claves (key_value, expiration) VALUES ('${key}', '${expiration.toISOString()}')`);

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

// Generar automáticamente una nueva clave cada 12 horas
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
    <style>
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
        body {
            font-family: 'JetBrains Mono', monospace;
            text-align: center;
            margin: 0;
            padding: 0;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #000;
            color: #fff;
            overflow: hidden;
            flex-direction: column;
        }
        button {
            padding: 10px 20px;
            margin: 20px;
            cursor: pointer;
        }
        input {
            width: 300px;
            padding: 10px;
            margin: 10px;
        }
        .card {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 200px;
            height: 200px;
            background: lightgrey;
            border-radius: 30px;
            overflow: hidden;
            box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
            transition: all 1s ease-in-out;
            border: 2px solid rgb(255, 255, 255);
        }
        .background {
            position: absolute;
            inset: 0;
            background-color: #4158D0;
            background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);
        }
        .logo {
            position: absolute;
            right: 50%;
            bottom: 50%;
            transform: translate(50%, 50%);
            transition: all 0.6s ease-in-out;
            font-size: 1.3em;
            font-weight: 600;
            color: #ffffff;
            letter-spacing: 3px;
        }
        .box {
            position: absolute;
            padding: 10px;
            background: rgba(255, 255, 255, 0.389);
            border-top: 2px solid rgb(255, 255, 255);
            border-right: 1px solid white;
            box-shadow: rgba(100, 100, 111, 0.364) -7px 7px 29px 0px;
            transition: all 1s ease-in-out;
        }
        .box:hover {
            background: rgba(255, 255, 255, 0.7);
        }
        .card:hover {
            transform: scale(1.1);
        }
        .card:hover .logo {
            transform: translate(70px, -52px);
        }
    </style>
</head>
<body>
<div>
    <h1>Generador de Keys</h1>
    <button onclick="generateKey()">Generar Key</button><br>
    <input type="text" id="key" readonly>
    <button onclick="copyKey()">Copiar Key</button>
</div>
<div class="card">
  <div class="background"></div>
  <div class="logo">Socials</div>
  <a href="#"><div class="box" style="top: 20px; left: 20px; width: 50px; height: 50px;"></div></a>
  <a href="#"><div class="box" style="top: 20px; right: 20px; width: 50px; height: 50px;"></div></a>
  <a href="#"><div class="box" style="bottom: 20px; left: 20px; width: 50px; height: 50px;"></div></a>
</div>
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
</html>
`;
    res.send(htmlResponse);
});

module.exports = app;

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Servidor corriendo en el puerto ${port}`);
    });
}
