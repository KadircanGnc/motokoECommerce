import { useState, useEffect } from 'react';
import { motoko_project_backend } from '../../declarations/motoko_project_backend';

function App() {
  
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");

  // Fetch all products when the component mounts
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const productList = await motoko_project_backend.getAllProducts();
    setProducts(productList);
  };

  const handleAddProduct = async (event) => {
    event.preventDefault();
    if (!name || !price || !description) return;

    await motoko_project_backend.addProduct(name, price, description);
    loadProducts(); // Refresh product list
    setName("");
    setPrice(0);
    setDescription("");
  };

  const handleDeleteProduct = async (id) => {
    const result = await motoko_project_backend.deleteProduct(id);
    if (result.ok) {
      loadProducts(); // Refresh product list
    } else {
      console.error(result.err);
    }
  };

  const toggleStockStatus = async (id, currentStatus) => {
    await motoko_project_backend.updateStockStatus(id, !currentStatus);
    loadProducts(); // Refresh product list
  };

 

  return (
    <main>
      <img src="/logo2.svg" alt="DFINITY logo" />
      <br />
      <br />     
     

      {/* Product Form */}
      <h2>Add Product</h2>
      <form onSubmit={handleAddProduct}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit">Add Product</button>
      </form>

      {/* Product List */}
      <h2>Product List</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <h3>{product.name}</h3>
            <p>Price: ${product.price.toString()}</p>
            <p>{product.description}</p>
            <p>Status: {product.inStock ? "In Stock" : "Out of Stock"}</p>
            <button onClick={() => toggleStockStatus(product.id, product.inStock)}>
              {product.inStock ? "Set Out of Stock" : "Set In Stock"}
            </button>            
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
