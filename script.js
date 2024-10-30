const API_URL = 'https://fakestoreapi.com/products';
let cart = [];

// Função para buscar produtos da API
async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
    }
}

// Função para exibir produtos no catálogo
function displayProducts(products) {
    const productCatalog = document.getElementById('product-catalog');
    productCatalog.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}" style="width:100%">
            <h3>${product.title}</h3>
            <p>Preço: R$ ${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id}, '${product.title}', ${product.price})">Adicionar ao Carrinho</button>
        `;
        productCatalog.appendChild(productCard);
    });
}

// Função para adicionar produtos ao carrinho
function addToCart(id, title, price) {
    const productInCart = cart.find(item => item.id === id);
    if (productInCart) {
        productInCart.quantity += 1;
    } else {
        cart.push({ id, title, price, quantity: 1 });
    }
    updateCartDisplay();
}

// Função para atualizar exibição do carrinho
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const cartBtn = document.getElementById('cartBtn');

    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
        cartItems.innerHTML += `<p>${item.title} - ${item.quantity} x R$ ${item.price.toFixed(2)}</p>`;
    });
    
    totalPriceElement.innerHTML = `<h3>Total: R$ ${total.toFixed(2)}</h3>`;
    cartBtn.innerText = `Carrinho (${cart.length})`;
}

// Função para finalizar a compra
document.getElementById('checkoutBtn').onclick = function() {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    sendConfirmation();
};

// Função para enviar notificação de confirmação
async function sendConfirmation() {
    try {
        const response = await fetch('https://api.aftership.com/v4/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'aftership-api-key': 'YOUR_API_KEY' // Substitua pela sua chave da API AfterShip
            },
            body: JSON.stringify({
                notification: {
                    title: "Pedido Confirmado",
                    body: "Seu pedido foi recebido com sucesso!",
                }
            })
        });
        const result = await response.json();
        alert('Confirmação de pedido enviada!');
        console.log(result);
    } catch (error) {
        console.error('Erro ao enviar confirmação:', error);
    }
}

// Inicializa a busca de produtos ao carregar a página
fetchProducts();
