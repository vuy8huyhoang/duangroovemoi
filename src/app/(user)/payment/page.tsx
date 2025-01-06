"use client";
import { useEffect, useState } from "react";
import "./payment.scss";

const PaymentPage = () => {
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    // Gọi API để lấy nội dung HTML
    fetch("http://localhost:8888/order/create_payment_url")
      .then((res) => res.text()) // Lấy dữ liệu trả về dạng text (HTML)
      .then((html) => {
        setHtmlContent(html); // Lưu HTML vào state
      })
      .catch((err) => {
        console.error("Lỗi khi gọi API:", err);
      });
  }, []);

  return (
    <div className="p-[40px]">
      {/* Hiển thị nội dung HTML trả về */}
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
};

export default PaymentPage;
