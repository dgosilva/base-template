import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";

const menu = [
  { id: 1, name: 'Burger', price: 10 },
  { id: 2, name: 'Pizza', price: 12 },
  { id: 3, name: 'Salad', price: 8 },
];

function App() {
  const [tables, setTables] = useState(
    Array(5).fill().map((_, i) => ({
      id: i + 1,
      seats: Array(4).fill({ occupied: false, order: null }),
      occupied: false,
      bill: 0,
      startTime: null
    }))
  );
  const [dialog, setDialog] = useState({ open: false, type: '', seat: null, table: null });

  const handleSeatClick = (tableIndex, seatIndex) => {
    const seat = tables[tableIndex].seats[seatIndex];
    setDialog({
      open: true,
      type: seat.occupied ? 'manage' : 'occupy',
      seat: { tableIndex, seatIndex },
      table: tableIndex
    });
  };

  const occupySeat = () => {
    setTables(prev => {
      const newTables = [...prev];
      const seat = newTables[dialog.seat.tableIndex].seats[dialog.seat.seatIndex];
      seat.occupied = true;
      if (!newTables[dialog.seat.tableIndex].occupied) {
        newTables[dialog.seat.tableIndex].occupied = true;
        newTables[dialog.seat.tableIndex].startTime = Date.now();
      }
      return newTables;
    });
    setDialog({ ...dialog, open: false });
  };

  const manageSeat = () => {
    setDialog({ ...dialog, type: 'order' });
  };

  const placeOrder = (productId, quantity) => {
    setTables(prev => {
      const newTables = [...prev];
      const seat = newTables[dialog.seat.tableIndex].seats[dialog.seat.seatIndex];
      const product = menu.find(item => item.id === parseInt(productId));
      seat.order = { product, quantity: parseInt(quantity) };
      newTables[dialog.seat.tableIndex].bill += product.price * parseInt(quantity);
      return newTables;
    });
    setDialog({ ...dialog, open: false });
  };

  const closeBill = () => {
    setTables(prev => {
      const newTables = [...prev];
      const table = newTables[dialog.table];
      table.seats = table.seats.map(seat => ({ ...seat, occupied: false, order: null }));
      table.occupied = false;
      table.bill = 0;
      table.startTime = null;
      return newTables;
    });
    setDialog({ ...dialog, open: false });
  };

  useEffect(() => {
    if (dialog.open && dialog.type === 'bill') closeBill();
  }, [dialog]);

  return (
    <div className="p-4 sm:p-8 flex flex-col items-center">
      <h1 className="text-2xl mb-4">Restaurant Table Management</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tables.map((table, tIndex) => (
          <Card key={table.id} className="w-full">
            <CardHeader>
              <CardTitle>Table {table.id}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {table.seats.map((seat, sIndex) => (
                <div 
                  key={sIndex} 
                  onClick={() => handleSeatClick(tIndex, sIndex)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer ${seat.occupied ? 'bg-red-500' : 'bg-green-500'}`}
                >
                  {seat.occupied ? 'X' : sIndex + 1}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialog.open} onOpenChange={() => setDialog({ ...dialog, open: false })}>
        <DialogContent>
          {dialog.type === 'occupy' && (
            <DialogHeader>
              <DialogTitle>Occupy Seat?</DialogTitle>
              <DialogFooter>
                <Button onClick={occupySeat}>Yes</Button>
              </DialogFooter>
            </DialogHeader>
          )}
          {dialog.type === 'manage' && (
            <DialogHeader>
              <DialogTitle>Manage Seat</DialogTitle>
              <DialogFooter>
                <Button onClick={manageSeat} color="primary">Order</Button>
                <Button onClick={() => setDialog({ ...dialog, type: 'bill' })} color="destructive">Close Bill</Button>
              </DialogFooter>
            </DialogHeader>
          )}
          {dialog.type === 'order' && (
            <DialogHeader>
              <DialogTitle>Place Order</DialogTitle>
              <Input type="number" placeholder="Quantity" className="mb-2" />
              <Select onChange={(e) => placeOrder(e.target.value, document.querySelector('.mb-2').value)}>
                {menu.map(item => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}
              </Select>
            </DialogHeader>
          )}
          {dialog.type === 'bill' && (
            <DialogHeader>
              <DialogTitle>Table {dialog.table + 1} Bill: ${tables[dialog.table].bill}</DialogTitle>
              <DialogFooter>
                <Button onClick={closeBill}>Close Bill</Button>
              </DialogFooter>
            </DialogHeader>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;