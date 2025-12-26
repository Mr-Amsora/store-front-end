import "./App.css"
import {Login, type LoginForm} from "./components/Login.tsx";
import api from "./services/clientApi.ts";
import {useState} from "react";
import {SignUp, type SignUpForm} from "./components/SignUp.tsx";
import {Alert} from "./components/Alert.tsx";
import {Shopping} from "./components/Shopping.tsx";


function App() {

    const [login, setLogin] = useState(true);
    const [message, setMessage] = useState("");


    const handleLogin = (e: LoginForm) => {
        api.post("/auth/login", e).then((data) => {
            localStorage.setItem("token", data.data.token);
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
    if (localStorage.getItem("token")) {
        return (
            <>
                <Shopping/>
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
