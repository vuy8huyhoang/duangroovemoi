"use client";
import { useContext, useState } from "react";
import { AppContext } from "../layout";
import axios from "@/lib/axios";

const VipOverlay = () => {
  const { state, dispatch } = useContext(AppContext);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedTab, setSelectedTab] = useState("momo");

  const completePayment = () => {
    axios.post("complete-payment", {
      email: state?.profile?.email,
      vip_code: state?.profile?.vip_code,
    });
    dispatch({ type: "SHOW_VIP", payload: false });
  };

  return (
    <div
      className="fixed left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] backdrop-blur z-[99999] rounded-lg px-[20px] py-[10px]"
      style={{ backgroundColor: "rgba(18, 18, 18, .95)" }}
    >
      {!showPayment && (
        <div className="p-6 rounded-lg shadow-lg">
          <button
            className="text-white absolute top-[10px] right-[10px]"
            onClick={() => dispatch({ type: "SHOW_VIP", payload: false })}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-md font-semibold text-center w-full text-gray-100">
              VIP Membership
            </h1>
          </div>
          <div className="my-1 text-center text-2xl font-bold text-[30px] text-yellow-400">
            20.000VNĐ
          </div>
          <div className="text-center text-gray-500 mb-6 text-sm">
            <p>Mua một lần, dùng trọn đời</p>
          </div>
          <ul className="space-y-3 text-gray-700 list-disc">
            <li className="text-gray-500 text-sm">Nghe nhạc không giới hạn</li>
            <li className="text-gray-500 text-sm">
              Tải về các bài hát yêu thích
            </li>
            <li className="text-gray-500 text-sm">
              Tạo playlist cá nhân theo sở thích
            </li>
            <li className="text-gray-500 text-sm">Không cần gia hạn</li>
          </ul>
          <button
            onClick={() => setShowPayment(true)}
            className="w-full mt-6 bg-yellow-400 text-white py-2 rounded-md hover:opacity-75 font-bold"
          >
            Nâng cấp
          </button>
        </div>
      )}

      {showPayment && (
        <div className="max-w-lg mx-auto p-6 shadow-md rounded-lg relative bg-transparent">
          {/* Nút đóng */}
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-100"
            onClick={() => dispatch({ type: "SHOW_VIP", payload: false })}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Thông tin khách hàng */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-100">
              Thông tin khách hàng
            </h2>
            <p className="text-sm text-gray-300 mt-2">
              Code:{" "}
              <span className="font-medium text-gray-50">
                {state?.profile?.vip_code}
              </span>
            </p>
            <p className="text-sm text-gray-300 mt-2">
              Số tiền:{" "}
              <span className="font-medium text-gray-50">20.000VNĐ</span>
            </p>
          </div>

          {/* Tabs lựa chọn phương thức thanh toán */}
          <div className="border-b border-gray-600">
            <nav className="flex">
              <button
                className={`flex-1 text-[12px] text-center text-sm font-medium ${
                  selectedTab === "momo"
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-gray-400 hover:text-gray-200"
                }`}
                onClick={() => setSelectedTab("momo")}
              >
                Thanh toán Momo
              </button>
              <button
                className={`flex-1 text-[12px] text-center text-sm font-medium ${
                  selectedTab === "bank"
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-gray-400 hover:text-gray-200"
                }`}
                onClick={() => setSelectedTab("bank")}
              >
                Chuyển khoản ngân hàng
              </button>
            </nav>
          </div>

          {/* Nội dung Tab */}
          <div className="mt-6">
            {selectedTab === "momo" && (
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">
                  Thanh toán bằng Momo
                </h3>
                <img
                  src="/momo.jpg"
                  alt="Momo QR"
                  className="object-cover rounded-md shadow-md w-32 mx-auto"
                />
                <div className="mt-4 text-sm text-gray-300">
                  <p className="font-medium text-gray-50">
                    Cú pháp chuyển khoản:
                  </p>
                  <p>[CODE]-[Tên khách hàng]-groove</p>
                </div>
              </div>
            )}

            {selectedTab === "bank" && (
              <div className="text-sm text-gray-300">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">
                  Chuyển khoản ngân hàng
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium text-gray-50">Ngân hàng:</span>{" "}
                    Vietcombank
                  </p>
                  <p>
                    <span className="font-medium text-gray-50">
                      Số tài khoản:
                    </span>{" "}
                    0123456789
                  </p>
                  <p>
                    <span className="font-medium text-gray-50">
                      Tên tài khoản:
                    </span>{" "}
                    Công Ty Groove
                  </p>
                  <p className="mt-4 font-medium text-gray-50">
                    Cú pháp chuyển khoản:
                  </p>
                  <p className="">[CODE]-[Tên khách hàng]-groove</p>
                </div>
              </div>
            )}
          </div>

          {/* Ghi chú */}
          <div className="mt-4 text-center text-red-500 text-[12px]">
            <p className="text-red-500">
              * Sau khi chuyển khoản, vui lòng nhấp vào nút Hoàn tất *
            </p>
            <p className="text-red-500">
              * Tài khoản sẽ được nâng cấp sau từ 5 phút đến 24 giờ *
            </p>
            <p className="text-red-500">
              * Hỗ trợ (Zalo):{" "}
              <a
                href="https://zalo.me/0794437748"
                className="text-blue-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                0794437748
              </a>
            </p>
          </div>

          {/* Nút hoàn tất */}
          <div className="text-center mt-6">
            <button
              className="px-6 py-3 bg-blue-600 text-white font-medium text-sm rounded-lg shadow-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={completePayment}
            >
              Hoàn tất
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VipOverlay;
