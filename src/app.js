import express from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { engine } from "express-handlebars";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer);

app.set("io", io);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(resolve(__dirname, "../public")));

app.engine("handlebars", engine({
    helpers: {
        eq: (a, b) => String(a) === String(b),
    }
}));
app.set("view engine", "handlebars");
app.set("views", resolve(__dirname, "./views"));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

app.get("/", (req, res) => {
    res.send("API OK ✅ Usá /api/products, /api/carts, y las vistas /products y /carts/:cid");
});

io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);
});

const PORT = 8080;

await connectDB();

httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
