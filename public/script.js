let products = [];

async function loadProducts() {
  try {
    const response = await fetch("/product.json");
    if (!response.ok) throw new Error("Unable to load product data");
    products = await response.json();
    renderProducts();
  } catch (error) {
    document.getElementById("product-list").innerHTML = `<p>Error loading products: ${error.message}</p>`;
  }
}

function renderProducts() {
  const productList = document.getElementById("product-list");
  const category = document.getElementById("categorySelect").value;
  const sortBy = document.getElementById("sortSelect").value;

  let filtered = products.filter(p => p.inventory > 0);

  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }

  if (filtered.length === 0) {
    productList.innerHTML = `<p>No products available for this category.</p>`;
    return;
  }

  if (sortBy) {
    filtered.sort((a, b) => a[sortBy] - b[sortBy]);
  }

  productList.innerHTML = "";

  filtered.forEach(product => {
    const div = document.createElement("div");
    div.className = "product";

    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>Brand: ${product.brand}</p>
      <p>Price: $${product.price}</p>
      <p>Inventory: ${product.inventory}</p>
      <button onclick="removeProduct(${product.id})">Remove</button>
    `;

    productList.appendChild(div);
  });
}

function removeProduct(id) {
  products = products.filter(p => p.id !== id);
  renderProducts();
}

document.getElementById("categorySelect").addEventListener("change", renderProducts);
document.getElementById("sortSelect").addEventListener("change", renderProducts);

document.getElementById("adminForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const category = document.getElementById("category").value;
  const brand = document.getElementById("brand").value;
  const price = parseFloat(document.getElementById("price").value);
  const inventory = parseInt(document.getElementById("inventory").value);
  const image = document.getElementById("image").value;

  if (!name || !category || !brand || isNaN(price) || isNaN(inventory)) {
    alert("Please fill all required fields correctly.");
    return;
  }

  const newProduct = {
    id: Date.now(),
    name,
    category,
    brand,
    price,
    inventory,
    image
  };

  products.push(newProduct);
  renderProducts();
  this.reset();
});

loadProducts();
