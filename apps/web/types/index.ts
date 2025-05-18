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
}

export type LoginUserData = {
  email: string;
  password: string;
}