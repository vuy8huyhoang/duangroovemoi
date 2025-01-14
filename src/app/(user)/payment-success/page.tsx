"use client";
import { AppContext } from "@/app/layout";
import axiosLib from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

const PaymentSuccess = () => {
  let id;
  if (typeof window !== undefined) {
    id = JSON.parse(localStorage.getItem("currentPayment"));
  }
  const router = useRouter();
  const { state, dispatch } = useContext(AppContext);

  useEffect(() => {
    axiosLib.patch(`/auth/payment/${id}`, { status: "paid" });
  }, [state?.profile]);

  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center p-8 bg-white shadow-lg rounded-lg max-w-md">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">
          Thanh toán thành công!
        </h1>
        <button
          onClick={handleBackToHome} // Điều hướng về trang chủ
          className="mt-6 px-6 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-md"
        >
          Về trang chủ
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
