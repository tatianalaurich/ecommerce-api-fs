import { Router } from "express";
import { ProductModel } from "../models/product.model.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const products = await ProductModel.find().lean();
        res.json({ status: "success", payload: products });
    } catch (err) {
        res.status(500).json({ status: "error", error: err.message });
    }
});

router.get("/:pid", async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.pid).lean();
        if (!product) return res.status(404).json({ status: "error", error: "Producto no encontrado" });
        res.json({ status: "success", payload: product });
    } catch (err) {
        res.status(400).json({ status: "error", error: "ID inválido" });
    }
});

router.post("/", async (req, res) => {
    try {
        const created = await ProductModel.create(req.body);
        res.status(201).json({ status: "success", payload: created });
    } catch (err) {
        res.status(400).json({ status: "error", error: err.message });
    }
});

router.put("/:pid", async (req, res) => {
    try {
        const updated = await ProductModel.findByIdAndUpdate(
        req.params.pid,
        req.body,
        { new: true }
        ).lean();

        if (!updated) return res.status(404).json({ status: "error", error: "Producto no encontrado" });
        res.json({ status: "success", payload: updated });
    } catch (err) {
        res.status(400).json({ status: "error", error: "ID inválido" });
    }
});

router.delete("/:pid", async (req, res) => {
    try {
        const deleted = await ProductModel.findByIdAndDelete(req.params.pid);
        if (!deleted) return res.status(404).json({ status: "error", error: "Producto no encontrado" });
        res.json({ status: "success", message: "Producto eliminado" });
    } catch (err) {
        res.status(400).json({ status: "error", error: "ID inválido" });
    }
});

export default router;
