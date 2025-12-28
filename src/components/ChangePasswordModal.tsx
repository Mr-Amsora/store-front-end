import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import api from "../services/clientApi";
import { Alert } from "./Alert";

const changePasswordSchema = z.object({
    oldPassword: z.string().min(6, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

interface ChangePasswordModalProps {
    show: boolean;
    onClose: () => void;
}

export function ChangePasswordModal({ show, onClose }: ChangePasswordModalProps) {
    const [message, setMessage] = useState("");
    const [variant, setVariant] = useState<"success" | "danger">("success");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
        },
    });

    if (!show) return null;

    const onSubmit = (data: ChangePasswordFormData) => {
        api
            .post("/users/change-password", data)
            .then(() => {
                setVariant("success");
                setMessage("Password changed successfully");
                reset();
            })
            .catch(() => {
                setVariant("danger");
                setMessage("Current password is incorrect");
            });
    };

    return (
        <>
            {message && (
                <Alert variant={variant} onClose={() => setMessage("")}>
                    {message}
                </Alert>
            )}

            <div
                className="modal show d-block"
                style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
                tabIndex={-1}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Change Password</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="modal-body">
                            <form id="changePasswordForm" onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-3">
                                    <label className="form-label">Current Password</label>
                                    <input
                                        type="password"
                                        className={`form-control ${
                                            errors.oldPassword ? "is-invalid" : ""
                                        }`}
                                        {...register("oldPassword")}
                                    />
                                    <div className="invalid-feedback">
                                        {errors.oldPassword?.message}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">New Password</label>
                                    <input
                                        type="password"
                                        className={`form-control ${
                                            errors.newPassword ? "is-invalid" : ""
                                        }`}
                                        {...register("newPassword")}
                                    />
                                    <div className="invalid-feedback">
                                        {errors.newPassword?.message}
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="submit"
                                form="changePasswordForm"
                                className="btn btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Updating..." : "Change Password"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
