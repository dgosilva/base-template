import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Menu array containing available products with their prices
const menu = [
  { id: 1, name: "Burger", price: 10 },
  { id: 2, name: "Pizza", price: 12 },
  { id: 3, name: "Salad", price: 8 },
  { id: 4, name: "Pasta", price: 11 },
  { id: 5, name: "Steak", price: 15 },
];

// Component to render each table with seats
const Table = ({ id, seats, onSeatClick, onTableClick }) => (
  <div
    className={`border-2 border-gray-300 p-4 rounded-lg ${
      seats.some((seat) => seat.occupied) ? "bg-blue-100" : "bg-white"
    }`}
    onClick={onTableClick}
  >
    <h3 className="text-lg font-semibold mb-2">Table {id}</h3>
    <div className="grid grid-cols-2 gap-2">
      {seats.map((seat, index) => (
        <div
          key={index}
          className={`w-12 h-12 rounded-full ${
            seat.occupied ? "bg-green-500" : "bg-gray-300"
          } flex items-center justify-center cursor-pointer`}
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the table click event
            onSeatClick(id, index);
          }}
        >
          {index + 1}
        </div>
      ))}
    </div>
  </div>
);

// Dialog component for placing an order
const OrderDialog = ({ isOpen, onClose, onOrder }) => {
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState(1);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Place an Order</DialogTitle>
        </DialogHeader>
        <Select onValueChange={setProduct}>
          <SelectTrigger>
            <SelectValue placeholder="Select a product" />
          </SelectTrigger>
          <SelectContent>
            {menu.map((item) => (
              <SelectItem key={item.id} value={item.name}>
                {item.name} - ${item.price}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        />
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={() => onOrder(product, quantity)} className="bg-green-500">
            Place Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Dialog component for displaying the bill and time duration
const BillDialog = ({ isOpen, onClose, bill, onCloseBill, duration }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Table Bill</DialogTitle>
      </DialogHeader>
      <div>
        {bill.map((item, index) => (
          <div key={index}>
            {item.product} x{item.quantity} - ${item.price * item.quantity}
          </div>
        ))}
      </div>
      <div className="font-bold">
        Total: ${bill.reduce((sum, item) => sum + item.price * item.quantity, 0)}
      </div>
      <div className="mt-2">
        <strong>Occupation Time:</strong> {duration} seconds
      </div>
      <DialogFooter>
        <Button onClick={onClose} variant="outline">
          Cancel
        </Button>
        <Button onClick={onCloseBill} className="bg-red-500">
          Close Bill
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

// Confirmation dialog component for seat occupation
const ConfirmationDialog = ({ isOpen, onClose, onConfirm }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Occupy Seat</DialogTitle>
      </DialogHeader>
      <p>Do you want to occupy this seat?</p>
      <DialogFooter>
        <Button onClick={onClose} variant="outline">
          Cancel
        </Button>
        <Button onClick={onConfirm} className="bg-blue-500">
          Confirm
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default function App() {
  // State to manage table data, selected seat and table, and dialog visibility
  const [tables, setTables] = useState(
    Array(5)
      .fill()
      .map((_, i) => ({
        id: i + 1,
        seats: Array(4).fill().map(() => ({ occupied: false })),
        bill: [],
        occupiedAt: null,
      }))
  );
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [isBillDialogOpen, setIsBillDialogOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);

  // Handle seat click event: open confirmation or order dialog
  const handleSeatClick = (tableId, seatIndex) => {
    const table = tables.find((t) => t.id === tableId);
    const seat = table.seats[seatIndex];

    if (seat.occupied) {
      setSelectedSeat({ tableId, seatIndex });
      setIsOrderDialogOpen(true);
    } else {
      setSelectedSeat({ tableId, seatIndex });
      setIsConfirmationDialogOpen(true);
    }
  };

  // Confirm occupying a seat
  const confirmOccupySeat = () => {
    const { tableId, seatIndex } = selectedSeat;
    const newTables = tables.map((t) =>
      t.id === tableId
        ? {
            ...t,
            seats: t.seats.map((s, i) =>
              i === seatIndex ? { ...s, occupied: true } : s
            ),
            occupiedAt: t.occupiedAt || new Date(),
          }
        : t
    );
    setTables(newTables);
    setIsConfirmationDialogOpen(false);
  };

  // Handle table click event to open bill dialog
  const handleTableClick = (tableId) => {
    setSelectedTable(tableId);
    setIsBillDialogOpen(true);
  };

  // Handle placing an order
  const handleOrder = (product, quantity) => {
    const menuItem = menu.find((item) => item.name === product);
    if (menuItem) {
      const newTables = tables.map((t) =>
        t.id === selectedSeat.tableId
          ? { ...t, bill: [...t.bill, { product, quantity, price: menuItem.price }] }
          : t
      );
      setTables(newTables);
    }
    setIsOrderDialogOpen(false);
  };

  // Handle closing the bill and resetting table data
  const handleCloseBill = () => {
    const table = tables.find((t) => t.id === selectedTable);
    const duration = table.occupiedAt ? ((new Date() - table.occupiedAt) / 1000).toFixed(2) : 0;

    const newTables = tables.map((t) =>
      t.id === selectedTable
        ? {
            ...t,
            seats: t.seats.map(() => ({ occupied: false })),
            bill: [],
            occupiedAt: null,
          }
        : t
    );
    setTables(newTables);
    setIsBillDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Restaurant Table Management</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {tables.map((table) => (
          <Table
            key={table.id}
            {...table}
            onSeatClick={handleSeatClick}
            onTableClick={() => handleTableClick(table.id)}
          />
        ))}
      </div>
      <OrderDialog
        isOpen={isOrderDialogOpen}
        onClose={() => setIsOrderDialogOpen(false)}
        onOrder={handleOrder}
      />
      <BillDialog
        isOpen={isBillDialogOpen}
        onClose={() => setIsBillDialogOpen(false)}
        bill={selectedTable ? tables.find((t) => t.id === selectedTable).bill : []}
        duration={selectedTable ? ((new Date() - tables.find((t) => t.id === selectedTable).occupiedAt) / 1000).toFixed(2) : 0}
        onCloseBill={handleCloseBill}
      />
      <ConfirmationDialog
        isOpen={isConfirmationDialogOpen}
        onClose={() => setIsConfirmationDialogOpen(false)}
        onConfirm={confirmOccupySeat}
      />
    </div>
  );
}