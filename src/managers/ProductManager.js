import { promises as fs } from 'fs';
import { randomUUID } from 'crypto';

export default class ProductManager {
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


async getProducts() {
return await this.#read();
}

async getProductById(id) {
const list = await this.#read();
return list.find(p => String(p.id) === String(id)) || null;
}

async addProduct(data) {
const required = ['title','description','code','price','stock','category'];
for (const f of required) {
if (data[f] === undefined || data[f] === null || data[f] === '') {
throw new Error(`Campo requerido faltante: ${f}`);
}
}

const list = await this.#read();


if (list.some(p => p.code === data.code)) {
throw new Error('Ya existe un producto con ese code');
}

const product = {
    id: randomUUID(),
    title: String(data.title),
    description: String(data.description),
    code: String(data.code),
    price: Number(data.price),
    status: data.status === undefined ? true : Boolean(data.status),
    stock: Number(data.stock),
    category: String(data.category),
    thumbnails: Array.isArray(data.thumbnails) ? data.thumbnails.map(String) : []
};

list.push(product);
await this.#write(list);
return product;
}


async updateProduct(id, updates) {
    if (updates.id !== undefined) {
    throw new Error('No se permite actualizar el id');
}

const list = await this.#read();
const idx = list.findIndex(p => String(p.id) === String(id));
if (idx === -1) throw new Error('Producto no encontrado');



if (updates.code && list.some(p => p.code === updates.code && String(p.id) !== String(id))) {
throw new Error('Ya existe un producto con ese code');
}

const updated = { ...list[idx], ...updates };


if (updated.price !== undefined) updated.price = Number(updated.price);
if (updated.stock !== undefined) updated.stock = Number(updated.stock);
if (updated.status !== undefined) updated.status = Boolean(updated.status);
if (updated.thumbnails !== undefined) {
updated.thumbnails = Array.isArray(updated.thumbnails) ? updated.thumbnails.map(String) : [];
}

list[idx] = updated;
    await this.#write(list);
    return updated;
}

async deleteProduct(id) {
    const list = await this.#read();
    const idx = list.findIndex(p => String(p.id) === String(id));
    if (idx === -1) throw new Error('Producto no encontrado');
    const [removed] = list.splice(idx, 1);
    await this.#write(list);
    return removed;
    }
}
