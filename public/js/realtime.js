const socket = io();

const list = document.getElementById('list');
const form = document.getElementById('createForm');

function renderProducts(products) {
    if (!products.length) {
        list.innerHTML = '<p>No hay productos aún.</p>';
        return;
    }
    list.innerHTML = products.map(p => `
        <div class="card" data-id="${p.id}">
        <strong>${p.title}</strong> — $${p.price} — stock: ${p.stock}
        <div class="muted">${p.description || ''}</div>
        <div>id: <code>${p.id}</code></div>
        <button class="deleteBtn" data-id="${p.id}">Eliminar</button>
        </div>
    `).join('');
}

socket.on('products:updated', (products) => {
    renderProducts(products);
});

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const payload = {
        title: fd.get('title'),
        description: fd.get('description'),
        code: fd.get('code'),
        price: Number(fd.get('price')),
        status: true,
        stock: Number(fd.get('stock')),
        category: fd.get('category'),
        thumbnails: fd.get('thumbnails') ? fd.get('thumbnails').split(',').map(s => s.trim()) : []
        };

    const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
        });
        if (!res.ok) {
        const err = await res.json().catch(()=>({error:'Error'}));
        alert('Error: ' + (err.error || res.statusText));
        return;
        }
        form.reset();
    });
}

list?.addEventListener('click', async (e) => {
    const btn = e.target.closest('.deleteBtn');
    if (!btn) return;
    const id = btn.dataset.id;
    if (!confirm('¿Eliminar este producto?')) return;

    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (!res.ok) {
        const err = await res.json().catch(()=>({error:'Error'}));
        alert('Error: ' + (err.error || res.statusText));
        return;
    }
});
