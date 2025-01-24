// index.js - Serveur WebSocket avec Express et Socket.io
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Autorise toutes les origines pour les tests
    },
});

// Données initiales des barres
let barValues = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // 9 barres

// Middleware pour logger chaque requête HTTP
app.use((req, res, next) => {
    console.log(`[HTTP] ${req.method} ${req.url}`);
    next();
});

// Route de test pour vérifier si le backend fonctionne
app.get("/health", (req, res) => {
    console.log("[TEST] Route /health appelée");
    res.status(200).json({ status: "ok", barValues });
});

// Serve les fichiers publics
app.use(express.static("public"));

// Événements WebSocket
io.on("connection", (socket) => {
    console.log("[Socket.io] Un client est connecté :", socket.id);

    // Envoi des valeurs initiales des barres
    console.log("[Socket.io] Envoi des valeurs initiales :", barValues);
    socket.emit("updateBars", barValues);

    // Quand un client demande une incrémentation
    socket.on("increment", (data) => {
        console.log("[Socket.io] Demande d'incrément reçue :", data);

        const { barIndex } = data;

        if (barIndex >= 0 && barIndex < barValues.length) {
            if (barValues[barIndex] < 100) {  // Assure-toi que la barre ne dépasse pas 100
                barValues[barIndex]++;
                console.log(`[Socket.io] Nouvelle valeur des barres : ${barValues}`);
                io.emit("updateBars", barValues); // Diffuse les nouvelles données
            }
        } else {
            console.error(`[Socket.io] Index invalide reçu : ${barIndex}`);
        }
    });

    // Quand un client se déconnecte
    socket.on("disconnect", () => {
        console.log("[Socket.io] Client déconnecté :", socket.id);
    });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`[Serveur] Le serveur tourne sur le port ${PORT}`);
});
