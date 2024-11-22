import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

const TableEditor = () => {
  const [inputText, setInputText] = useState("");
  const [tableData, setTableData] = useState([]);

  // Parse the input text into a 2D array, trimming whitespace and removing empty elements
  const parseInput = (input) => {
    return input
      .split("\n") // Split input into lines
      .map((line) =>
        line
          .split(" - ") // Split each line into cells
          .map((cell) => cell.trim()) // Trim whitespace from each cell
          .filter((cell) => cell !== "") // Remove empty cells
      )
      .filter((row) => row.length > 0); // Remove empty rows
  };

  // Handle the confirm button click to update table data
  const handleConfirm = () => {
    const newData = parseInput(inputText);
    setTableData((prevData) => [...prevData, ...newData]);
    setInputText(""); // Clear the input text after confirming
  };

  // Handle the deletion of a row based on its index
  const handleDelete = (index) => {
    setTableData((prevData) => prevData.filter((_, i) => i !== index));
  };

  // Handle changes to individual cells in the table
  const handleCellChange = (rowIndex, cellIndex, value) => {
    setTableData((prevData) =>
      prevData.map((row, i) =>
        i === rowIndex ? row.map((cell, j) => (j === cellIndex ? value : cell)) : row
      )
    );
  };

  return (
    <div className="p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Input Data</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter data (e.g., 'Supermarket - Banana - 5')"
            className="mb-2"
          />
          <Button onClick={handleConfirm}>Confirm</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Editable Table</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Input
                        value={cell}
                        onChange={(e) => handleCellChange(rowIndex, cellIndex, e.target.value)}
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(rowIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default function App() {
  return (
    <div className="container mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-center my-4">Table Creator App</h1>
      <TableEditor />
    </div>
  );
}