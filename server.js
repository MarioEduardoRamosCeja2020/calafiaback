'use strict';

const nestAppPromise = require('./dist/main');

require('greenlock-express')
  .init({
    packageRoot: __dirname,
    configDir: './greenlock.d', // Carpeta donde se autogestionarán los certificados
    maintainerEmail: 'calafia.soporte@grupocalafia.com.mx', // 👈 Reemplaza con tu correo real
    cluster: false,
  })
  .serve(async (req, res) => {
    const app = await nestAppPromise;
    return app(req, res);
  });