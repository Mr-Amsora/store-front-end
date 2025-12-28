import { FaCartShopping } from "react-icons/fa6";
import type {Cart} from "../types";

interface TopNavProps {
    onLogout: () => void;
    cart: Cart;
    onShowCart: () => void;
}

export function TopNav({ onLogout, cart , onShowCart}: TopNavProps) {
    const cartCount = cart
        ? cart.items.reduce((sum, item) => sum + item.quantity, 0)
        : 0;

    return (
        <nav className="navbar navbar-expand navbar-dark bg-primary px-3 shadow-sm" style={{ flexShrink: 0 }}>
            <span className="navbar-brand mb-0 h1">Spring-React Shop Project</span>

            <div className="ms-auto d-flex align-items-center gap-3">

                <button className="btn btn-light text-primary position-relative" onClick={onShowCart}>
                    <FaCartShopping />
                    {cartCount > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {cartCount}
                        </span>
                    )}
                    <span className="ms-2 fw-bold">
                        {cart ? `$${cart.totalPrice.toFixed(2)}` : "$0.00"}
                    </span>
                </button>

                <button className="btn btn-danger btn-sm" onClick={onLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
}