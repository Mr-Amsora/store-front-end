import "./App.css"
import {Login, type LoginForm} from "./components/Login.tsx";
import api from "./services/clientApi.ts";


function App() {

    const onSubmit = (e: LoginForm) => {
        console.log(e);
        api.post("/auth/login", e).then((data) => {
            localStorage.setItem("token", data.data.token);
        })
            .catch((error) => {
                console.log(error);
            })
    }

    // if (localStorage.getItem("token")) {
    //     return (
    //         <>
    //         </>
    //     )
    // }
    // else {
        return (
            <>
                <Login onSubmit={onSubmit}></Login>
            </>
        )
    }


export default App
