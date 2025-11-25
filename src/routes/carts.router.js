import { Router } from 'express';
import CartManager from '../managers/CartManager.js';
import ProductManager from '../managers/ProductManager.js';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';


const __dirname = dirname(fileURLToPath(import.meta.url));
const carts = new CartManager(resolve(__dirname, '../../data/carts.json'));
const products = new ProductManager(resolve(__dirname, '../../data/products.json'));

const router = Router();


router.post('/', async (req, res) => {
try {
const cart = await carts.createCart();
res.status(201).json(cart);
} catch (err) {
res.status(500).json({ error: err.message });
}
});


router.get('/:cid', async (req, res) => {
    try {
        const cartProducts = await carts.getCartById(req.params.cid);
        res.json(cartProducts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.post('/:cid/product/:pid', async (req, res) => {
try {
const { cid, pid } = req.params;


const prod = await products.getProductById(pid);
if (!prod) return res.status(404).json({ error: 'Producto no existe' });


const updated = await carts.addProductToCart(cid, pid, 1);
res.status(201).json(updated);
} catch (err) {
const code = err.message.includes('no encontrado') ? 404 : 400;
res.status(code).json({ error: err.message });
}
});


export default router;