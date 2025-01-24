const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Permet l'accès de n'importe quelle origine
    },
});

// Données des barres
let barValues = [0, 0, 0];

// Connexion Socket.io
io.on("connection", (socket) => {
    console.log("Un client est connecté");

    // Envoie les valeurs initiales des barres
    socket.emit("updateBars", barValues);

    // Réception des demandes d'incrémentation
    socket.on("increment", (data) => {
        const { barIndex } = data;
        if (barIndex >= 0 && barIndex < barValues.length) {
            barValues[barIndex]++;
            io.emit("updateBars", barValues); // Diffuse les nouvelles valeurs
        }
    });
});

const PORT = process.env.PORT || 3001; // Utilise le port défini par Vercel
server.listen(PORT, () => {
    console.log(`Serveur WebSocket en cours d'exécution sur le port ${PORT}`);
});
