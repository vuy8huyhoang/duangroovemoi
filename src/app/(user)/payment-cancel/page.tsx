"use client";
import axiosLib from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const PaymentFailed = () => {
  const id = JSON.parse(localStorage.getItem("currentPayment"));
  const router = useRouter();

  useEffect(() => {
    axiosLib.patch(`/auth/payment/${id}`, { status: "cancel" });
  });

  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center p-8 bg-white shadow-lg rounded-lg max-w-md">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">
          Thanh toán thất bại!
        </h1>
        <p className="mt-2 text-gray-600">
          Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={handleBackToHome}
            className="px-6 py-2 text-gray-800 bg-gray-200 hover:bg-gray-300 rounded-lg shadow-md"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
