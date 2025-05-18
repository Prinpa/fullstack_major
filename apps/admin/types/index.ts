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