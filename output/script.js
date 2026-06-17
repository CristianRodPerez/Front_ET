
// Datos de ejemplo de productos (como respaldo si el backend está desconectado)
const products = [
    {
        id: 1,
        name: "Laptop HP Pavilion",
        description: "Laptop de 15.6 pulgadas, Intel Core i5, 8GB RAM, 256GB SSD",
        price: 899.99,
        stock: 15,
        icon: "💻"
    },
    {
        id: 2,
        name: "Smartphone Samsung Galaxy",
        description: "Samsung Galaxy S23, 128GB, cámara de 50MP, 5G",
        price: 799.99,
        stock: 25,
        icon: "📱"
    },
    {
        id: 3,
        name: "Auriculares Sony WH-1000XM4",
        description: "Auriculares inalámbricos con cancelación de ruido",
        price: 349.99,
        stock: 30,
        icon: "🎧"
    },
    {
        id: 4,
        name: "Tablet iPad Air",
        description: "Apple iPad Air 5ta generación, 64GB, Wi-Fi",
        price: 599.99,
        stock: 20,
        icon: "📲"
    },
    {
        id: 5,
        name: "Smartwatch Apple Watch",
        description: "Apple Watch Series 8, GPS, 45mm",
        price: 449.99,
        stock: 18,
        icon: "⌚"
    },
    {
        id: 6,
        name: "Cámara Canon EOS",
        description: "Cámara DSLR Canon EOS Rebel T7, 24.1MP",
        price: 549.99,
        stock: 12,
        icon: "📷"
    },
    {
        id: 7,
        name: "Consola PlayStation 5",
        description: "Sony PlayStation 5, 825GB SSD, con control DualSense",
        price: 499.99,
        stock: 8,
        icon: "🎮"
    },
    {
        id: 8,
        name: "Monitor Dell UltraSharp",
        description: "Monitor Dell 27 pulgadas 4K, IPS, USB-C",
        price: 429.99,
        stock: 22,
        icon: "🖥️"
    }
];

// Almacenamiento local de usuarios registrados (historial / respaldo local)
let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

// Inicializar la página
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupRegisterForm();
});

// Cargar productos en la grid (desde el Backend 2)
function loadProducts() {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666;">Cargando productos...</p>';

    fetch('http://18.234.80.151:8082/api/products')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al responder del servidor');
            }
            return response.json();
        })
        .then(data => {
            productsGrid.innerHTML = '';

            // Si la base de datos está vacía, mostramos los de ejemplo
            const listToRender = (data && data.length > 0) ? data : products;
            if (data && data.length === 0) {
                console.log("La base de datos de productos está vacía. Mostrando productos de ejemplo.");
                // Agregamos un aviso visual de que son de ejemplo
                const infoMsg = document.createElement('div');
                infoMsg.style.cssText = "grid-column: 1/-1; background: #e2e8f0; color: #4a5568; padding: 10px; border-radius: 8px; text-align: center; font-size: 0.9em; margin-bottom: 15px;";
                infoMsg.textContent = "Base de datos vacía. Mostrando catálogo de ejemplo.";
                productsGrid.appendChild(infoMsg);
            }

            listToRender.forEach(product => {
                const productCard = createProductCard(product);
                productsGrid.appendChild(productCard);
            });
        })
        .catch(error => {
            console.warn('Backend 2 (Productos) desconectado. Mostrando datos locales de respaldo:', error);
            productsGrid.innerHTML = '';

            const infoMsg = document.createElement('div');
            infoMsg.style.cssText = "grid-column: 1/-1; background: #fee2e2; color: #991b1b; padding: 10px; border-radius: 8px; text-align: center; font-size: 0.9em; margin-bottom: 15px;";
            infoMsg.textContent = "Backend de productos desconectado. Mostrando catálogo local de respaldo.";
            productsGrid.appendChild(infoMsg);

            products.forEach(product => {
                const productCard = createProductCard(product);
                productsGrid.appendChild(productCard);
            });
        });
}

// Crear tarjeta de producto
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">${product.icon || '📦'}</div>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-description">${product.description || ''}</p>
        <p class="product-price">$${Number(product.price).toFixed(2)}</p>
        <p class="product-stock">Stock: ${product.stock} unidades</p>
    `;
    return card;
}

// Configurar formulario de registro
function setupRegisterForm() {
    const form = document.getElementById('register-form');
    form.addEventListener('submit', handleRegister);
}

// Manejar registro de usuario (conectado al Backend 1)
function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validaciones locales
    if (password !== confirmPassword) {
        showMessage('Las contraseñas no coinciden', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }

    // Enviar petición al Backend 1 (User Service)
    fetch('http://54.145.125.41:8081/api/users/register'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password
        })
    })
    .then(async response => {
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Error al registrar usuario en el servidor');
        }
        return data;
    })
    .then(data => {
        showMessage('Usuario registrado exitosamente en la base de datos', 'success');
        document.getElementById('register-form').reset();

        // Registrar también en el historial local por compatibilidad
        const newUser = {
            username: username,
            email: email,
            registeredAt: new Date().toISOString()
        };
        registeredUsers.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    })
    .catch(error => {
        console.error('Error al registrar usuario:', error);
        showMessage(error.message, 'error');
    });
}

// Mostrar mensaje
function showMessage(text, type) {
    const messageDiv = document.getElementById('register-message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;

    // Ocultar mensaje después de 5 segundos
    setTimeout(() => {
        messageDiv.className = 'message';
    }, 5000);
}

// Mostrar sección específica
function showSection(sectionName) {
    // Ocultar todas las secciones
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Desactivar todos los botones de navegación
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Mostrar sección seleccionada
    if (sectionName === 'products') {
        document.getElementById('products-section').classList.add('active');
        document.querySelectorAll('.nav-btn')[0].classList.add('active');
        loadProducts(); // Recargar productos al ver la sección
    } else if (sectionName === 'register') {
        document.getElementById('register-section').classList.add('active');
        document.querySelectorAll('.nav-btn')[1].classList.add('active');
    }
}
