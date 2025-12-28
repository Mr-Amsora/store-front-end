import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface Props {
    show: boolean;
    onSubmit: (data: SignUpForm) => void;
}

export interface SignUpForm {
    name: string;
    email: string;
    password: string;
}

const signUpSchema = z.object({
    name: z.string().min(1, "Name is required").max(20),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Minimum 6 characters").max(20),
});

export function SignUp({ show, onSubmit }: Props) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
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
                    <h4 className="text-center mb-4">Create Account</h4>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input
                                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                {...register("name")}
                            />
                            <div className="invalid-feedback">
                                {errors.name?.message}
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                {...register("email")}
                            />
                            <div className="invalid-feedback">
                                {errors.email?.message}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                {...register("password")}
                            />
                            <div className="invalid-feedback">
                                {errors.password?.message}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating..." : "Sign Up"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
