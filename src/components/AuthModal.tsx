import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export interface LoginForm {
    email: string;
    password: string;
}

export interface SignUpForm {
    name: string;
    email: string;
    password: string;
}

interface AuthModalProps {
    show: boolean;
    onLogin: (data: LoginForm) => void;
    onSignUp: (data: SignUpForm) => void;
}

export function AuthModal({ show, onLogin, onSignUp }: AuthModalProps) {
    const [isLogin, setIsLogin] = useState(true);

    const loginSchema = z.object({
        email: z.string().email("Invalid email"),
        password: z.string().min(6, "Minimum 6 characters"),
    });

    const signUpSchema = z.object({
        name: z.string().min(1, "Name is required").max(20),
        email: z.string().email("Invalid email"),
        password: z.string().min(6, "Minimum 6 characters").max(20),
    });

    const {
        register: registerLogin,
        handleSubmit: handleLoginSubmit,
        formState: { errors: loginErrors, isSubmitting: loginSubmitting },
        reset: resetLogin,
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const {
        register: registerSignUp,
        handleSubmit: handleSignUpSubmit,
        formState: { errors: signUpErrors, isSubmitting: signUpSubmitting },
        reset: resetSignUp,
    } = useForm<SignUpForm>({
        resolver: zodResolver(signUpSchema),
    });

    if (!show) return null;

    return (
        <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.12)", zIndex: 1050 }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content p-4">
                    <h4 className="text-center mb-4">
                        {isLogin ? "Login" : "Create Account"}
                    </h4>

                    {isLogin ? (
                        <form
                            onSubmit={handleLoginSubmit((data) => {
                                onLogin(data);
                                resetLogin();
                            })}
                        >
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className={`form-control ${
                                        loginErrors.email ? "is-invalid" : ""
                                    }`}
                                    {...registerLogin("email")}
                                />
                                <div className="invalid-feedback">
                                    {loginErrors.email?.message}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className={`form-control ${
                                        loginErrors.password ? "is-invalid" : ""
                                    }`}
                                    {...registerLogin("password")}
                                />
                                <div className="invalid-feedback">
                                    {loginErrors.password?.message}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                                disabled={loginSubmitting}
                            >
                                {loginSubmitting ? "Logging in..." : "Login"}
                            </button>
                        </form>
                    ) : (
                        <form
                            onSubmit={handleSignUpSubmit((data) => {
                                onSignUp(data);
                                resetSignUp();
                            })}
                        >
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    className={`form-control ${
                                        signUpErrors.name ? "is-invalid" : ""
                                    }`}
                                    {...registerSignUp("name")}
                                />
                                <div className="invalid-feedback">
                                    {signUpErrors.name?.message}
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className={`form-control ${
                                        signUpErrors.email ? "is-invalid" : ""
                                    }`}
                                    {...registerSignUp("email")}
                                />
                                <div className="invalid-feedback">
                                    {signUpErrors.email?.message}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className={`form-control ${
                                        signUpErrors.password ? "is-invalid" : ""
                                    }`}
                                    {...registerSignUp("password")}
                                />
                                <div className="invalid-feedback">
                                    {signUpErrors.password?.message}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                                disabled={signUpSubmitting}
                            >
                                {signUpSubmitting ? "Creating..." : "Sign Up"}
                            </button>
                        </form>
                    )}

                    <div className="d-flex justify-content-center mt-3">
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin ? "Sign Up" : "Login"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
