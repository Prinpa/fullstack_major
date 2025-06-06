export type Product = {
    id: number;
    title: string;
    content: string;
    description: string;
    imageUrl: string;
    listedDate: Date;
    soldDate?: Date | null;
    price: number;
    quantity: number;
    category: string;
    sold: boolean;
    active: boolean;
};

export type CreateUserData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export type LoginUserData = {
    email: string;
    password: string;
};

export type CartItem = {
    id: number;
    productId: number;
    userId: number;
    quantity: number;
    price: number;
};

export type OrderItem = {
    orderId: string;
    userId: number;
    productId: number;
    quantity: number;
    price: number;
};

export type ReturnedOrderItem ={
  productId: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    title: string;
    content: string;
    description: string;
    imageUrl: string;
    price: number;
    category: string;
    quantity: number;
    active: boolean;
    sold: boolean;
  };
}

export type GroupedOrder = {
  orderId: string;
  userId?: number;
  createdAt: Date;
  items: ReturnedOrderItem[];
}
