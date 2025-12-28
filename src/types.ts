export interface Product {
    id: number;
    name: string;
    description: string;
    categoryId: number;
    price: number;
    imageUrl: string;
    sellerId: number;
    quantity: number;
}

export interface CartProduct {
    id: number;
    name: string;
    price: number;
}

export interface CartItem {
    product: CartProduct;
    quantity: number;
    totalPrice: number;
}

export interface Cart {
    id: string;
    items: CartItem[];
    totalPrice: number;
}