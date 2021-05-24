/**
Before running:
> npm install ws
Then:
> node server.js
> open http://localhost:8080 in the browser
*/

const http = require('http');
const fs = require('fs');
const ws = new require('ws');

const wss = new ws.Server({ noServer: true });
http.createServer(accept).listen(8080);
let log = console.log;
log("WS connected at 8080");

const clients = new Set();

class Usuario {
  constructor(username, nombre, dni, direccion, longitud, latitud) {
    this.username = username;
    this.nombre = nombre;
    this.dni = dni;
    this.direccion = direccion;
    this.longitud = longitud;
    this.latitud = latitud;
  }
}
let users = [];

function accept(req, res) {

  if (req.url == '/ws' && req.headers.upgrade &&
    req.headers.upgrade.toLowerCase() == 'websocket' &&
    // can be Connection: keep-alive, Upgrade
    req.headers.connection.match(/\bupgrade\b/i)) {
    wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onSocketConnect);
  } else {
    switch (req.url) {
      case '/':  // index.html
        fs.createReadStream('./index.html').pipe(res);
        break;
      case '/api':
        res.writeHead(200, {
          'Content-Type': 'application/json',
          "Access-Control-Allow-Origin": "*"
        });
        const responseBody = { at1: "Hola", at2: "adios" };
        res.write(JSON.stringify(responseBody));
        log(res);
        res.end();
        break;
      case '/api/localizaciones':
        res.writeHead(200, {
          'Content-Type': 'application/json',
          "Access-Control-Allow-Origin": "*"
        });

        const responseBody1 = latYlong();
        res.write(JSON.stringify(responseBody1));
        log(res);
        res.end();
        break;
      default:    // page not found
        res.writeHead(404);
        res.end();
    }
  }
}

function latYlong() {
  var latYlong = [];
  for (let client of clients) {
    //log(client.usuario);
    latYlong.push({ nickname: client.usuario.username, latitud: client.usuario.latitud, longitud: client.usuario.longitud });
  }
  return latYlong;
}

function onSocketConnect(ws) {
  clients.add(ws);

  log(`new connection`);

  ws.on('message', function (message) {
    //log(message);
    let obj = JSON.parse(message);

    switch (obj.tipus) {
      case "usuarioLogin":
        ws.nickname = obj.nickname;
        log("Connection from " + ws.nickname);
        //users.push(new Usuario(ws.nickname, obj.nom, obj.dni, obj.direccion, obj.longitud, obj.latitud));
        //users += ws.nom + ", ";
        ws.usuario = new Usuario(ws.nickname, obj.nom, obj.dni, obj.direccion, obj.longitud, obj.latitud);
        for (let client of clients) {
          //client.send(' 🟢 "'+ws.usuario.username + '" ha entrado en el chat.');
          client.send(JSON.stringify({ tipo: "i", mensaje: ' 🟢 "' + ws.usuario.username + '" ha entrado en el chat.' }));
        }

        log(ws.usuario);
        break;
      case "login":
        ws.nom = obj.content;
        log("Connection from " + ws.nom);
        //users.push(new Usuario(ws.nom, ws.nom));
        //users += ws.nom + ", ";
        break;
      case "data":
        log(`message received: ${obj.tipus} - ${obj.content}`);
        //log(`message received: ${message}`);
        for (let client of clients) {
          client.send(JSON.stringify({ tipo: "m", nickname: ws.nickname, mensaje: ws.nickname + ": " + obj.content }));
        }
        break;
      case "dataPrivado":
        log(`message received: ${obj.tipus} - ${obj.de} - ${obj.para} - ${obj.content}`);
        //log(`message received: ${message}`);
        for (let client of clients) {
          if (client.usuario.username == obj.de || client.usuario.username == obj.para) {
            client.send(JSON.stringify({ tipo: "mp", nickname: ws.nickname, mensaje: "susurro de " + ws.nickname + ": " + obj.content }));
          }
        }
        break;
      default:
        log("Tipus erroni:" + obj.tipus);
    }
  });

  ws.on('close', function () {
    log(`connection closed`);
    for (let client of clients) {
      client.send(JSON.stringify({ tipo: "i", mensaje: ' 🔴 "' + ws.usuario.username + '" ha salido del chat.' }));
    }
    clients.delete(ws);
  });
}

/*
try {
} catch (error) {
  log(error);
}
*/