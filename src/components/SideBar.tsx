import { useState } from "react";
import { AddProductModal } from "./AddProductModal";

export function Sidebar() {
    const [showAddProduct, setShowAddProduct] = useState(false);

    return (
        <>
            <div className="bg-light border-end" style={{ width: "250px", minHeight: "100%" }}>
                <div className="list-group list-group-flush pt-3">
                    <button className="list-group-item list-group-item-action bg-light">
                        All Products
                    </button>
                    <button className="list-group-item list-group-item-action bg-light">
                        My Orders
                    </button>
                    <button
                        className="list-group-item list-group-item-action bg-light"
                        onClick={() => setShowAddProduct(true)}
                    >
                        Add New Product
                    </button>
                    <button className="list-group-item list-group-item-action bg-light">
                        Settings
                    </button>
                </div>
            </div>

            <AddProductModal
                show={showAddProduct}
                onClose={() => setShowAddProduct(false)}
            />
        </>
    );
}