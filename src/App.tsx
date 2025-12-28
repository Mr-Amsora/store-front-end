import "./App.css"
import {type LoginForm} from "./components/Login.tsx";
import api from "./services/clientApi.ts";
import {useEffect, useState} from "react";
import {type SignUpForm} from "./components/SignUp.tsx";
import {Alert} from "./components/Alert.tsx";
import {Shopping} from "./components/Shopping.tsx";
import {Sidebar} from "./components/SideBar.tsx";
import {TopNav} from "./components/TopNav.tsx";
import type {Cart, Product} from "./types.ts";
import {CartModal} from "./components/CartModal.tsx";
import {AuthModal} from "./components/AuthModal.tsx";


function App() {

    const [login, setLogin] = useState(true);
    const [message, setMessage] = useState("");
    const [loadingCart, setLoadingCart] = useState(false)
    const [cart, setCart] = useState<Cart>({
        items: [],
        id: "",
        totalPrice: 0
    });
    const [showCartModal, setShowCartModal] = useState(false); // Controls Popup visibility
    const [checkingOut, setCheckingOut] = useState(false);
    const [variant, setVariant] = useState("primary");

    useEffect(() => {

        api.get("/users").catch(()=>{
            localStorage.removeItem("token");
            }
        )

        api.get("/carts/my-carts").then((data) => {
            if (Array.isArray(data.data)&& data.data.length>0) {
                setCart(data.data[0]);
            }
            else {
                api.post("/carts").then(
                    (data) => setCart(data.data)
                )
            }
        })
    }, []);

    const handleLogin = (e: LoginForm) => {
        api.post("/auth/login", e).then((data) => {
            localStorage.setItem("token", data.data.token);
            setVariant("success");
            setMessage("Logged in successfully.");
            window.location.reload();
        })
            .catch(() => {
                setVariant("danger");
                setMessage("Invalid credentials. Please try again.");
            })
    }

    const handleSignUp = (e: SignUpForm) => {
        api.post("/users", e).
        then(()=> {
            setLogin(!login);
            setVariant("success");
            setMessage(`Account ${e.name} created successfully! Please login.`);
        }).
        catch(() => {
            setVariant("danger");
            setMessage("the email is already used. Please try again.");
        })
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        setVariant("warning");
        setMessage("Logged out successfully.");
    }

    const handleAddToCart = (p:Product) => {
        setLoadingCart(true)
        api.post(`/carts/${cart.id}/items`, { productId: p.id })
            .then(() => api.get<Cart>(`/carts/${cart.id}`))
            .then(res => {
                setCart(res.data);
                setVariant("success");
                setMessage(`${p.name} added to cart successfully.`);
            })
            .catch(
                ()=>{
                    setVariant("danger");
                    setMessage("You cant add more than the available in the stock.");
                }
            )
            .finally(() => setLoadingCart(false));
    }

    const handleCheckout = () => {
        setCheckingOut(true);
        api.post("/checkout", { cartId: cart.id })
            .then((data) => {
                console.log(data);
                window.open(data.data.checkoutUrl, "_blank");
                setShowCartModal(false);
                setCart({ id: "", items: [], totalPrice: 0 });
            })
            .catch(() => {
                setVariant("danger");
                setMessage("Checkout failed. Please try again.");
            })
            .finally(() => setCheckingOut(false));
    };


    if (localStorage.getItem("token")) {
        return (
            <>
                {message !== "" ? <Alert onClose={()=>setMessage("")} variant={variant}>{message} </Alert> : null}
                <div className="d-flex flex-column vh-100 overflow-hidden">

                    <TopNav onLogout={handleLogout} cart={cart}  onShowCart={()=> setShowCartModal(true)} />

                    <CartModal
                        show={showCartModal}
                        onClose={() => setShowCartModal(false)}
                        cart={cart}
                        setCart={setCart}
                        onCheckout={handleCheckout}
                        isLoading={checkingOut}
                    />

                    <div className="d-flex flex-grow-1 overflow-hidden">

                        <Sidebar />

                        <main className="flex-grow-1 overflow-auto bg-light w-100">
                            <div className="container-fluid py-4">
                                <Shopping addToCart={handleAddToCart} loadingCart={loadingCart}/>
                            </div>
                        </main>
                    </div>
                </div>
            </>
        )
    }
    else
        return (
            <>
                {message && (
                    <Alert onClose={() => setMessage("")} variant={variant}>
                        {message}
                    </Alert>
                )}
                <AuthModal show={true} onLogin={handleLogin} onSignUp={handleSignUp} />
            </>
        )
    }


export default App
