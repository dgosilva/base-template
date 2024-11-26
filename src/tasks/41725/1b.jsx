import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const currencies = [
  { value: 'USD', label: 'US Dollar' },
  { value: 'EUR', label: 'Euro' },
  { value: 'JPY', label: 'Japanese Yen' },
  { value: 'GBP', label: 'British Pound' },
  { value: 'AUD', label: 'Australian Dollar' },
];

function simulateAPIResponse(currency) {
  const growth = Math.random() * (0.05 - (-0.05)) + (-0.05);
  return {
    growth: growth,
    advice: growth > 0 ? 'Buy' : 'Sell',
  };
}

function CurrencyConverter() {
  const [amount, setAmount] = useState('1.00');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);

  const handleConvert = () => {
    // Here would be an actual API call for conversion rates
    const conversionRate = Math.random() * (1.5 - 0.5) + 0.5; // Simulating rate
    const convertedAmount = (parseFloat(amount) * conversionRate).toFixed(2);
    setResult(`${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`);
    
    // Simulate API call for growth expectation
    const response = simulateAPIResponse(toCurrency);
    setApiResponse(response);
  };

  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => setResult(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [result]);

  return (
    <Card className="w-full max-w-sm mx-auto mt-10 p-4 sm:p-6">
      <CardHeader>
        <CardTitle>Currency Converter</CardTitle>
        <CardDescription>Convert and get market advice</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input 
              id="amount" 
              type="number" 
              step="0.01" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              placeholder="Enter amount"
            />
          </div>
          <div>
            <Label htmlFor="fromCurrency">From</Label>
            <Select onValueChange={setFromCurrency}>
              <SelectTrigger id="fromCurrency">
                <SelectValue placeholder="Select Currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map(currency => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="toCurrency">To</Label>
            <Select onValueChange={setToCurrency}>
              <SelectTrigger id="toCurrency">
                <SelectValue placeholder="Select Currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map(currency => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleConvert}>Convert</Button>
        {result && <p className="mt-4 text-center">{result}</p>}
        {apiResponse && (
          <p className="mt-2 text-sm text-muted-foreground">
            Next week's expectation: {apiResponse.growth > 0 ? '📈' : '📉'} {apiResponse.advice}
          </p>
        )}
      </CardFooter>
    </Card>
  );
}

export default function App() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <CurrencyConverter />
    </div>
  );
}