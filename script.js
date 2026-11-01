const STORAGE_KEY = 'njiwaProducts';
const ORDER_KEY = 'njiwaOrders';

const defaultProducts = [
  {
    id: 1,
    name: 'Orchid Dining Set',
    category: 'Furniture',
    price: 68000,
    description: 'Sophisticated dining set with solid wood finish and six comfortable chairs.',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 2,
    name: 'Mila Glass Partition',
    category: 'Glassmart',
    price: 52000,
    description: 'Modern glass divider for offices and living spaces with a premium finish.',
    image:
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 3,
    name: 'Aster Wardrobe',
    category: 'Furniture',
    price: 74000,
    description: 'Spacious wardrobe with elegant design and practical built-in storage.',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 4,
    name: 'Harbor Shower Glass',
    category: 'Glassmart',
    price: 42000,
    description: 'Tempered glass shower panel designed for clean, modern bathroom aesthetics.',
    image:
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 5,
    name: 'Luna Coffee Table',
    category: 'Furniture',
    price: 29000,
    description: 'Minimal coffee table with a glass top and sturdy frame for modern homes.',
    image:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 6,
    name: 'Vista Shopfront Glass',
    category: 'Glassmart',
    price: 96000,
    description: 'Custom shopfront glazing solution for retail stores and business frontage.',
    image:
      'https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=900&q=80'
  }
];

function getProducts() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
    return defaultProducts;
  }

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length ? parsed : defaultProducts;
  } catch (error) {
    return defaultProducts;
  }
}

function formatPrice(value) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0
  }).format(value);
}

function renderProducts() {
  const container = document.getElementById('product-list');
  if (!container) return;

  const products = getProducts();

  container.innerHTML = products
    .map(
      (product) => `
        <article class="product-card">
          <img src="${product.image}" alt="${product.name}" />
          <div class="product-body">
            <div class="product-topline">
              <span class="product-tag">${product.category}</span>
              <span class="product-price">${formatPrice(product.price)}</span>
            </div>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="card-actions">
              <a class="link-btn" href="orders.html">Order now</a>
              <a class="btn btn-secondary" href="orders.html">Request quote</a>
            </div>
          </div>
        </article>
      `
    )
    .join('');
}

function setupAdminForm() {
  const form = document.getElementById('product-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const product = {
      id: Date.now(),
      name: formData.get('name').toString().trim(),
      category: formData.get('category').toString().trim(),
      price: Number(formData.get('price')),
      description: formData.get('description').toString().trim(),
      image:
        formData.get('image').toString().trim() ||
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80'
    };

    if (!product.name || !product.category || !product.price || !product.description) {
      showStatus('Please fill in all product details.', 'product-status');
      return;
    }

    const products = getProducts();
    products.unshift(product);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    form.reset();
    showStatus('Product added successfully.', 'product-status');
    renderProducts();
    populateOrderProducts();
  });
}

function setupOrderForm() {
  const form = document.getElementById('order-form');
  if (!form) return;

  populateOrderProducts();

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const order = {
      name: formData.get('name').toString().trim(),
      phone: formData.get('phone').toString().trim(),
      product: formData.get('product').toString().trim(),
      quantity: Number(formData.get('quantity')),
      notes: formData.get('notes').toString().trim(),
      date: new Date().toISOString()
    };

    if (!order.name || !order.phone || !order.product || !order.quantity) {
      showStatus('Please complete the required order details.', 'order-status');
      return;
    }

    const orders = JSON.parse(localStorage.getItem(ORDER_KEY) || '[]');
    orders.unshift(order);
    localStorage.setItem(ORDER_KEY, JSON.stringify(orders));
    form.reset();
    populateOrderProducts();
    showStatus('Your order request has been submitted successfully. We will contact you shortly.', 'order-status');
  });
}

function populateOrderProducts() {
  const select = document.getElementById('order-product');
  if (!select) return;

  const products = getProducts();
  select.innerHTML = `<option value="">Choose a product</option>` +
    products
      .map((product) => `<option value="${product.name}">${product.name} — ${formatPrice(product.price)}</option>`)
      .join('');
}

function showStatus(message, id) {
  const box = document.getElementById(id);
  if (!box) return;
  box.textContent = message;
  box.classList.add('visible');
}

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  setupAdminForm();
  setupOrderForm();
});
