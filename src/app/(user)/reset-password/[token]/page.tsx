// app/reset-password/[token]/page.tsx
"use client";
import React, { useEffect, useState, useContext } from "react";
import { useParams, useRouter } from "next/navigation"; // Sử dụng useParams để lấy token từ URL
import axios from "@/lib/axios";
import styles from "../reset-password.module.scss";
import { AppContext } from "../../../layout";

const ResetPassword: React.FC = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const { state, dispatch } = useContext(AppContext);
  const router = useRouter();

  useEffect(() => {
    if (token) {
      // console.log("Token từ URL:", token);
    }
  }, [token]);

  const validatePassword = (password: string): boolean => {
    return (
      password.length >= 6 && /[A-Z]/.test(password) && /[0-9]/.test(password)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu không khớp.");
      return;
    }

    if (!validatePassword(newPassword)) {
      setError(
        "Mật khẩu phải có ít nhất 6 ký tự, bao gồm một chữ viết hoa và một số."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios
        .post(`/reset-password/${token}`, {
          newPassword,
        })
        .then(() => {
          setSuccess(true);
        });

      router.push("/");
      dispatch({ type: "SHOW_LOGIN", payload: true });
    } catch (error) {
      console.error("Lỗi khi đặt lại mật khẩu:", error);

      if (error.status === 409) {
        setError("Mật khẩu mới bị trùng với mật khẩu cũ đã đặt.");
      } else {
        setError("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <h2>Đặt lại mật khẩu</h2>
        {success ? (
          <p>
            Mật khẩu của bạn đã được cập nhật thành công! Đang chuyển đến màn
            hình đăng nhập...
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              {/* <label htmlFor="newPassword">Mật khẩu mới</label> */}
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                placeholder="Mật khẩu mới..."
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              {/* <label htmlFor="confirmPassword">Xác nhận mật khẩu</label> */}
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                placeholder="Xác nhận mật khẩu..."
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className={styles.errorText}>{error}</p>}
            <button
              type="submit"
              className={styles.loginBtn}
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
