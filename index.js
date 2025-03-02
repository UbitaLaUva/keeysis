


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
  (function () {
    function detectAdBlock() {
        return new Promise((resolve) => {
            let bait = document.createElement("div");
            bait.className = "adsbox ad-banner ad-unit"; // Common blocked ad-related class names
            bait.style.width = "1px";
            bait.style.height = "1px";
            bait.style.position = "absolute";
            bait.style.left = "-9999px";
            bait.style.visibility = "hidden"; // Make it harder to detect by AdBlock itself
            document.body.appendChild(bait);

            setTimeout(() => {
                let isBlocked = !bait || bait.offsetParent === null || window.getComputedStyle(bait).display === "none";
                document.body.removeChild(bait);
                resolve(isBlocked);
            }, 100); // Reduced timeout for better performance
        });
    }

    function showAdblockPopup() {
        let overlay = document.createElement("div");
        overlay.id = "adblock-overlay";
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        overlay.style.display = "flex";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";
        overlay.style.zIndex = "9999";
        overlay.innerHTML = 
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; text-align: center; max-width: 500px; border-radius: 10px; margin: 20px; min-height: 250px; font-size: 1.2em; font-family: system-ui; border: 5px solid #b3b3b3; background: #ffffff; color: black;">
                <h2 style="margin: 0px 0px 15px; font-weight: 700;">AdBlocker Detected!</h2>
                <p>We rely on ads to keep our website free. Please disable your ad blocker or whitelist our site.</p>
                <button id="refresh-page" style="padding: 10px 20px; font-size: 16px; cursor: pointer; background: #1a73e8; color: white; border-radius: 10px; margin: 15px 0px 0px;">I Disabled AdBlock</button>
            </div>
        ;
        document.body.appendChild(overlay);

        document.getElementById("refresh-page").addEventListener("click", function () {
            location.reload();
        });
    }

    window.addEventListener("load", () => {
        detectAdBlock().then((adBlockDetected) => {
            if (adBlockDetected) {
                showAdblockPopup();
            }
        });
    });
})();
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
