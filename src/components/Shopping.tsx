import { useEffect, useState } from "react";
import api from "../services/clientApi";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
}

export function Shopping() {
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState("");
    const [cart, setCart] = useState<Product[]>([]);

    useEffect(() => {
        api.get("/products")
            .then((res) => setProducts(res.data))
            .catch((err) => console.error(err));
    }, []);

    const addToCart = (product: Product) => {
        setCart([...cart, product]);
    };

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Our Products</h2>
                <button className="btn btn-primary">
                    Cart ({cart.length})
                </button>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="row">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="col-md-3 mb-4">
                        <div className="card h-100">
                            <img
                                src={product.image}
                                className="card-img-top"
                                alt={product.name}
                                style={{ height: "200px", objectFit: "cover" }}
                            />
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text text-truncate">
                                    {product.description}
                                </p>
                                <p className="mt-auto fw-bold">${product.price}</p>
                                <button
                                    className="btn btn-success mt-2"
                                    onClick={() => addToCart(product)}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
