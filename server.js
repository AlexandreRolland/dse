const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let barValues = [0, 0, 0]; // Données initiales

io.on('connection', (socket) => {
    console.log('Client connecté');

    // Envoie les valeurs initiales
    socket.emit('updateBars', barValues);

    // Réception des mises à jour
    socket.on('increment', (data) => {
        const { barIndex } = data;
        barValues[barIndex]++;
        io.emit('updateBars', barValues); // Diffuse les nouvelles données
    });
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Serveur WebSocket en cours d'exécution sur le port ${PORT}`);
});
