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
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <link rel="icon" href="img\LogoExploitrIcon2.ico" type="image/x-icon">
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
            position: relative;
        }

        .container {
            padding: 20px;
            border: 2px solid #09f;
            border-radius: 10px;
            box-shadow: 0 0 20px #09f;
            background: rgba(0, 0, 0, 0.7);
            animation: pulse 2s infinite alternate;
        }

        button {
            padding: 10px 20px;
            margin: 10px;
            cursor: pointer;
            background-color: #09f;
            border: none;
            color: #000;
            border-radius: 5px;
            transition: 0.3s ease-in-out;
            font-family: 'JetBrains Mono', monospace;
        }

        button:hover {
            background-color: #0cf;
            box-shadow: 0 0 10px #0cf;
        }

        input {
            width: 300px;
            padding: 10px;
            margin: 10px;
            border: none;
            text-align: center;
            background: #111;
            color: #fff;
            border-radius: 5px;
            outline: none;
            box-shadow: 0 0 10px #09f;
            font-family: 'JetBrains Mono', monospace;
        }

        .social-buttons {
            position: absolute;
            bottom: 20px;
            right: 20px;
            display: flex;
            flex-direction: row;
            gap: 10px;
        }

        .social-buttons button {
    background: rgba(0, 0, 0, 0.7); /* Fondo semitransparente */
    color: #fff; /* Color del texto */
    padding: 10px 20px;
    border: 2px solid #09f; /* Borde azul */
    border-radius: 5px;
    cursor: pointer;
    transition: 0.3s;
    font-family: 'JetBrains Mono', monospace;
    box-shadow: 0 0 10px #09f; /* Sombra luminosa */
}

        .social-buttons button:hover {
    background-color: rgba(0, 0, 0, 0.9); /* Fondo más oscuro al pasar el cursor */
    box-shadow: 0 0 20px #0cf; /* Efecto de sombra */
}

        @keyframes pulse {
            from {
                box-shadow: 0 0 20px #09f;
            }
            to {
                box-shadow: 0 0 30px #0cf;
            }
        }

 .social-buttons button img {
    width: 20px;
    height: 20px;
    vertical-align: middle;
}
    </style>
    
</head>
<body>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    const allowedReferer = "https://lootdest.org/s?XixXQB1d";
    const referer = document.referrer;

    if (!referer.includes(allowedReferer)) {
      alert("Debes pasar por: https://lootdest.org/s?XixXQB1d para ingresar.");
      window.location.href = "https://lootdest.org/s?XixXQB1d"; // Redirecciona automáticamente
    }
  });
</script>
<div class="container">
    <h1>Key UbitaExploit</h1>
    <button onclick="generateKey()">Generar Key</button><br>
    <input type="text" id="key" readonly>
    <button onclick="copyKey()">Copiar Key</button>
</div>

<div class="social-buttons">
    <button onclick="window.open('https://discord.com', '_blank')">
    <img width="50" height="50" src="https://img.icons8.com/ios-glyphs/30/FFFFFF/discord-logo.png" alt="discord-logo"/></button>
    <button onclick="window.open('https://www.youtube.com/@ubitaexploit', '_blank')">
    <img width="50" height="50" src="https://img.icons8.com/ios-filled/50/FFFFFF/youtube-play.png" alt="youtube-play"/></button>
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
