import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Simulated product data
const products = [
  { id: 1, name: "Laptop", emoji: "💻", price: 999, discountedPrice: 899, description: "Powerful laptop for work and play", techSpecs: "Intel i7, 16GB RAM, 512GB SSD" },
  { id: 2, name: "Smartphone", emoji: "📱", price: 699, description: "Latest smartphone with advanced features", techSpecs: "6.5\" OLED, 128GB Storage, 5G" },
  { id: 3, name: "Headphones", emoji: "🎧", price: 199, discountedPrice: 179, description: "Noise-cancelling wireless headphones", techSpecs: "40mm drivers, 30-hour battery life" },
  { id: 4, name: "Smartwatch", emoji: "⌚", price: 299, description: "Fitness tracker and smartwatch", techSpecs: "Heart rate monitor, GPS, 5 ATM water resistance" },
];

function ProductCard({ product, addToCart }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="w-full sm:w-64 m-2">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {product.name}
          <span className="text-4xl">{product.emoji}</span>
          {/* TODO: Replace emoji with actual image */}
          {/* <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover" /> */}
        </CardTitle>
        <CardDescription>${product.discountedPrice || product.price}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{product.description}</p>
        {product.discountedPrice && (
          <Badge className="mt-2 bg-green-500">
            Save ${product.price - product.discountedPrice}
          </Badge>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">More Info</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{product.name}</DialogTitle>
            </DialogHeader>
            <p>{product.description}</p>
            <p className="mt-2 font-bold">Tech Specs:</p>
            <p>{product.techSpecs}</p>
          </DialogContent>
        </Dialog>
        <Button onClick={() => addToCart(product)}>Add to Cart</Button>
      </CardFooter>
    </Card>
  );
}

function CartDialog({ cart, removeFromCart, total, discount }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>View Cart ({cart.length})</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Your Cart</DialogTitle>
        </DialogHeader>
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between items-center my-2">
            <span>{item.name} - ${item.discountedPrice || item.price}</span>
            <Button variant="destructive" onClick={() => removeFromCart(item)}>Remove</Button>
          </div>
        ))}
        <div className="mt-4">
          <p>Subtotal: ${total}</p>
          <p>Discount: ${discount}</p>
          <p className="font-bold">Total: ${total - discount}</p>
        </div>
        <Button className="mt-4" onClick={() => {
          // TODO: Implement actual checkout process
          alert("Proceeding to checkout");
        }}>
          Proceed to Checkout
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (product) => {
    setCart(cart.filter((item) => item.id !== product.id));
  };

  const total = cart.reduce((sum, item) => sum + (item.discountedPrice || item.price), 0);
  const discount = cart.reduce((sum, item) => sum + (item.discountedPrice ? item.price - item.discountedPrice : 0), 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">E-commerce Store</h1>
      <div className="flex flex-wrap justify-center">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} />
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <CartDialog cart={cart} removeFromCart={removeFromCart} total={total} discount={discount} />
      </div>
    </div>
  );
}