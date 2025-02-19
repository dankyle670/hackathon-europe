import { io } from "socket.io-client";

// Replace with your actual WebSocket server URL
const SOCKET_SERVER_URL = "https://websocket-server-hackathon-europe.onrender.com";

class WebSocketService {
    constructor() {
        this.socket = null;
    }

    // Connect to WebSocket
    connect(userId) {
        if (!this.socket) {
            this.socket = io(SOCKET_SERVER_URL, {
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 2000,
                transports: ["websocket"], // Ensure only WebSocket transport
            });

            this.socket.on("connect", () => {
                console.log("Connected to WebSocket server:", this.socket.id);
                this.socket.emit("register", userId);
            });

            this.socket.on("connect_error", (err) => {
                console.error("Connection Error:", err);
            });

            this.socket.on("disconnect", (reason) => {
                console.warn("Disconnected:", reason);
                this.socket = null; // Reset socket
                setTimeout(() => {
                    console.log("Reconnecting...");
                    this.connect(userId);
                }, 3000);
            });
        }
    }

    // Ensure WebSocket connection before emitting events
    ensureConnection(userId) {
        if (!this.socket) {
            console.warn("WebSocket not initialized. Reconnecting...");
            this.connect(userId);
        }
    }

    // Send game invite
    sendGameInvite(senderId, receiverId) {
        this.ensureConnection(senderId);
        if (this.socket) {
            console.log(`Sending game invite from ${senderId} to ${receiverId}`);
            this.socket.emit("invite", { senderId, receiverId });
        } else {
            console.error("WebSocket connection not established.");
        }
    }

    // Accept game invite
    acceptGameInvite(senderId, receiverId) {
        this.ensureConnection(receiverId);
        if (this.socket) {
            console.log(`Accepting game invite from ${senderId}`);
            this.socket.emit("accept-invite", { senderId, receiverId });
        } else {
            console.error("WebSocket connection not established.");
        }
    }

    // Listen for game invites
    onGameInvite(callback) {
        this.ensureConnection();
        if (this.socket) {
            this.socket.on("receive-invite", callback);
        }
    }

    // Listen for invite acceptance
    onInviteAccepted(callback) {
        this.ensureConnection();
        if (this.socket) {
            this.socket.on("invite-accepted", callback);
        }
    }

    // Send a move in multiplayer
    sendMove(moveData) {
        this.ensureConnection();
        if (this.socket) {
            this.socket.emit("player-move", moveData);
        }
    }

    // Listen for opponent moves
    onOpponentMove(callback) {
        this.ensureConnection();
        if (this.socket) {
            this.socket.on("player-move", callback);
        }
    }

    // Disconnect WebSocket
    disconnect() {
        if (this.socket) {
            console.log("Disconnecting WebSocket...");
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

export default new WebSocketService();
