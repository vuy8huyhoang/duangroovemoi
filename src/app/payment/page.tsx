// pages/payment.js
"use client";
import { useState } from "react";
import axios from "@/lib/axios";

const PaymentPage = () => {
  const [amount, setAmount] = useState(0);
  const [data, setData] = useState(0);

  const handlePayment = async () => {
    await axios.post("payment/create-payment", { amount }).then((res: any) => {
      setData(res.result.data);
      // console.log(res);
    });
  };

  return (
    <div>
      <h1>Thanh toán VNPay</h1>
      <input
        type="number"
        value={amount}
        onChange={(e: any) => setAmount(e.target.value)}
        placeholder="Nhập số tiền"
      />
      <button onClick={handlePayment}>Thanh toán</button>
    </div>
  );
};

export default PaymentPage;
