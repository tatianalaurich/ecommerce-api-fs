import { Router } from "express";
import { CartModel } from "../models/cart.model.js";
import { ProductModel } from "../models/product.model.js";

const router = Router();

router.post("/", async (req, res) => {
    try {
        const cart = await CartModel.create({ products: [] });
        res.status(201).json({ status: "success", payload: cart });
    } catch (err) {
        res.status(500).json({ status: "error", error: err.message });
    }
});

router.get("/:cid", async (req, res) => {
    try {
        const cart = await CartModel.findById(req.params.cid)
        .populate("products.product")
        .lean();

        if (!cart) return res.status(404).json({ status: "error", error: "Carrito no encontrado" });

        res.json({ status: "success", payload: cart });
    } catch (err) {
        res.status(400).json({ status: "error", error: "ID inválido" });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cart = await CartModel.findById(req.params.cid);
        if (!cart) return res.status(404).json({ status: "error", error: "Carrito no encontrado" });

        const product = await ProductModel.findById(req.params.pid);
        if (!product) return res.status(404).json({ status: "error", error: "Producto no encontrado" });

        const idx = cart.products.findIndex(
        (p) => p.product.toString() === product._id.toString()
        );

        if (idx >= 0) cart.products[idx].quantity += 1;
        else cart.products.push({ product: product._id, quantity: 1 });

        await cart.save();

        res.json({ status: "success", payload: cart });
    } catch (err) {
        res.status(400).json({ status: "error", error: "IDs inválidos" });
    }
});

export default router;
