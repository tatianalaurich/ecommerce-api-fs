import { promises as fs } from 'fs';
import { randomUUID } from 'crypto';


export default class CartManager {
constructor(path) {
this.path = path;
}

async #read() {
try {
const data = await fs.readFile(this.path, 'utf-8');
return JSON.parse(data || '[]');
} catch {
return [];
}
}


async #write(list) {
await fs.writeFile(this.path, JSON.stringify(list, null, 2));
}

async createCart() {
const list = await this.#read();
const cart = { id: randomUUID(), products: [] };
list.push(cart);
await this.#write(list);
return cart;
}


async getCartById(id) {
    const list = await this.#read();
    const cart = list.find(c => String(c.id) === String(id));
    if (!cart) return [];
    return cart.products;
}


async addProductToCart(cartId, productId, qty = 1) {
if (qty <= 0) qty = 1;
const list = await this.#read();
const idx = list.findIndex(c => String(c.id) === String(cartId));
if (idx === -1) throw new Error('Carrito no encontrado');


const cart = list[idx];
const item = cart.products.find(it => String(it.product) === String(productId));
if (item) {
item.quantity += qty;
} else {
cart.products.push({ product: String(productId), quantity: qty });
}

list[idx] = cart;
await this.#write(list);
return cart;
}
}