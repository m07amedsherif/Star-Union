
const productsContainer = document.getElementById("products");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");

let allProducts = [];
let selectedCategory = "all";

// Fetch Products
fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(data => {
        allProducts = data;
        renderProducts(allProducts);
    });

// Render Function
function renderProducts(products) {
    productsContainer.innerHTML = "";

    products.forEach(product => {
        const card = document.createElement("div");
        card.className =
            "bg-white border border-zinc-300 rounded-xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden flex flex-col";

        card.innerHTML = `
          <div class="h-56 flex items-center justify-center bg-gray-50 p-6">
            <img src="${product.image}" 
                 alt="${product.title}" 
                 class="h-full object-contain">
          </div>

          <div class="p-5 flex flex-col flex-1">
            <span class="text-xs uppercase tracking-wide text-orange-500 font-semibold mb-2">
              ${product.category}
            </span>

            <h2 class="text-md font-medium text-gray-800 mb-2 line-clamp-2">
              ${product.title}
            </h2>

            <p class="text-sm text-gray-500 mb-4 line-clamp-2">
              ${product.description}
            </p>

            <div class="mt-auto flex items-center justify-between">
              <span class="text-lg font-semibold text-gray-900">
                $${product.price}
              </span>

              <button class="bg-black text-white px-4 py-2 rounded-lg text-xs hover:bg-gray-800 transition">
                Add to Cart
              </button>
            </div>
          </div>
        `;

        productsContainer.appendChild(card);
    });
}

// Filter Logic
function applyFilters() {
    let filtered = allProducts;

    if (selectedCategory !== "all") {
        filtered = filtered.filter(p => p.category === selectedCategory);
    }

    const searchValue = searchInput.value.toLowerCase();
    filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchValue)
    );

    renderProducts(filtered);
}

// Category Click
filterButtons.forEach(button => {
    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {
            btn.classList.remove("bg-orange-500", "text-white");
            btn.classList.add("bg-gray-100");
        });

        button.classList.add("bg-orange-500", "text-white");
        button.classList.remove("bg-gray-100");

        selectedCategory = button.dataset.category;
        applyFilters();
    });
});

// Search Typing
searchInput.addEventListener("input", applyFilters);

