const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Autorise toutes les origines pour le débogage
    },
});

// Données initiales des barres
let barValues = [0, 0, 0];

// Middleware pour logger chaque requête HTTP
app.use((req, res, next) => {
    console.log(`[HTTP] ${req.method} ${req.url}`);
    next();
});

// Route de test pour voir si le backend fonctionne
app.get("/health", (req, res) => {
    console.log("[TEST] Route /health appelée");
    res.status(200).json({ status: "ok", barValues });
});

// Événements Socket.io
io.on("connection", (socket) => {
    console.log("[Socket.io] Un client est connecté :", socket.id);

    // Log initial des données envoyées
    console.log("[Socket.io] Envoi des valeurs initiales :", barValues);
    socket.emit("updateBars", barValues);

    // Log quand un client déconnecte
    socket.on("disconnect", () => {
        console.log("[Socket.io] Client déconnecté :", socket.id);
    });

    // Log pour chaque mise à jour des barres
    socket.on("increment", (data) => {
        console.log("[Socket.io] Demande d'incrément reçue :", data);

        const { barIndex } = data;

        if (barIndex >= 0 && barIndex < barValues.length) {
            barValues[barIndex]++;
            console.log(`[Socket.io] Nouvelle valeur des barres : ${barValues}`);
            io.emit("updateBars", barValues); // Diffusion des nouvelles données
        } else {
            console.error(`[Socket.io] Index invalide reçu : ${barIndex}`);
        }
    });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`[Serveur] Le serveur tourne sur le port ${PORT}`);
});
