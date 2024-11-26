import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const currencies = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "AUD", name: "Australian Dollar" },
];

const CurrencySelector = ({ value, onChange }) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-full">
      <SelectValue placeholder="Select currency" />
    </SelectTrigger>
    <SelectContent>
      {currencies.map((currency) => (
        <SelectItem key={currency.code} value={currency.code}>
          {currency.name} ({currency.code})
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

const AmountInput = ({ value, onChange }) => (
  <Input
    type="number"
    placeholder="Enter amount"
    value={value}
    onChange={(e) => {
      const value = e.target.value;
      if (/^\d*\.?\d{0,2}$/.test(value)) {
        onChange(value);
      }
    }}
    className="w-full"
  />
);

const simulateApiCall = async (fromCurrency, toCurrency, amount) => {
  // Simulating API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const exchangeRates = {
    USD: { EUR: 0.85, GBP: 0.75, JPY: 110, AUD: 1.3 },
    EUR: { USD: 1.18, GBP: 0.88, JPY: 129, AUD: 1.53 },
    GBP: { USD: 1.33, EUR: 1.14, JPY: 147, AUD: 1.74 },
    JPY: { USD: 0.0091, EUR: 0.0077, GBP: 0.0068, AUD: 0.012 },
    AUD: { USD: 0.77, EUR: 0.65, GBP: 0.57, JPY: 83 },
  };

  const rate = exchangeRates[fromCurrency][toCurrency] || 1 / exchangeRates[toCurrency][fromCurrency];
  const convertedAmount = amount * rate;

  const growthExpectation = Math.random() * 10 - 5; // Random number between -5% and 5%
  const recommendation = growthExpectation > 0 ? "buy" : "sell";

  return {
    convertedAmount: convertedAmount.toFixed(2),
    growthExpectation: growthExpectation.toFixed(2),
    recommendation,
  };
};

export default function App() {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (fromCurrency && toCurrency && amount) {
      setLoading(true);
      simulateApiCall(fromCurrency, toCurrency, parseFloat(amount))
        .then(setResult)
        .finally(() => setLoading(false));
    } else {
      setResult(null);
    }
  }, [fromCurrency, toCurrency, amount]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Currency Converter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">From Currency</label>
            <CurrencySelector value={fromCurrency} onChange={setFromCurrency} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">To Currency</label>
            <CurrencySelector value={toCurrency} onChange={setToCurrency} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <AmountInput value={amount} onChange={setAmount} />
          </div>
          {loading && <p className="text-center">Loading...</p>}
          {result && (
            <Alert>
              <AlertTitle>Conversion Result</AlertTitle>
              <AlertDescription>
                {amount} {fromCurrency} = {result.convertedAmount} {toCurrency}
                <br />
                Growth Expectation: {result.growthExpectation}%
                <br />
                Recommendation: {result.recommendation === "buy" ? "Good time to buy" : "Good time to sell"}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}