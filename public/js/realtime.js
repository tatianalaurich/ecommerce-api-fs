const socket = io();

const list = document.getElementById('list');
const form = document.getElementById('createForm');

function renderProducts(products) {
    if (!list) return;

    if (!products || !products.length) {
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
    console.log('[WS] products:updated', products);
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
        thumbnails: fd.get('thumbnails')
            ? fd.get('thumbnails').split(',').map(s => s.trim())
            : []
        };

        try {
        const res = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        if (!res.ok) {
            const err = await res.json().catch(()=>({error: res.statusText}));
            console.error('POST /api/products error', err);
            alert('Error al crear: ' + (err.error || res.statusText));
            return;
        }
        form.reset();
        } catch (e2) {
        console.error('POST /api/products fetch error', e2);
        alert('Error de red al crear producto');
        }
    });
}

list?.addEventListener('click', async (e) => {
    const btn = e.target.closest('.deleteBtn');
    if (!btn) return;

    const id = btn.dataset.id;
    console.log('Click eliminar id=', id);
    if (!id) {
        alert('No se encontró el ID del producto');
        return;
    }
    if (!confirm('¿Eliminar este producto?')) return;

    try {
        const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        if (!res.ok) {
        const err = await res.json().catch(()=>({error: res.statusText}));
        console.error('DELETE error', err);
        alert('Error al eliminar: ' + (err.error || res.statusText));
        return;
        }
    } catch (e2) {
        console.error('DELETE fetch error', e2);
        alert('Error de red al eliminar');
    }
});
