import { useState } from "react";
import { AddProductModal } from "./AddProductModal";
import {ChangePasswordModal} from "./ChangePasswordModal.tsx";
import {AllOrdersModal} from "./AllOrdersModal.tsx";

export function Sidebar() {
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [showChangePass, setShowChangePass] = useState(false)
    const [showAllOrders, setShowAllOrders] = useState(false);

    return (
        <>
            <div className="bg-light border-end" style={{ width: "250px", minHeight: "100%" }}>
                <div className="list-group list-group-flush pt-3">
                    <button className="list-group-item list-group-item-action bg-light"
                    onClick={() => setShowAllOrders(true)}
                    >
                        My Orders
                    </button>
                    <button
                        className="list-group-item list-group-item-action bg-light"
                        onClick={() => setShowAddProduct(true)}
                    >
                        Add New Product
                    </button>
                    <button className="list-group-item list-group-item-action bg-light"
                            onClick={() => setShowChangePass(true)}
                    >
                        change the current password
                    </button>
                </div>
            </div>

            <AddProductModal
                show={showAddProduct}
                onClose={() => setShowAddProduct(false)}
            />

            <ChangePasswordModal show={showChangePass} onClose={
                () => setShowChangePass(false)
            }/>
            <AllOrdersModal show={showAllOrders} onClose={()=>{setShowAllOrders(false)}}/>

        </>
    );
}