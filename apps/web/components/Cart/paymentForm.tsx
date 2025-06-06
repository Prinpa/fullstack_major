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
    <form onSubmit={handleSubmit} className="payment-form">
      <h3 className="payment-form-title">Payment Details</h3>

      <div className="payment-form-group">
        <label htmlFor="cardHolderName" className="payment-form-label">Card Holder Name</label>
        <input
          type="text"
          id="cardHolderName"
          name="cardHolderName"
          value={formState.cardHolderName}
          onChange={handleInputChange}
          className="payment-form-input"
          placeholder="John Doe"
        />
      </div>

      <div className="payment-form-group">
        <label htmlFor="cardNumber" className="payment-form-label">Card Number</label>
        <input
          type="text"
          id="cardNumber"
          name="cardNumber"
          value={formState.cardNumber}
          onChange={handleInputChange}
          className="payment-form-input"
          maxLength={16}
          placeholder="1234 5678 9012 3456"
        />
      </div>

      <div className="payment-form-row">
        <div className="payment-form-group">
          <label htmlFor="expiryDate" className="payment-form-label">Expiry Date</label>
          <input
            type="text"
            id="expiryDate"
            name="expiryDate"
            value={formState.expiryDate}
            onChange={handleInputChange}
            className="payment-form-input"
            placeholder="MM/YY"
            maxLength={5}
          />
        </div>

        <div className="payment-form-group">
          <label htmlFor="cvv" className="payment-form-label">CVV</label>
          <input
            type="text"
            id="cvv"
            name="cvv"
            value={formState.cvv}
            onChange={handleInputChange}
            className="payment-form-input"
            maxLength={4}
            placeholder="123"
          />
        </div>
      </div>

      {error && <div className="payment-error">{error}</div>}
      
      <button type="submit" className="payment-submit">
        Complete Payment
      </button>
    </form>
  );
}
