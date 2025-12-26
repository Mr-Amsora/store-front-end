import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";

interface Props{
    onSubmit: (e: SignUpForm) => void;
}
export interface SignUpForm {
    name: string;
    email: string;
    password: string;
}

export function SignUp({onSubmit}:Props) {
    const signUpSchema =z.object({
        email: z.string().min(10).max(30),
        password: z.string().min(6).max(20),
        name: z.string().min(1).max(20)
    })

    const{register , formState:{errors} , handleSubmit }=useForm <SignUpForm>({resolver: zodResolver(signUpSchema)});

    return (
        <>
            <div className="container mt-5" style={{width:'600px' , backgroundColor:'ghostwhite' , borderRadius:'10px' , padding:'20px'}}>
                <form onSubmit={ handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <label htmlFor="name">Name</label>
                        <input type="text" className="form-control" id="name"
                               placeholder={`Your Name`} {...register("name")}/>
                        {errors.name && <p className="text-danger">{errors.name.message}</p>}
                    </div>
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