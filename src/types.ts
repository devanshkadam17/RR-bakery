export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Cakes' | 'Cupcakes' | 'Desserts' | 'Beverages';
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Chocolate Cake',
    price: 500,
    category: 'Cakes',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: '2',
    name: 'Strawberry Cake',
    price: 550,
    category: 'Cakes',
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: '3',
    name: 'Vanilla Cake',
    price: 450,
    category: 'Cakes',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: '4',
    name: 'Custom Theme Cake',
    price: 900,
    category: 'Cakes',
    image: 'https://images.unsplash.com/photo-1535254973040-607b474cb8c2?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: '5',
    name: 'Chocolate Cupcakes (Box of 6)',
    price: 300,
    category: 'Cupcakes',
    image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: '6',
    name: 'Ice Cream Brownie',
    price: 160,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: '7',
    name: 'Cold Pressed Watermelon Juice',
    price: 60,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&q=80&w=600',
  },
];
