import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { TrashIcon } from '@heroicons/react/24/outline';

function App() {
  const [textInput, setTextInput] = useState('');
  const [tableData, setTableData] = useState([]);

  const parseTextToTable = (text) => {
    const separator = ' - ';
    return text.split('\n').map(line => {
      if (line.includes(separator)) {
        return line.split(separator).map(item => item.trim());
      }
      return [line]; // For lines like "Total - 125"
    });
  };

  const handleConfirm = () => {
    const newData = parseTextToTable(textInput);
    setTableData(prevData => [...prevData, ...newData]);
  };

  const deleteRow = (index) => {
    setTableData(prevData => prevData.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col items-center p-4 sm:p-8 space-y-4">
      <div className="w-full max-w-lg">
        <Input 
          as="textarea"
          value={textInput} 
          onChange={(e) => setTextInput(e.target.value)} 
          placeholder="Enter your items here..."
          className="h-40"
        />
        <Button onClick={handleConfirm} className="mt-2 w-full">Confirm</Button>
      </div>

      <Table className="w-full max-w-lg">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Item</TableHead>
            <TableHead className="text-right">Value</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((row, index) => (
            <TableRow key={index}>
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex} className={cellIndex === row.length - 1 ? "text-right" : ""}>{cell}</TableCell>
              ))}
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => deleteRow(index)}>
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default App;