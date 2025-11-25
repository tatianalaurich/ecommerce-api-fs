import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';


const __dirname = dirname(fileURLToPath(import.meta.url));
const manager = new ProductManager(resolve(__dirname, '../../data/products.json'));


const router = Router();

router.get('/', async (req, res) => {
try {
const products = await manager.getProducts();
res.json(products);
} catch (err) {
res.status(500).json({ error: err.message });
}
});


router.get('/:pid', async (req, res) => {
try {
const product = await manager.getProductById(req.params.pid);
if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
res.json(product);
} catch (err) {
res.status(500).json({ error: err.message });
}
});


router.post('/', async (req, res) => {
try {
const created = await manager.addProduct(req.body);
res.status(201).json(created);
} catch (err) {
res.status(400).json({ error: err.message });
}
});


router.put('/:pid', async (req, res) => {
try {
const updated = await manager.updateProduct(req.params.pid, req.body);
res.json(updated);
} catch (err) {
const code = err.message.includes('no encontrado') ? 404 : 400;
res.status(code).json({ error: err.message });
}
});


router.delete('/:pid', async (req, res) => {
try {
const removed = await manager.deleteProduct(req.params.pid);
res.json({ deleted: removed });
} catch (err) {
const code = err.message.includes('no encontrado') ? 404 : 400;
res.status(code).json({ error: err.message });
}
});

export default router;