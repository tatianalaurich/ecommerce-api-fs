import { Router } from "express";
import { ProductModel } from "../models/product.model.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 10;
        const page = Number(req.query.page) || 1;
        const sort = req.query.sort; 
        const query = req.query.query;

        const filter = {};
        if (query) {
            if (query === "available") filter.status = true;
            else if (query === "unavailable") filter.status = false;
            else filter.category = query;
        }

        const options = { page, limit, lean: true };
        if (sort === "asc") options.sort = { price: 1 };
        if (sort === "desc") options.sort = { price: -1 };

        const result = await ProductModel.paginate(filter, options);

        const base = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
        const makeLink = (p) => {
            const params = new URLSearchParams();
            params.set("limit", String(limit));
            params.set("page", String(p));
            if (sort) params.set("sort", sort);
            if (query) params.set("query", query);
            return `${base}?${params.toString()}`;
        };

    return res.json({
        status: "success",
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? makeLink(result.prevPage) : null,
        nextLink: result.hasNextPage ? makeLink(result.nextPage) : null,
        });
    } catch (err) {
        return res.status(500).json({ status: "error", error: err.message });
    }
});

router.get("/:pid", async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.pid).lean();
        if (!product) return res.status(404).json({ status: "error", error: "Producto no encontrado" });
        return res.json({ status: "success", payload: product });
    } catch (err) {
        return res.status(400).json({ status: "error", error: err.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const created = await ProductModel.create(req.body);

        const io = req.app.get("io");
        if (io) {
        const all = await ProductModel.find().lean();
        io.emit("products:updated", all);
        }

        return res.status(201).json({ status: "success", payload: created });
    } catch (err) {
        return res.status(400).json({ status: "error", error: err.message });
    }
});

router.put("/:pid", async (req, res) => {
    try {
        if ("_id" in req.body) delete req.body._id;

        const updated = await ProductModel.findByIdAndUpdate(req.params.pid, req.body, { new: true }).lean();
        if (!updated) return res.status(404).json({ status: "error", error: "Producto no encontrado" });

        const io = req.app.get("io");
        if (io) {
        const all = await ProductModel.find().lean();
        io.emit("products:updated", all);
        }

        return res.json({ status: "success", payload: updated });
    } catch (err) {
        return res.status(400).json({ status: "error", error: err.message });
    }
});

router.delete("/:pid", async (req, res) => {
    try {
        const deleted = await ProductModel.findByIdAndDelete(req.params.pid).lean();
        if (!deleted) return res.status(404).json({ status: "error", error: "Producto no encontrado" });

        const io = req.app.get("io");
        if (io) {
        const all = await ProductModel.find().lean();
        io.emit("products:updated", all);
        }

        return res.json({ status: "success", payload: deleted });
    } catch (err) {
        return res.status(400).json({ status: "error", error: err.message });
    }
});

export default router;
