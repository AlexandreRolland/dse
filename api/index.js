const { Server } = require("socket.io");
const { createServer } = require("http");

// Données initiales
const barValues = [0, 0, 0];

module.exports = (req, res) => {
    // Initialisation du serveur WebSocket si ce n'est pas déjà fait
    if (!res.socket.server.io) {
        console.log("Démarrage du serveur WebSocket...");
        const httpServer = createServer();
        const io = new Server(httpServer, {
            cors: {
                origin: "*", // Permet toutes les origines
            },
        });

        // Gestion des connexions
        io.on("connection", (socket) => {
            console.log("Client connecté");

            // Envoie les valeurs actuelles
            socket.emit("updateBars", barValues);

            // Mise à jour des données
            socket.on("increment", (data) => {
                const { barIndex } = data;
                barValues[barIndex]++;
                io.emit("updateBars", barValues); // Diffuse les nouvelles données
            });
        });

        res.socket.server.io = io;
        res.socket.server.httpServer = httpServer;
        httpServer.listen(0); // Nécessaire pour les fonctions serverless
    }
    res.end("WebSocket API ready");
};
