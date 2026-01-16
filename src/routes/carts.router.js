import { Router } from "express";
import { CartModel } from "../models/cart.model.js";
import { ProductModel } from "../models/product.model.js";

const router = Router();

router.post("/", async (req, res) => {
    try {
        const cart = await CartModel.create({ products: [] });
        return res.status(201).json({ status: "success", payload: cart });
    } catch (err) {
        return res.status(500).json({ status: "error", error: err.message });
    }
});

router.get("/:cid", async (req, res) => {
    try {
        const cart = await CartModel.findById(req.params.cid).populate("products.product").lean();
        if (!cart) return res.status(404).json({ status: "error", error: "Carrito no encontrado" });
        return res.json({ status: "success", payload: cart });
    } catch (err) {
        return res.status(400).json({ status: "error", error: err.message });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const prod = await ProductModel.findById(pid);
        if (!prod) return res.status(404).json({ status: "error", error: "Producto no existe" });

        const cart = await CartModel.findById(cid);
        if (!cart) return res.status(404).json({ status: "error", error: "Carrito no encontrado" });

        const item = cart.products.find(p => String(p.product) === String(pid));
        if (item) item.quantity += 1;
        else cart.products.push({ product: pid, quantity: 1 });

        await cart.save();
        return res.status(201).json({ status: "success", payload: cart });
    } catch (err) {
        return res.status(400).json({ status: "error", error: err.message });
    }
});

router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const cart = await CartModel.findById(req.params.cid);
        if (!cart) return res.status(404).json({ status: "error", error: "Carrito no encontrado" });

        cart.products = cart.products.filter(p => String(p.product) !== String(req.params.pid));
        await cart.save();

        return res.json({ status: "success", payload: cart });
    } catch (err) {
        return res.status(400).json({ status: "error", error: err.message });
    }
});

router.put("/:cid", async (req, res) => {
    try {
        const { products } = req.body;
        if (!Array.isArray(products)) {
        return res.status(400).json({ status: "error", error: "products debe ser un array" });
        }

        const cart = await CartModel.findById(req.params.cid);
        if (!cart) return res.status(404).json({ status: "error", error: "Carrito no encontrado" });

        cart.products = products;
        await cart.save();

        return res.json({ status: "success", payload: cart });
    } catch (err) {
        return res.status(400).json({ status: "error", error: err.message });
    }
});

router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const quantity = Number(req.body.quantity);
        if (!Number.isFinite(quantity) || quantity < 1) {
        return res.status(400).json({ status: "error", error: "quantity inválida" });
        }

        const cart = await CartModel.findById(req.params.cid);
        if (!cart) return res.status(404).json({ status: "error", error: "Carrito no encontrado" });

        const item = cart.products.find(p => String(p.product) === String(req.params.pid));
        if (!item) return res.status(404).json({ status: "error", error: "Producto no está en el carrito" });

        item.quantity = quantity;
        await cart.save();

        return res.json({ status: "success", payload: cart });
    } catch (err) {
        return res.status(400).json({ status: "error", error: err.message });
    }
});

router.delete("/:cid", async (req, res) => {
    try {
        const cart = await CartModel.findById(req.params.cid);
        if (!cart) return res.status(404).json({ status: "error", error: "Carrito no encontrado" });

        cart.products = [];
        await cart.save();

        return res.json({ status: "success", payload: cart });
    } catch (err) {
        return res.status(400).json({ status: "error", error: err.message });
    }
});

router.get("/", (req, res) => {
    res.json({
        status: "success",
        message: "Usá POST /api/carts para crear y GET /api/carts/:cid para ver un carrito"
    });
});

export default router;
