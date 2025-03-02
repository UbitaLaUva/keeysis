


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
    <link rel="icon" href="img/LogoExploitrIcon2.png" type="image/x-icon">
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

        @keyframes pulse {
            from {
                box-shadow: 0 0 20px #09f;
            }
            to {
                box-shadow: 0 0 30px #0cf;
            }
        }
            
    </style>
    
    <script type='text/javascript' src='//priesthardshipwillow.com/63/2b/09/632b095ee008bc889129ec15dd03e008.js'></script>
</head>
 
<body>
    <div class="container">
        <h1>Key UbitaExploit</h1>
        <button onclick="generateKey()">Generar Key</button>
        <br>
        <input type="text" id="key" readonly>
        <button onclick="copyKey()">Copiar Key</button>
    </div>
    <!-- Publicidad Izquierda -->
    <div class="ad-container" style="position: absolute; left: 10%; top: 50%; transform: translateY(-50%); width: 300px; height: 250px; box-shadow: 0 0 20px #09f; border: 2px solid #09f; padding: 10px; border-radius: 10px; background: rgba(0, 0, 0, 0.7);">
        <script type="text/javascript">
            atOptions = {
                'key': 'd3566c394d8e84b8adf54366869f2054',
                'format': 'iframe',
                'height': 250,
                'width': 300,
                'params': {}
            };
        </script>
        <script type="text/javascript" src="//www.highperformanceformat.com/d3566c394d8e84b8adf54366869f2054/invoke.js"></script>
    </div>

    <!-- Publicidad Derecha -->
    <div class="ad-container" style="position: absolute; right: 10%; top: 50%; transform: translateY(-50%); width: 300px; height: 250px; box-shadow: 0 0 20px #09f; border: 2px solid #09f; padding: 10px; border-radius: 10px; background: rgba(0, 0, 0, 0.7);">
        <script type="text/javascript">
            atOptions = {
                'key': 'd3566c394d8e84b8adf54366869f2054',
                'format': 'iframe',
                'height': 250,
                'width': 300,
                'params': {}
            };
        </script>
        <script type="text/javascript" src="//www.highperformanceformat.com/d3566c394d8e84b8adf54366869f2054/invoke.js"></script>
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
            window.open("https://priesthardshipwillow.com/qy1pzy07v?key=f233f204409d021670a6e42752865ae3", "_blank");
        }
    </script>
    <script> 
// Disable right-click
    document.addEventListener("contextmenu", function (event) {
        event.preventDefault();
    });
</script>
<script>
var _0x34f6=["\x61\x64\x73","\x63\x6C\x61\x73\x73\x4E\x61\x6D\x65","\x73\x74\x79\x6C\x65","\x62\x6C\x6F\x63\x6B","\x61\x70\x70\x65\x6E\x64\x43\x68\x69\x6C\x64","\x6F\x66\x66\x73\x65\x74\x48\x65\x69\x67\x68\x74","\x30","\x69\x6E\x6E\x65\x72\x48\x54\x4D\x4C","\x3C\x68\x32\x3E\x44\x65\x73\x61\x63\x74\x69\x76\x61\x20\x41\x64\x42\x6C\x6F\x63\x6B\x20\x70\x61\x72\x61\x20\x63\x6F\x6E\x74\x69\x6E\x75\x61\x72\x3C\x2F\x68\x32\x3E","\x72\x65\x6D\x6F\x76\x65"];(function(){var _0x90d1x1=document["\x63\x72\x65\x61\x74\x65\x45\x6C\x65\x6D\x65\x6E\x74"]("\x64\x69\x76");_0x90d1x1[_0x34f6[1]]=_0x34f6[0];_0x90d1x1[_0x34f6[2]][_0x34f6[3]]=_0x34f6[3];document["\x62\x6F\x64\x79"][_0x34f6[4]](_0x90d1x1);setTimeout(function(){if(_0x90d1x1[_0x34f6[5]]=== parseInt(_0x34f6[6])){document["\x62\x6F\x64\x79"][_0x34f6[7]]=_0x34f6[8]};_0x90d1x1[_0x34f6[9]]()},100)}())

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
