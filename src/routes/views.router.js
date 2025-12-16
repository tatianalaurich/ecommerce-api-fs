import { Router } from 'express';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import ProductManager from '../managers/ProductManager.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const productsManager = new ProductManager(resolve(__dirname, '../../data/products.json'));

const router = Router();

router.get('/home', async (req, res) => {
    const products = await productsManager.getProducts();
    res.render('home', { products, title: 'Home' });
});

router.get('/realtimeproducts', async (req, res) => {
    const products = await productsManager.getProducts();
    res.render('realTimeProducts', { products, title: 'Real-time Products' });
});

export default router;
