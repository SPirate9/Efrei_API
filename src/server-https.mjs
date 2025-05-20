import https from 'https';
import fs from 'fs';
import Server from './server.mjs';

const options = {
  key: fs.readFileSync('./ssl/key.pem'),
  cert: fs.readFileSync('./ssl/cert.pem')
};

const app = new Server();

app.run().then(() => {
  https.createServer(options, app.app).listen(3443, () => {
    console.log('HTTPS server running on https://localhost:3443');
  });
});
