// src/api/WebSocketService.js
import { io } from "socket.io-client";

// Replace with your actual WebSocket server URL
const SOCKET_SERVER_URL = "https://websocket-server-hackathon-europe.onrender.com";

class WebSocketService {
    constructor() {
        this.socket = null;
        this.userId = null;
    }

    // ✅ Connect to WebSocket Server
    connect(userId) {
        this.userId = userId;
        if (!this.socket) {
            this.socket = io(SOCKET_SERVER_URL, {
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 2000,
                transports: ["websocket"],
                query: {
                    userId: userId   // Send userId as a query parameter
                }
            });
    
            this.socket.on("connect", () => {
                console.log("✅ Connected to WebSocket server:", this.socket.id);
                this.socket.emit("register", userId);
            });
    
            this.socket.on("connect_error", (err) => {
                console.error("❌ Connection Error:", err);
            });
    
            this.socket.on("disconnect", (reason) => {
                console.warn("⚠️ Disconnected:", reason);
                this.socket = null;
                setTimeout(() => {
                    console.log("🔄 Reconnecting...");
                    this.connect(userId);
                }, 3000);
            });
        }
    }

    // ✅ Ensure WebSocket connection before emitting events
    ensureConnection(userId) {
        if (!this.socket) {
            console.warn("⚠️ WebSocket not initialized. Reconnecting...");
            this.connect(userId);
        }
    }

    // 🔄 Disconnect WebSocket
    disconnect() {
        if (this.socket) {
            console.log("🔌 Disconnecting WebSocket...");
            this.socket.disconnect();
            this.socket = null;
        }
    }

    // 🔥 ==============================
    //        GAME INVITES
    // 🔥 ==============================

    // 🎮 Send Game Invite
    sendGameInvite(senderId, receiverId, gameType) {
        this.ensureConnection(senderId);
        if (this.socket) {
            console.log(`🚀 Sending game invite from ${senderId} to ${receiverId} for ${gameType}`);
            this.socket.emit("invite", { senderId, receiverId, gameType });
        } else {
            console.error("❌ WebSocket connection not established.");
        }
    }

    // 🎮 Listen for Game Invite
    onGameInvite(callback) {
        this.ensureConnection();
        if (this.socket) {
            this.socket.on("receive-invite", (data) => {
                console.log("📨 Game Invite Received:", data);
                callback(data);
            });
        }
    }

    // 🎮 Accept Game Invite
    acceptGameInvite(senderId, receiverId, gameType) {
        this.ensureConnection(receiverId);
        if (this.socket) {
            console.log(`✅ Accepting game invite from ${senderId}`);
            this.socket.emit("accept-invite", { senderId, receiverId, gameType });
        } else {
            console.error("❌ WebSocket connection not established.");
        }
    }

    // 🎮 Listen for Invite Acceptance
    onInviteAccepted(callback) {
        this.ensureConnection();
        if (this.socket) {
            this.socket.on("invite-accepted", (data) => {
                console.log("✅ Invite Accepted:", data);
                callback(data);
            });
        }
    }

    // 🔥 ==============================
    //        CHECKERS EVENTS
    // 🔥 ==============================

    // 🎲 Start Checkers Game
    startCheckersGame(gameData) {
        this.ensureConnection(gameData.senderId);
        if (this.socket) {
            console.log("🚀 Starting Checkers Game:", gameData);
            this.socket.emit("checkers-game-start", gameData);
        } else {
            console.error("❌ WebSocket connection not established.");
        }
    }

    // 🎲 Listen for Checkers Game Start
    onCheckersGameStart(callback) {
        this.ensureConnection();
        if (this.socket) {
            this.socket.on("checkers-game-start", (data) => {
                console.log("♟️ Checkers Game Started:", data);
                callback(data);
            });
        }
    }

    // 🎲 Send Checkers Move
    sendCheckersMove(moveData) {
        this.ensureConnection(moveData.senderId);
        if (this.socket) {
            console.log("🎲 Sending Checkers Move:", moveData);
            this.socket.emit("checkers-move", moveData);
        } else {
            console.error("❌ WebSocket connection not established.");
        }
    }

    // 🎲 Listen for Opponent's Checkers Move
    onCheckersMove(callback) {
        this.ensureConnection();
        if (this.socket) {
            this.socket.on("checkers-move", (data) => {
                console.log("♟️ Opponent's Checkers Move:", data);
                callback(data);
            });
        }
    }

    // 🎲 Send Checkers Game Over
    sendCheckersGameOver(gameOverData) {
        this.ensureConnection(gameOverData.winner);
        if (this.socket) {
            console.log("🏆 Checkers Game Over:", gameOverData);
            this.socket.emit("checkers-game-over", gameOverData);
        } else {
            console.error("❌ WebSocket connection not established.");
        }
    }

    // 🎲 Listen for Checkers Game Over
    onCheckersGameOver(callback) {
        this.ensureConnection();
        if (this.socket) {
            this.socket.on("checkers-game-over", (data) => {
                console.log("🏆 Checkers Game Over:", data);
                callback(data);
            });
        }
    }

    // 🔥 ==============================
    //  SNAKES & LADDERS EVENTS
    // 🔥 ==============================

    // 🎲 Start Snakes & Ladders Game
    startSnakesGame(gameData) {
        this.ensureConnection(gameData.senderId);
        if (this.socket) {
            console.log("🚀 Starting Snakes & Ladders Game:", gameData);
            this.socket.emit("snakes-game-start", gameData);
        } else {
            console.error("❌ WebSocket connection not established.");
        }
    }

    // 🎲 Listen for Snakes & Ladders Game Start
    onSnakesGameStart(callback) {
        this.ensureConnection();
        if (this.socket) {
            this.socket.on("snakes-game-start", (data) => {
                console.log("🐍🪜 Snakes & Ladders Game Started:", data);
                callback(data);
            });
        }
    }

    // 🎲 Send Snakes & Ladders Move
    sendSnakesMove(moveData) {
        this.ensureConnection(moveData.senderId);
        if (this.socket) {
            console.log("🎲 Sending Snakes & Ladders Move:", moveData);
            this.socket.emit("snakes-move", moveData);
        } else {
            console.error("❌ WebSocket connection not established.");
        }
    }

    // 🎲 Listen for Opponent's Snakes & Ladders Move
    onSnakesOpponentMove(callback) {
        this.ensureConnection();
        if (this.socket) {
            this.socket.on("snakes-move", (data) => {
                console.log("🐍🪜 Opponent's Move:", data);
                callback(data);
            });
        }
    }

    // 🎲 Listen for Snakes & Ladders Game Over
    onSnakesGameOver(callback) {
        this.ensureConnection();
        if (this.socket) {
            this.socket.on("snakes-game-over", (data) => {
                console.log("🏆 Snakes & Ladders Game Over:", data);
                callback(data);
            });
        }
    }
}

export default new WebSocketService();
