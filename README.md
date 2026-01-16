# Ecommerce API FS 🛍️

Servidor backend desarrollado con **Node.js y Express**, utilizando **MongoDB (Atlas)** como sistema de persistencia principal.  
Proyecto correspondiente a la **Entrega Final** del curso **Programación Backend I – Coderhouse**.

## 🚀 Cómo ejecutar

1. Clonar el repositorio  
    ```bash
    git clone https://github.com/tatianalaurich/ecommerce-api-fs.git
    cd ecommerce-api-fs


💻 Vistas con Handlebars

/products
    Muestra todos los productos con: 
        - paginación
        - filtros
        - ordenamiento por precio
    Incluye botón “Agregar al carrito” directamente desde la lista.

/products/:pid
    Vista detalle del producto:
        - descripción completa
        - precio
        - categoría
        - botón Agregar al carrito

/carts/:cid
    - Muestra un carrito específico
    - Lista únicamente los productos pertenecientes a ese carrito (con populate)
Para la demostración del botón “Agregar al carrito” se utiliza un cartId fijo generado previamente.


🧠 Tecnologías utilizadas

- Node.js
- Express
- MongoDB + Mongoose
- mongoose-paginate-v2
- Express-Handlebars
- Socket.IO
- JavaScript


✨ Autor

Tatiana Laurich 
📅 Curso de Programación Backend – Coderhouse

