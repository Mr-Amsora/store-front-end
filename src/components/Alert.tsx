import { useEffect, useState } from "react";

interface AlertProps {
    children: React.ReactNode;
    variant: string;
    onClose: () => void;
}

export function Alert({ children, variant = "primary" , onClose}: AlertProps) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => onClose(), 7000);
        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <div

            className="position-fixed top-0 start-50 translate-middle-x p-3"
            style={{ zIndex: 1050 }}
        >
            <div
                className={`toast align-items-center text-white bg-${variant} border-0 show`}
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
            >
                <div className="d-flex">
                    <div className="toast-body">{children}</div>
                    <button
                        type="button"
                        className="btn-close btn-close-white me-2 m-auto"
                        onClick={() => {
                            setVisible(false);
                            onClose();
                        }}
                        aria-label="Close"
                    ></button>
                </div>
            </div>
        </div>
    );
}
