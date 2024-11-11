"use client";
import React, { useState,useEffect } from "react";
import axios from "@/lib/axios";
import styles from "./login.module.scss";
import { ReactSVG } from "react-svg";
import Link from "next/link";
interface Profile {
  birthday: string;
  country: string;
  created_at: string;
  email: string;
  fullname: string;
  gender: string;
  last_update: string;
  phone: string;
  role: string;
  url_avatar: string;
}

const Login = ({ closePopup }: { closePopup: () => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<Profile | null>(null);

  const [user, setUser] = useState({
    email: "",
    fullname: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    fullname: "",
    password: "",
  });

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleForgotPassword = () => {
    setIsForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setIsForgotPassword(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateEmail = (email: string): boolean => {
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Email là bắt buộc." }));
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors((prev) => ({ ...prev, email: "Email không hợp lệ." }));
      return false;
    }

    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (password.length < 6) {
      setErrors((prev) => ({
        ...prev,
        password: "Mật khẩu phải có ít nhất 6 ký tự.",
      }));
      return false;
    }
    return true;
  };

  const validateRegisterForm = (): boolean => {
    let isValid = true;

    if (!user.fullname) {
      setErrors((prev) => ({ ...prev, fullname: "Họ và tên là bắt buộc." }));
      isValid = false;
    }

    if (!validateEmail(user.email)) {
      isValid = false;
    }

    if (!validatePassword(user.password)) {
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateEmail(user.email) || !validatePassword(user.password)) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/login", {
        email: user.email,
        password: user.password,
      });

      const data = response?.data || response;
      const result = data.result || {};

      if (result.accessToken) {
        const { accessToken } = result;
        localStorage.setItem("accessToken", accessToken);

        const profileResponse:any = await axios.get("/profile", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        console.log("Profile Response:", profileResponse);

        const fetchedProfileData = profileResponse?.result?.data;
        if (fetchedProfileData) {
          setProfileData(fetchedProfileData);
          localStorage.setItem("profileData", JSON.stringify(fetchedProfileData));
          console.log("Profile Data Set:", fetchedProfileData);
          alert("Đăng nhập thành công!");
          closePopup();

          if (fetchedProfileData.role === "admin") {
            window.location.href = "/admin";
          } else {
            window.location.href = "/";
          }
        } else {
          console.error("Phản hồi không như mong đợi:", profileResponse);
          alert("Đăng nhập không thành công: Phản hồi không như mong đợi.");
        }
      } else {
        console.error("Phản hồi không như mong đợi:", data);
        alert("Đăng nhập không thành công: Phản hồi không như mong đợi.");
      }
    } catch (error: any) {
      console.error("Lỗi khi đăng nhập:", error);

      if (error.response) {
        alert(
          `Lỗi đăng nhập: ${error.response.data?.message || "Kiểm tra lại thông tin đăng nhập."}`
        );
      } else {
        alert("Đã xảy ra lỗi khi kết nối với server.");
      }
    } finally {
      setLoading(false);
    }
  };
  



  const handleRegister = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateRegisterForm()) return;

    setLoading(true);
    try {
      const response = await axios.post("/register", user, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200 || response.status === 201) {
        alert("Đăng ký thành công!");
        setIsLogin(true);
      } else {
        alert("Đăng ký không thành công.");
      }
    } catch (error) {
      console.error("Lỗi khi đăng ký người dùng:", error);
      alert("Đã xảy ra lỗi khi gửi dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const emailInput = (e.target as HTMLFormElement).email.value;

    if (!validateEmail(emailInput)) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/forgot-password", {
        email: emailInput,
      });

      alert("Đã gửi yêu cầu khôi phục mật khẩu. Vui lòng kiểm tra email của bạn.");

    } catch (error: any) {
      console.error("Lỗi khi yêu cầu khôi phục mật khẩu:", error);

      if (error.response) {
        if (error.response.status === 404) {
          alert("Email không tồn tại. Vui lòng kiểm tra lại.");
        } else {
          alert("Đã xảy ra lỗi khi yêu cầu khôi phục mật khẩu.");
        }
      } else {
        alert("Đã xảy ra lỗi khi kết nối với server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        {!isForgotPassword ? (
          <>
            <h2>{isLogin ? "Đăng nhập vào Groove" : "Đăng ký vào Groove"}</h2>
            <form onSubmit={isLogin ? handleLogin : handleRegister}>
              {isLogin ? (
                <>
                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Email"
                      value={user.email}
                      onChange={handleChange}
                      required
                    />
                    {errors.email && <p className={styles.errorText}>{errors.email}</p>}
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="password">Mật khẩu</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Mật khẩu"
                      value={user.password}
                      onChange={handleChange}
                      required
                    />
                    {errors.password && <p className={styles.errorText}>{errors.password}</p>}
                  </div>
                  <button
                    type="submit"
                    className={styles.loginBtn}
                    disabled={loading}
                  >
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                  </button>
                </>
              ) : (
                <>
                  <div className={styles.formGroup}>
                    <label htmlFor="fullname">Họ và tên</label>
                    <input
                      type="text"
                      id="fullname"
                      name="fullname"
                      placeholder="Họ và tên"
                      value={user.fullname}
                      onChange={handleChange}
                      required
                    />
                    {errors.fullname && <p className={styles.errorText}>{errors.fullname}</p>}
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Email"
                      value={user.email}
                      onChange={handleChange}
                      required
                    />
                    {errors.email && <p className={styles.errorText}>{errors.email}</p>}
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="password">Mật khẩu</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Mật khẩu"
                      value={user.password}
                      onChange={handleChange}
                      required
                    />
                    {errors.password && <p className={styles.errorText}>{errors.password}</p>}
                  </div>
                  <button
                    type="submit"
                    className={styles.loginBtn}
                    disabled={loading}
                  >
                    {loading ? "Đang gửi..." : "Đăng ký"}
                  </button>
                </>
              )}
            </form>
            <p className={styles.forgotPassword}>
              {isLogin && (
                <a href="#" onClick={handleForgotPassword}>
                  Quên mật khẩu của bạn?
                </a>
              )}
            </p>
            <p className={styles.additionalInfo}>
              {isLogin ? (
                <>
                  Bạn chưa có tài khoản?{" "}
                  <a href="#" onClick={toggleForm}>Đăng ký Groove</a>
                </>
              ) : (
                <>
                  Bạn đã có tài khoản?{" "}
                  <a href="#" onClick={toggleForm}>Đăng nhập vào Groove</a>
                </>
              )}
            </p>
          </>
        ) : (
          <>
            <h2>Khôi phục mật khẩu</h2>
            <form onSubmit={handleForgotPasswordSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email hoặc tên người dùng</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  placeholder="Email hoặc tên người dùng"
                />
              </div>
              <button type="submit" className={styles.loginBtn}>
                Tìm tài khoản
              </button>
            </form>
            <p className={styles.backToLogin}>
              <a href="#" onClick={handleBackToLogin}>
                Trở về đăng nhập
              </a>
            </p>
          </>
        )}
        <button className={styles.closeBtn} onClick={closePopup}>
          <ReactSVG src="/close.svg" />
        </button>
      </div>
    </div>
  );
};

export default Login;
