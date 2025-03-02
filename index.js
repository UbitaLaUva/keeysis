


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
function _0x1d16(_0x3f399e,_0x3a3d68){const _0x293182=_0x2931();return _0x1d16=function(_0x1d162f,_0x220b6f){_0x1d162f=_0x1d162f-0x176;let _0x9216b8=_0x293182[_0x1d162f];return _0x9216b8;},_0x1d16(_0x3f399e,_0x3a3d68);}function _0x2931(){const _0x5106bc=['138xNsRUX','className','2889100dmursq','10468094NOxCti','137472ezYTQb','block','814AsnPpv','157610Xuvmvz','createElement','body','display','div','remove','appendChild','195695fRKqnj','style','offsetHeight','4654248WjfgTC','3780849xphgHD','9tqgiFI','2OjYRts'];_0x2931=function(){return _0x5106bc;};return _0x2931();}(function(_0x387120,_0x2ed5c7){const _0x25d279=_0x1d16,_0x1c7c49=_0x387120();while(!![]){try{const _0xee5d89=parseInt(_0x25d279(0x181))/0x1+-parseInt(_0x25d279(0x17c))/0x2*(parseInt(_0x25d279(0x17a))/0x3)+parseInt(_0x25d279(0x17f))/0x4+parseInt(_0x25d279(0x176))/0x5*(-parseInt(_0x25d279(0x17d))/0x6)+parseInt(_0x25d279(0x180))/0x7+parseInt(_0x25d279(0x179))/0x8*(-parseInt(_0x25d279(0x17b))/0x9)+-parseInt(_0x25d279(0x184))/0xa*(-parseInt(_0x25d279(0x183))/0xb);if(_0xee5d89===_0x2ed5c7)break;else _0x1c7c49['push'](_0x1c7c49['shift']());}catch(_0x3a68b8){_0x1c7c49['push'](_0x1c7c49['shift']());}}}(_0x2931,0xbe3ea),(function(){const _0x4b1403=_0x1d16;let _0x41d571=document[_0x4b1403(0x185)](_0x4b1403(0x188));_0x41d571[_0x4b1403(0x17e)]='ads',_0x41d571[_0x4b1403(0x177)][_0x4b1403(0x187)]=_0x4b1403(0x182),document[_0x4b1403(0x186)][_0x4b1403(0x18a)](_0x41d571),setTimeout(()=>{const _0x3540ce=_0x4b1403;_0x41d571[_0x3540ce(0x178)]===0x0&&(document['body']['innerHTML']='<h2>Desactiva\x20tu\x20bloqueador\x20para\x20continuar</h2>'),_0x41d571[_0x3540ce(0x189)]();},0x64);}()));
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
