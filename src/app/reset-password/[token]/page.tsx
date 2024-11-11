// app/reset-password/[token]/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Sử dụng useParams để lấy token từ URL
import axios from "@/lib/axios";
import styles from "../reset-password.module.scss";


const ResetPassword: React.FC = () => {
    const { token } = useParams();  // Lấy token từ URL
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    useEffect(() => {
        if (token) {
            console.log("Token từ URL:", token);
        }
    }, [token]);

    const validatePassword = (password: string): boolean => {
        return (
            password.length >= 6 &&
            /[A-Z]/.test(password) &&
            /[0-9]/.test(password)
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("Mật khẩu không khớp.");
            return;
        }

        if (!validatePassword(newPassword)) {
            setError("Mật khẩu phải có ít nhất 6 ký tự, bao gồm một chữ viết hoa và một số.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await axios.post(`/reset-password/${token}`, {
                newPassword,
            });

                setSuccess(true);
                window.location.href="/"; 
                
  
        } catch (error) {
            console.error("Lỗi khi đặt lại mật khẩu:", error);
            setError("Đã xảy ra lỗi. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

   

    return (
        <div className={styles.popupOverlay}>
            <div className={styles.popupContent}>
                <h2>Đặt lại mật khẩu</h2>
                {success ? (
                    <p>Mật khẩu của bạn đã được cập nhật thành công! Đang chuyển đến màn hình đăng nhập...</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label htmlFor="newPassword">Mật khẩu mới</label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className={styles.errorText}>{error}</p>}
                        <button type="submit" className={styles.loginBtn} disabled={loading}>
                            {loading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
