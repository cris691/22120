import fs from 'fs';
import path from 'path';
import express from 'express';

import args from './args.js';
import {say, sleep} from './common.js';
import Archivist from './archivist.js';

const SITE_PATH = path.resolve(__dirname, 'public');

const app = express();
const INDEX_FILE = args.index_file;

let Server, upAt, port;

const LibraryServer = {
  start, stop
}

export default LibraryServer;

async function start({server_port}) {
  port = server_port;
  addHandlers();
  Server = app.listen(Number(port), err => {
    if ( err ) { 
      throw err;
    } 
    upAt = new Date;
    say({server_up:{upAt,port}});
  });
}

function addHandlers() {
  const {chrome_port} = args;

  app.use(express.urlencoded({extended:true}));
  app.use(express.static(SITE_PATH));

  if ( !! args.library_path() ) {
    app.use("/library", express.static(args.library_path()))
  }

  app.get('/search', async (req, res) => {
    res.end('Not implemented yet');
  });

  app.get('/mode', async (req, res) => {
    res.end(Archivist.getMode());
  });

  app.get('/archive_index.html', async (req, res) => {
    const index = JSON.parse(fs.readFileSync(INDEX_FILE()));
    res.end(IndexView(index));
  });

  app.post('/mode', async (req, res) => {
    const {mode} = req.body;
    await Archivist.changeMode(mode);
    res.end(`Mode set to ${mode}`);
  });

  app.get('/base_path', async (req, res) => {
    res.end(args.getBasePath());
  });

  app.post('/base_path', async (req, res) => {
    const {base_path} = req.body;
    const change = args.updateBasePath(base_path);

    if ( change ) {
      Archivist.handlePathChanged();
      Server.close(async () => {
        console.log(`Server closed.`);
        console.log(`Waiting 1 second...`);
        await sleep(1000);
        await start({server_port:port});
        console.log(`Server restarted.`);
      });
      res.end(`Base path set to ${base_path} and saved to preferences. Server restarting...`);
    } else {
      res.end(`Base path not changed.`);
    }
  });
}

async function stop() {
  let resolve;
  const pr = new Promise(res => resolve = res);

  console.log(`Closing library server...`);

  Server.close(() => {
    console.log(`Library server closed.`);
    resolve();
  });

  return pr;
}

function IndexView(urls) {
  return `
    <!DOCTYPE html>
    <meta charset=utf-8>
    <title>Your HTML Library</title>
    <style>
      :root {
        font-family: sans-serif;
        background: lavenderblush;
      }
      body {
        display: table;
        margin: 0 auto;
        background: silver;
        padding: 0.5em;
        box-shadow: 0 1px 1px purple;
      }
      form {
      }
      fieldset {
        border: thin solid purple;
      }
      button, input, output {
      }
      input.long {
        width: 100%;
        min-width: 250px;
      }
      output {
        font-size: smaller;
        color: purple;
      }
      h1 {
        margin: 0;
      }
      h2 {
        margin-top: 0;
      }
    </style>
    <h1>22120</h1>
    <h2>Internet Offline Library</h2>
    <h2>Archive Index</h2>
    <ul>
    ${
      urls.map(([url,title]) => `
        <li>
          <a target=_blank href=${url}>${title||url}</a>
        </li>
      `).join('\n')
    }
    </ul>
  `
}

