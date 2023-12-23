import express from 'express';
import dotenv from 'dotenv';
import connectDb from './db/connectDb.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoute.js';
import postRoutes from './routes/postRoute.js';
import http from 'http';
import { WebSocketServer } from 'ws'; // Import WebSocket module
// Import missing type declaration file
// Intializations
dotenv.config();
connectDb();
const app = express();
//const WebSocketServer = ws.Server; // Create WebSocketServer class
const server = http.createServer(app);
const wss = new WebSocketServer({ server }); // Create WebSocketServer instance
const PORT = process.env.PORT || 3000; // Use a default port if PORT is not defined in the environment variables
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));
wss.on("connection", async (ws, req) => {
    ws.on("message", (message) => {
        const data = JSON.parse(message.toString());
        const msg = data.payload.message;
        console.log("received: %s", message);
        ws.send(JSON.stringify({ type: "message", payload: { msg } }));
    });
});
// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
server.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map