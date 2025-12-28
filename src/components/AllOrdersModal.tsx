import { useEffect, useState } from "react";
import { Alert } from "./Alert.tsx";
import api from "../services/clientApi.ts";

interface OrderItem {
    product: {
        id: number;
        name: string;
        price: number;
    };
    quantity: number;
    totalPrice: number;
}

interface Order {
    id: number;
    status: string;
    createdAt: string;
    items: OrderItem[];
    totalPrice: number;
}

interface AllOrdersModalProps {
    show: boolean;
    onClose: () => void;
}

export function AllOrdersModal({ show, onClose }: AllOrdersModalProps) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertVariant, setAlertVariant] = useState<"success" | "danger">("danger");

    useEffect(() => {
        if (!show) return;

        const fetchOrders = async () => {
            setLoading(true);
            api.get("/orders")
                .then((res) => {
                    setOrders(res.data);
                })
                .catch(() => {
                    setAlertVariant("danger");
                    setAlertMessage("Failed to fetch orders");
                })
                .finally(() => {
                    setLoading(false);
                });
        };

        fetchOrders();
    }, [show]);

    if (!show) return null;

    return (
        <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.12)", zIndex: 1050 }}
        >
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content p-4">
                    {/* Header with X button */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="mb-0">All Orders</h4>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={onClose}
                        />
                    </div>

                    {/* Alert */}
                    {alertMessage && (
                        <Alert variant={alertVariant} onClose={() => setAlertMessage("")}>
                            {alertMessage}
                        </Alert>
                    )}

                    {loading ? (
                        <p className="text-center">Loading orders...</p>
                    ) : orders.length === 0 ? (
                        <p className="text-center">No orders found.</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead className="table-light">
                                <tr>
                                    <th>Order ID</th>
                                    <th>Status</th>
                                    <th>Created At</th>
                                    <th>Items</th>
                                    <th>Total Price</th>
                                </tr>
                                </thead>
                                <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td>{order.id}</td>
                                        <td>{order.status}</td>
                                        <td>{new Date(order.createdAt).toLocaleString()}</td>
                                        <td>
                                            {order.items.map((item) => (
                                                <div key={item.product.id}>
                                                    {item.product.name} x {item.quantity} = $
                                                    {item.totalPrice.toFixed(2)}
                                                </div>
                                            ))}
                                        </td>
                                        <td>${order.totalPrice.toFixed(2)}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
