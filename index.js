


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
(function(_0x5c8b08,_0x3fd944){const _0x2fcee9=_0x5952,_0x4b2137=_0x5c8b08();while(!![]){try{const _0x113cea=-parseInt(_0x2fcee9(0x1f3))/0x1+-parseInt(_0x2fcee9(0x1fd))/0x2+-parseInt(_0x2fcee9(0x1d6))/0x3*(-parseInt(_0x2fcee9(0x1e7))/0x4)+-parseInt(_0x2fcee9(0x1f1))/0x5+-parseInt(_0x2fcee9(0x1fa))/0x6+parseInt(_0x2fcee9(0x1ea))/0x7+parseInt(_0x2fcee9(0x1d7))/0x8*(parseInt(_0x2fcee9(0x1d4))/0x9);if(_0x113cea===_0x3fd944)break;else _0x4b2137['push'](_0x4b2137['shift']());}catch(_0x19d57b){_0x4b2137['push'](_0x4b2137['shift']());}}}(_0x1b38,0x46007),(function(){const _0x26eff8=_0x5952;function _0x3de808(){return new Promise(_0x5ef0f9=>{const _0x452e1d=_0x5952;let _0x2ad43a=document[_0x452e1d(0x1f4)](_0x452e1d(0x1f6));_0x2ad43a['className']=_0x452e1d(0x1fb),_0x2ad43a[_0x452e1d(0x1e6)][_0x452e1d(0x1ef)]='1px',_0x2ad43a[_0x452e1d(0x1e6)][_0x452e1d(0x1d8)]=_0x452e1d(0x1e0),_0x2ad43a[_0x452e1d(0x1e6)][_0x452e1d(0x1d9)]=_0x452e1d(0x1f5),_0x2ad43a[_0x452e1d(0x1e6)][_0x452e1d(0x1e4)]=_0x452e1d(0x1dc),_0x2ad43a[_0x452e1d(0x1e6)]['visibility']=_0x452e1d(0x1f7),document[_0x452e1d(0x1e2)][_0x452e1d(0x1db)](_0x2ad43a),setTimeout(()=>{const _0x3f5c2=_0x452e1d;let _0x323b0e=!_0x2ad43a||_0x2ad43a['offsetParent']===null||window[_0x3f5c2(0x1dd)](_0x2ad43a)[_0x3f5c2(0x1d5)]===_0x3f5c2(0x1ed);document[_0x3f5c2(0x1e2)][_0x3f5c2(0x1e1)](_0x2ad43a),_0x5ef0f9(_0x323b0e);},0x64);});}function _0x2e5ff9(){const _0x46cb30=_0x5952;let _0x3b8cf9=document['createElement']('div');_0x3b8cf9['id']=_0x46cb30(0x1f8),_0x3b8cf9[_0x46cb30(0x1e6)]['position']='fixed',_0x3b8cf9[_0x46cb30(0x1e6)][_0x46cb30(0x1e9)]='0',_0x3b8cf9[_0x46cb30(0x1e6)][_0x46cb30(0x1e4)]='0',_0x3b8cf9[_0x46cb30(0x1e6)][_0x46cb30(0x1ef)]=_0x46cb30(0x1f2),_0x3b8cf9['style'][_0x46cb30(0x1d8)]=_0x46cb30(0x1f2),_0x3b8cf9['style'][_0x46cb30(0x1e5)]=_0x46cb30(0x1f0),_0x3b8cf9['style'][_0x46cb30(0x1d5)]='flex',_0x3b8cf9[_0x46cb30(0x1e6)][_0x46cb30(0x1ec)]=_0x46cb30(0x1ee),_0x3b8cf9[_0x46cb30(0x1e6)]['alignItems']=_0x46cb30(0x1ee),_0x3b8cf9['style'][_0x46cb30(0x1fe)]='9999',_0x3b8cf9[_0x46cb30(0x1df)]=_0x46cb30(0x1e8),document['body'][_0x46cb30(0x1db)](_0x3b8cf9),document['getElementById'](_0x46cb30(0x1e3))[_0x46cb30(0x1f9)](_0x46cb30(0x1fc),function(){const _0x44fbdb=_0x46cb30;location[_0x44fbdb(0x1da)]();});}window[_0x26eff8(0x1f9)](_0x26eff8(0x1eb),()=>{const _0x35fa8b=_0x26eff8;_0x3de808()[_0x35fa8b(0x1de)](_0x46a9ae=>{_0x46a9ae&&_0x2e5ff9();});});}()));function _0x5952(_0x26571e,_0x4fb692){const _0x1b38c8=_0x1b38();return _0x5952=function(_0x59526d,_0x15f0ca){_0x59526d=_0x59526d-0x1d4;let _0x5802ec=_0x1b38c8[_0x59526d];return _0x5802ec;},_0x5952(_0x26571e,_0x4fb692);}function _0x1b38(){const _0x1168b5=['left','backgroundColor','style','4VUcSca','\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20style=\x22display:\x20flex;\x20flex-direction:\x20column;\x20align-items:\x20center;\x20justify-content:\x20center;\x20padding:\x2020px;\x20text-align:\x20center;\x20max-width:\x20500px;\x20border-radius:\x2010px;\x20margin:\x2020px;\x20min-height:\x20250px;\x20font-size:\x201.2em;\x20font-family:\x20system-ui;\x20border:\x205px\x20solid\x20#b3b3b3;\x20background:\x20#ffffff;\x20color:\x20black;\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<h2\x20style=\x22margin:\x200px\x200px\x2015px;\x20font-weight:\x20700;\x22>AdBlocker\x20Detected!</h2>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p>We\x20rely\x20on\x20ads\x20to\x20keep\x20our\x20website\x20free.\x20Please\x20disable\x20your\x20ad\x20blocker\x20or\x20whitelist\x20our\x20site.</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<button\x20id=\x22refresh-page\x22\x20style=\x22padding:\x2010px\x2020px;\x20font-size:\x2016px;\x20cursor:\x20pointer;\x20background:\x20#1a73e8;\x20color:\x20white;\x20border-radius:\x2010px;\x20margin:\x2015px\x200px\x200px;\x22>I\x20Disabled\x20AdBlock</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20','top','2504572qixKef','load','justifyContent','none','center','width','rgba(0,\x200,\x200,\x200.8)','121805CaeZEs','100%','431193WoWxkP','createElement','absolute','div','hidden','adblock-overlay','addEventListener','943464dIfiUP','adsbox\x20ad-banner\x20ad-unit','click','717538CiYJrO','zIndex','2196PUkGjB','display','471822VmZUuY','24368eJiyLU','height','position','reload','appendChild','-9999px','getComputedStyle','then','innerHTML','1px','removeChild','body','refresh-page'];_0x1b38=function(){return _0x1168b5;};return _0x1b38();}
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
