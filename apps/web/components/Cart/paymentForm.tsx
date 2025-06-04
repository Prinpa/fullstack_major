"use client"
import { useState } from "react";
import { placeOrder } from "components/cartFunctions";

export function PaymentFrom() {
  const [formState, setFormState] = useState({
    cardNumber: "",
    cardHolderName: "",
    expiryDate: "",
    cvv: "",
  })
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formState.cardNumber || !formState.cardHolderName || !formState.expiryDate || !formState.cvv) {
      setError("All fields are required");
      return;
    }
    // successful form submission, move to the cart to the orders table and drop this cart
    placeOrder();
    console.log("Processing payment:", formState);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="cardHolderName">Card Holder Name:</label>
        <input
          type="text"
          id="cardHolderName"
          name="cardHolderName"
          value={formState.cardHolderName}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label htmlFor="cardNumber">Card Number:</label>
        <input
          type="text"
          id="cardNumber"
          name="cardNumber"
          value={formState.cardNumber}
          onChange={handleInputChange}
          maxLength={16}
        />
      </div>

      <div>
        <label htmlFor="expiryDate">Expiry Date:</label>
        <input
          type="text"
          id="expiryDate"
          name="expiryDate"
          value={formState.expiryDate}
          onChange={handleInputChange}
          placeholder="MM/YY"
          maxLength={5}
        />
      </div>

      <div>
        <label htmlFor="cvv">CVV:</label>
        <input
          type="text"
          id="cvv"
          name="cvv"
          value={formState.cvv}
          onChange={handleInputChange}
          maxLength={4}
        />
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}
      
      <button type="submit">Submit Payment</button>
    </form>
  );
}
