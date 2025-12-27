import type {Cart} from "../types";
import { FaCreditCard } from "react-icons/fa6";

interface CartModalProps {
    show: boolean;
    onClose: () => void;
    cart: Cart | null;
    onCheckout: () => void;
    isLoading: boolean;
}

export function CartModal({ show, onClose, cart, onCheckout, isLoading }: CartModalProps) {
    if (!show) return null;

    return (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Your Shopping Cart</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    <div className="modal-body">
                        {!cart || cart.items.length === 0 ? (
                            <div className="text-center py-4">
                                <p className="text-muted">Your cart is empty.</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table align-middle">
                                    <thead className="table-light">
                                    <tr>
                                        <th>Product</th>
                                        <th className="text-center">Qty</th>
                                        <th className="text-end">Price</th>
                                        <th className="text-end">Total</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {cart.items.map((item) => (
                                        <tr key={item.product.id}>
                                            <td>{item.product.name}</td>
                                            <td className="text-center">{item.quantity}</td>
                                            <td className="text-end">${item.product.price.toFixed(2)}</td>
                                            <td className="text-end fw-bold">${item.totalPrice.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div className="modal-footer d-flex justify-content-between align-items-center">
                        <div>
                            <span className="text-muted me-2">Total Amount:</span>
                            <span className="fs-4 fw-bold text-primary">
                                {cart ? `$${cart.totalPrice.toFixed(2)}` : "$0.00"}
                            </span>
                        </div>

                        <div>
                            <button
                                className="btn btn-success"
                                disabled={!cart || cart.items.length === 0 || isLoading}
                                onClick={onCheckout}
                            >
                                {isLoading ? (
                                    <span>Processing...</span>
                                ) : (
                                    <>
                                        <FaCreditCard className="me-2" /> Pay Now
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}