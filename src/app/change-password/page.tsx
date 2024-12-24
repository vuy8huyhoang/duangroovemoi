"use client";
import { useState } from "react";
import axios from "@/lib/axios";
import styles from "./changepassword.module.scss";

const errorMessages = {
  "New password and old password are the same":
    "Mật khẩu mới và mật khẩu cũ không được giống nhau",
  "Wrong password": "Sai mật khẩu cũ ",
  "New password is too weak": "Mật khẩu mới quá yếu",
  // Thêm các thông báo lỗi khác tại đây
};

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // Lưu lỗi cho từng trường

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};

    if (!oldPassword) newErrors.oldPassword = "Vui lòng nhập mật khẩu cũ";
    if (!newPassword) newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    if (!confirmPassword)
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới";
    else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors); // Cập nhật lỗi
    return Object.keys(newErrors).length === 0; // Không có lỗi => hợp lệ
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFields()) {
      console.log("Có lỗi trong form, không gửi yêu cầu");
      return;
    }

    try {
      console.log("Gửi yêu cầu đổi mật khẩu", { oldPassword, newPassword });
      const response = await axios.patch("/change-password", {
        oldPassword,
        newPassword,
      });

      alert("Đổi mật khẩu thành công!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.";
      const translatedMessage = errorMessages[errorMessage] || errorMessage; // Dịch nếu có
      const newErrors = { oldPassword: "", global: "" }; // Khởi tạo mới để tránh lưu lỗi cũ

      if (errorMessage === "Wrong password") {
        newErrors.oldPassword = translatedMessage; // Gán lỗi cụ thể
      } else {
        newErrors.global = translatedMessage; // Gán lỗi chung
      }

      setErrors(newErrors); // Cập nhật lỗi mới
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Đổi mật khẩu</h1>
      <form onSubmit={handleChangePassword}>
        <div className={styles.inputGroup}>
          <input
            type="password"
            placeholder="Mật khẩu cũ"
            className={styles.input}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          {errors.oldPassword && (
            <p className={styles.error}>{errors.oldPassword}</p>
          )}
        </div>
        <div className={styles.inputGroup}>
          <input
            type="password"
            placeholder="Mật khẩu mới"
            className={styles.input}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          {errors.newPassword && (
            <p className={styles.error}>{errors.newPassword}</p>
          )}
        </div>
        <div className={styles.inputGroup}>
          <input
            type="password"
            placeholder="Xác nhận mật khẩu mới"
            className={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && (
            <p className={styles.error}>{errors.confirmPassword}</p>
          )}
        </div>
        <button type="submit" className={styles.button}>
          Đổi mật khẩu
        </button>
      </form>
      {errors.global && <p className={styles.globalError}>{errors.global}</p>}
    </div>
  );
}
