import { useEffect, useState } from "react";
import api from "../services/clientApi";
import type {Product} from "../types";

interface ShoppingProps {
    addToCart: (product: Product) => void;
    loadingCart: boolean;
}

export function Shopping({ addToCart, loadingCart }: ShoppingProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        api.get<Product[]>("/products")
            .then(res => setProducts(res.data))
            .catch(console.error);
    }, []);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Our Products</h2>
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
                {filteredProducts.map(product => (
                    product.quantity > 0 &&
                    <div key={product.id} className="col-md-3 mb-4">
                        <div className="card h-100 shadow-sm">
                            {product.imageUrl ? (
                                <img
                                    src={product.imageUrl}
                                    className="card-img-top"
                                    alt={product.name}
                                    style={{ height: "200px", objectFit: "cover" }}
                                />
                            ) : (
                                <div className="d-flex align-items-center justify-content-center bg-light" style={{height: "200px"}}>
                                    <span className="text-muted">No Image</span>
                                </div>
                            )}

                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text text-truncate">
                                    {product.description}
                                </p>
                                <p className="mt-auto fw-bold text-primary">
                                    ${product.price}
                                </p>
                                <button
                                    className="btn btn-success mt-2"
                                    disabled={loadingCart}
                                    onClick={() => addToCart(product)}
                                >
                                    {loadingCart ? "Updating..." : "Add to Cart"}
                                </button>
                            </div>
                        </div>
                    </div>
                    ))}
            </div>
        </div>
    );
}