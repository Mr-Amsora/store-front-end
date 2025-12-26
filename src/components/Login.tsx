import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

interface Props{
    onSubmit: (e: LoginForm) => void;
}
export interface LoginForm{
    email: string;
    password: string;
}

export function Login({onSubmit}:Props) {

    const loginSchema =z.object({
        email: z.string().min(10).max(30),
        password: z.string().min(6).max(20)
    })

    const{register , formState:{errors} , handleSubmit }=useForm <LoginForm>({resolver: zodResolver(loginSchema)});

    return (
        <>
            <div className="container mt-5" style={{width:'600px' , backgroundColor:'ghostwhite' , borderRadius:'10px' , padding:'20px'}}>
            <form onSubmit={ handleSubmit(onSubmit)}>
                <div className="mb-3" >
                    <label htmlFor="email">Email address</label>
                    <input type="email" className="form-control" id="email"
                           placeholder={`example@email.com`} {...register("email")}/>
                    {errors.email && <p className="text-danger">{errors.email.message}</p>}
                </div>
                <div className="mb-3">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password"
                           placeholder={`P@33w0rD`} {...register("password")}/>
                    {errors.password && <p className="text-danger">{errors.password.message}</p>}
                </div>
                <button type="submit" className="btn btn-primary" style={{marginLeft:"229px"}}>Submit</button>
            </form>
            </div>
        </>
    );
}