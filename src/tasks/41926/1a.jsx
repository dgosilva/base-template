import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  Button,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const products = [
  { id: 1, name: "Smartphone 📱", price: 999, discount: 100, description: "High-end smartphone with 5G.", technicalInfo: "6GB RAM, 128GB Storage" },
  { id: 2, name: "Laptop 💻", price: 1499, description: "Lightweight laptop for professionals.", technicalInfo: "Intel i5, 16GB RAM" },
  { id: 3, name: "Headphones 🎧", price: 199, discount: 20, description: "Noise-cancelling over-ear headphones.", technicalInfo: "Bluetooth 5.0, 30hr battery" },
];

function ProductCard({ product, onAddToCart }) {
  const [open, setOpen] = useState(false);

  return (
    <Card className="w-full sm:w-1/2 md:w-1/3 p-2">
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        {/* TODO: Replace emoji with actual image tag */}
        {/* <img src={product.imageUrl} alt={product.name} className="h-40 w-full object-cover" /> */}
      </CardHeader>
      <CardContent>
        <CardDescription>{product.description}</CardDescription>
        <p className="mt-2">${product.price - (product.discount || 0)} <span className={product.discount ? "line-through text-sm text-muted-foreground ml-2" : "hidden"}>${product.price}</span></p>
        {product.discount && <Badge variant="destructive">Save ${product.discount}</Badge>}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={() => setOpen(true)}>More Info</Button>
        <Button onClick={() => onAddToCart(product)}>Add to Cart</Button>
      </CardFooter>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{product.name} Details</DialogTitle>
            <DialogDescription>{product.technicalInfo}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function Cart({ cart, onRemoveFromCart, onCheckout }) {
  const total = cart.reduce((sum, item) => sum + (item.price - (item.discount || 0)), 0);
  const totalDiscount = cart.reduce((sum, item) => sum + (item.discount || 0), 0);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View Cart 🛒</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Your Shopping Cart</DialogTitle>
        </DialogHeader>
        {cart.map(item => (
          <div key={item.id} className="flex justify-between items-center mb-2">
            <span>{item.name}</span>
            <Button onClick={() => onRemoveFromCart(item)} size="sm">Remove</Button>
          </div>
        ))}
        <hr className="my-2"/>
        <p>Total: ${total.toFixed(2)}</p>
        {totalDiscount > 0 && <p className="text-sm text-muted-foreground">You saved: ${totalDiscount.toFixed(2)}</p>}
        <DialogFooter>
          <Button onClick={onCheckout}>Proceed to Checkout</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
    // TODO: Here you would typically make an API call to update the cart server-side
  };

  const removeFromCart = (product) => {
    setCart(cart.filter(item => item.id !== product.id));
    // TODO: API call to remove item from cart
  };

  const handleCheckout = () => {
    console.log("Proceeding to checkout with items:", cart);
    // TODO: Implement actual checkout logic, possibly navigate to a checkout page or make an API call
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Tech Store</h1>
      <div className="flex flex-wrap -m-2">
        {products.map(product => (
          <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
        ))}
      </div>
      <div className="mt-4">
        <Cart cart={cart} onRemoveFromCart={removeFromCart} onCheckout={handleCheckout} />
      </div>
    </div>
  );
}