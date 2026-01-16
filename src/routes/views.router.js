import { Router } from "express";
import { ProductModel } from "../models/product.model.js";
import { CartModel } from "../models/cart.model.js";

const router = Router();

router.get("/home", (req, res) => {
    res.redirect("/products");
});

router.get("/products", async (req, res) => {
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

    res.render("index", {
        title: "Productos",
        products: result.docs,
        page: result.page,
        totalPages: result.totalPages,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        limit,
        sort,
        query
    });
});

router.get("/products/:pid", async (req, res) => {
    const product = await ProductModel.findById(req.params.pid).lean();
    if (!product) return res.status(404).send("Producto no encontrado");

    res.render("productDetail", {
        title: product.title,
        product
    });
});

router.get("/carts/:cid", async (req, res) => {
    const cart = await CartModel.findById(req.params.cid)
        .populate("products.product")
        .lean();

    if (!cart) return res.status(404).send("Carrito no encontrado");

    res.render("cartDetail", {
        title: "Carrito",
        cart
    });
});

export default router;

