import "./App.css"
import {Login, type LoginForm} from "./components/Login.tsx";
import api from "./services/clientApi.ts";
import {useEffect, useState} from "react";
import {SignUp, type SignUpForm} from "./components/SignUp.tsx";
import {Alert} from "./components/Alert.tsx";
import {Shopping} from "./components/Shopping.tsx";
import {Sidebar} from "./components/SideBar.tsx";
import {TopNav} from "./components/TopNav.tsx";
import type {Cart, Product} from "./types.ts";
import {CartModal} from "./components/CartModal.tsx";


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
            window.location.reload();
        })
            .catch((error) => {
                console.log(error);
            })
    }

    const handleSignUp = (e: SignUpForm) => {
        api.post("/users", e).
        then(()=> {
            setLogin(!login);
            setMessage(`Account ${e.name} created successfully! Please login.`);
        }).
        catch((error) => {
            console.log(error);
        })
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        setMessage("Logged out successfully.");
    }

    const handleAddToCart = (p:Product) => {
        setLoadingCart(true)
        api.post(`/carts/${cart.id}/items`, { productId: p.id })
            .then(() => api.get<Cart>(`/carts/${cart.id}`))
            .then(res => setCart(res.data))
            .catch(console.error)
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
            .catch((err) => {
                console.error(err);
                alert("Checkout failed. Please try again.");
            })
            .finally(() => setCheckingOut(false));
    };


    if (localStorage.getItem("token")) {
        return (
            <>
                <div className="d-flex flex-column vh-100 overflow-hidden">

                    <TopNav onLogout={handleLogout} cart={cart}  onShowCart={()=> setShowCartModal(true)} />

                    <CartModal
                        show={showCartModal}
                        onClose={() => setShowCartModal(false)}
                        cart={cart}
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
                {message !== "" ? <Alert onClose={()=>setMessage("")}>{message} </Alert> : null}
                {login && <Login onSubmit={handleLogin}></Login>}
                {!login && <SignUp onSubmit={handleSignUp}></SignUp>}
                <div className={"container mt-1"}>
                    <button className={"btn btn-outline-secondary"}
                            style={{marginLeft:"865px"}}
                            onClick={()=>{setLogin(!login)}}>
                        {login ? "Sign Up" : "Login"}
                    </button>
                </div>
            </>
        )
    }


export default App
