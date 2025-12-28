import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../services/clientApi";
import { useState } from "react";
import {Alert} from "./Alert.tsx";


const productSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    description: z.string().min(0),
    price: z.coerce.number().min(0.01, "Price must be greater than 0"),
    quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
    categoryId: z.coerce.number().int().min(1, "Please select a category"), // New Field
    imageUrl: z.string().url("Must upload an image"),
});

type ProductFormData = z.infer<typeof productSchema>;

interface AddProductModalProps {
    show: boolean;
    onClose: () => void;
}

export function AddProductModal({ show, onClose }: AddProductModalProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string>("");
    const [variant, setVariant] = useState("primary");
    const [message, setMessage] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        trigger,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            quantity: 1,
            categoryId: 0,
            imageUrl: ""
        }
    });

    if (!show) return null;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        api.post("/images", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            }).then((res)=>{
            const url = res.data.imageUrl;
            setValue("imageUrl", url);
            setPreview(url);
            trigger("imageUrl");
        }).catch(()=>{
            setVariant("danger");
            setMessage("Image upload failed");
        }).finally(()=> {
            setUploading(false);
        })
    };

    const onSubmit = (data: ProductFormData) => {
        api.post("/products", data)
            .then(() => {
                setMessage("Product added successfully!");
                setVariant("success");
                reset();
                setPreview("");

                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            })
            .catch(() => {
                setVariant("danger");
                setMessage("Failed to add product.");
            });
    };

    return (
        <>
            {message !== "" ? <Alert onClose={()=>setMessage("")} variant={variant}>{message} </Alert> : null}
            <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }} tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add New Product</h5>
                        <button type="button" className="btn-close" onClick={onClose} disabled={isSubmitting || uploading}></button>
                    </div>

                    <div className="modal-body">
                        <form id="addProductForm" onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-3">
                                <label className="form-label">Product Name</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                    {...register("name")}
                                />
                                <div className="invalid-feedback">{errors.name?.message as string}</div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea
                                    className={`form-control ${errors.description ? "is-invalid" : ""}`}
                                    rows={3}
                                    {...register("description")}
                                />
                                <div className="invalid-feedback">{errors.description?.message as string}</div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Category</label>
                                <select
                                    className={`form-select ${errors.categoryId ? "is-invalid" : ""}`}
                                    {...register("categoryId")}
                                >
                                    <option value="0">Select a category...</option>
                                    <option value="1">Electronics</option>
                                    <option value="2">Books</option>
                                    <option value="3">Clothing</option>
                                    <option value="4">Home & Garden</option>
                                </select>
                                <div className="invalid-feedback">{errors.categoryId?.message as string}</div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Price</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className={`form-control ${errors.price ? "is-invalid" : ""}`}
                                        {...register("price")}
                                    />
                                    <div className="invalid-feedback">{errors.price?.message as string}</div>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Quantity</label>
                                    <input
                                        type="number"
                                        className={`form-control ${errors.quantity ? "is-invalid" : ""}`}
                                        {...register("quantity")}
                                    />
                                    <div className="invalid-feedback">{errors.quantity?.message as string}</div>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Product Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className={`form-control ${errors.imageUrl ? "is-invalid" : ""}`}
                                    onChange={handleFileChange}
                                    disabled={uploading}
                                />
                                <input type="hidden" {...register("imageUrl")} />

                                <div className="invalid-feedback">
                                    {errors.imageUrl?.message as string}
                                </div>

                                {uploading && <div className="text-muted mt-2">Uploading...</div>}

                                {preview && (
                                    <div className="mt-2">
                                        <img src={preview} alt="Preview" style={{ height: "100px", borderRadius: "5px" }} />
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>

                    <div className="modal-footer">
                        <button
                            type="submit"
                            form="addProductForm"
                            className="btn btn-primary"
                            disabled={isSubmitting || uploading}
                        >
                            {isSubmitting || uploading ? "Processing..." : "Add Product"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}