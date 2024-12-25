"use client";
import React, { useState, useEffect, useContext } from "react";
import axios from "@/lib/axios";
import styles from "./login.module.scss";
import { ReactSVG } from "react-svg";
import Link from "next/link";
import { AppContext } from "@/app/layout";
import clsx from "clsx";

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

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const { state, dispatch } = useContext(AppContext);
  const [user, setUser] = useState({
    email: "",
    fullname: "",
    password: "",
    otp: "", // Thêm trường OTP
    resetPassword: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    fullname: "",
    password: "",
    otp: "", // Thêm lỗi cho OTP
    resetPassword: "",
  });

  const [isOtpSent, setIsOtpSent] = useState(false); // Trạng thái gửi OTP

  const togglePopup = () => {
    dispatch({ type: "SHOW_LOGIN", payload: !state?.showLogin });
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setErrors({
      email: "",
      fullname: "",
      password: "",
      otp: "", // Thêm lỗi cho OTP
      resetPassword: "",
    });
  };

  const handleForgotPassword = () => {
    setIsForgotPassword(true);
    setErrors({
      email: "",
      fullname: "",
      password: "",
      otp: "", // Thêm lỗi cho OTP
      resetPassword: "",
    });
  };

  const handleBackToLogin = () => {
    setIsForgotPassword(false);
    setErrors({
      email: "",
      fullname: "",
      password: "",
      otp: "", // Thêm lỗi cho OTP
      resetPassword: "",
    });
  };

  const handleBackToRegister = () => {
    setIsForgotPassword(false);
    setIsLogin(false);
    setErrors({
      email: "",
      fullname: "",
      password: "",
      otp: "", // Thêm lỗi cho OTP
      resetPassword: "",
    });
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

    if (!user.email) {
      setErrors((prev) => ({ ...prev, email: "Email là bắt buộc." }));
      isValid = false;
    } else if (!validateEmail(user.email)) {
      isValid = false;
    }

    if (!user.password) {
      setErrors((prev) => ({ ...prev, password: "Mật khẩu là bắt buộc." }));
      isValid = false;
    } else if (!validatePassword(user.password)) {
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
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", accessToken);
        }

        const profileResponse: any = await axios.get("/profile", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        // console.log("Profile Response:", profileResponse);

        const fetchedProfileData = profileResponse?.result?.data;
        if (fetchedProfileData) {
          setProfileData(fetchedProfileData);
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "profileData",
              JSON.stringify(fetchedProfileData)
            );
          }
          // console.log("Profile Data Set:", fetchedProfileData);
          alert("Đăng nhập thành công!");
          togglePopup();

          if (fetchedProfileData.role === "admin") {
            window.location.href = "/admin";
          } else {
            window.location.href = "/";
          }
        } else {
          alert("Đăng nhập không thành công");
        }
      } else {
        alert("Đăng nhập không thành công");
      }
    } catch (error: any) {
      console.error("Lỗi khi đăng nhập:", error);

      if (error.response) {
        if (error.response.status === 401) {
          setErrors((prev) => ({ ...prev, password: "Nhập sai mật khẩu." }));
        }
        if (error.response.status === 404) {
          setErrors((prev) => ({
            ...prev,
            email: "Tên đăng nhập không tồn tại.",
          }));
        }
      } else {
        alert("Đã xảy ra lỗi khi kết nối với server.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (user.password !== user.resetPassword) {
      setErrors((prev) => {
        return { ...prev, resetPassword: "Nhập lại mật khẩu không đúng" };
      });
      return;
    }
    if (!validateRegisterForm()) return;

    setLoading(true);
    // Gửi otp, đặt otp vào local
    console.log(user);
    if (!isOtpSent) {
      axios
        .post("verify-email", { email: user.email })
        .then((res: any) => {
          if (res.result.code) {
            alert("Đăng ký thành công! Mã OTP đã được gửi đến email của bạn.");
            setIsOtpSent(true);
            localStorage.setItem("otp", res.result.code);
          } else {
            alert("Đã xảy ra lỗi khi gửi OTP.");
          }
        })
        .catch((error: any) => {
          if (error.response && error.response.status === 409) {
            setErrors((prev) => {
              return { ...prev, email: "Email đã được sử dụng" };
            });
          } else {
            console.error("Đã xảy ra lỗi:", error);
            alert("Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.");
          }
        });
    } else {
      if (localStorage.getItem("otp") === user.otp) {
        axios.post("/register", user);
        alert("Đăng ký tài khoản thành công");
        setIsForgotPassword(false);
        setIsLogin(true);
      } else {
        alert("Otp không khớp");
      }
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (user.password !== user.resetPassword) {
      setErrors((prev) => {
        return { ...prev, resetPassword: "Mật khẩu nhập lại không đúng" };
      });
    }

    if (!user.otp) {
      setErrors((prev) => ({ ...prev, otp: "Mã OTP là bắt buộc." }));
      return;
    }

    const storedOtp = localStorage.getItem("otp"); // Lấy OTP từ localStorage

    if (storedOtp === user.otp) {
      dispatch({ type: "SHOW_LOGIN", payload: true });
      localStorage.removeItem("otp");
      // alert("X");
    } else {
      setErrors((prev) => ({ ...prev, otp: "Mã OTP không chính xác." }));
      alert("Mã OTP không chính xác. Vui lòng thử lại.");
    }
  };

  const handleForgotPasswordSubmit = async (
    e: React.FormEvent
  ): Promise<void> => {
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

      alert(
        "Đã gửi yêu cầu khôi phục mật khẩu. Vui lòng kiểm tra email của bạn."
      );
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
          ////////////////////////////////////////////////////// login
          <>
            <div className={styles.logo}>
              <img src="/logo.svg" alt="" />
            </div>
            <h2>{isLogin ? "Welcome back!" : "Let's start!"}</h2>
            <form
              className="w-full"
              onSubmit={isLogin ? handleLogin : handleRegister}
            >
              {isLogin ? (
                <>
                  <div className={styles.formGroup}>
                    {/* <label htmlFor="email">Email</label> */}
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Email..."
                      value={user.email}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <p className={styles.errorText}>{errors.email}</p>
                    )}
                  </div>
                  <div className={styles.formGroup}>
                    {/* <label htmlFor="password">Mật khẩu</label> */}
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Mật khẩu..."
                      value={user.password}
                      onChange={handleChange}
                    />
                    {errors.password && (
                      <p className={styles.errorText}>{errors.password}</p>
                    )}
                  </div>
                  <div className={clsx("flex justify-between")}>
                    <div
                      onClick={handleForgotPassword}
                      className="p-[4px] text-[12px] font-[300] text-[#ffffff4d] cursor-pointer"
                    >
                      Quên mật khẩu?
                    </div>
                    {isLogin ? (
                      <div
                        onClick={toggleForm}
                        className="p-[4px] text-[12px] font-[300] text-[#ffffff4d] cursor-pointer"
                      >
                        Bạn chưa có tài khoản?
                      </div>
                    ) : (
                      <div
                        onClick={toggleForm}
                        className="p-[4px] text-[12px] font-[300] text-[#ffffff4d] cursor-pointer"
                      >
                        Bạn đã có tài khoản?
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className={styles.loginBtn}
                    disabled={loading}
                  >
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                  </button>
                </>
              ) : isOtpSent ? (
                <>
                  {/* <form onSubmit={handleVerifyOtp}> */}
                  <div className={styles.formGroup}>
                    {/* <label htmlFor="otp">Mã OTP</label> */}
                    <input
                      type="text"
                      id="otp"
                      name="otp"
                      placeholder="Nhập mã OTP..."
                      value={user.otp}
                      onChange={handleChange}
                    />
                    {errors.otp && (
                      <p className={styles.errorText}>{errors.otp}</p>
                    )}
                  </div>
                  <div className={clsx("flex justify-between")}>
                    <div
                      onClick={handleForgotPassword}
                      className="p-[4px] text-[12px] font-[300] text-[#ffffff4d] cursor-pointer"
                    >
                      Quên mật khẩu?
                    </div>
                    {isLogin ? (
                      <div
                        onClick={toggleForm}
                        className="p-[4px] text-[12px] font-[300] text-[#ffffff4d] cursor-pointer"
                      >
                        Bạn chưa có tài khoản?
                      </div>
                    ) : (
                      <div
                        onClick={toggleForm}
                        className="p-[4px] text-[12px] font-[300] text-[#ffffff4d] cursor-pointer"
                      >
                        Bạn đã có tài khoản?
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className={styles.loginBtn}
                    disabled={loading}
                  >
                    {loading ? "Đang xác thực..." : "Xác thực OTP"}
                  </button>
                  {/* </form> */}
                </>
              ) : (
                <>
                  <div className={styles.formGroup}>
                    {/* <label htmlFor="fullname">Họ và tên</label> */}
                    <input
                      type="text"
                      id="fullname"
                      name="fullname"
                      placeholder="Họ và tên..."
                      value={user.fullname}
                      onChange={handleChange}
                    />
                    {errors.fullname && (
                      <p className={styles.errorText}>{errors.fullname}</p>
                    )}
                  </div>
                  <div className={styles.formGroup}>
                    {/* <label htmlFor="email">Email</label> */}
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Email..."
                      value={user.email}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <p className={styles.errorText}>{errors.email}</p>
                    )}
                  </div>
                  <div className={styles.formGroup}>
                    {/* <label htmlFor="password">Mật khẩu</label> */}
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Mật khẩu..."
                      value={user.password}
                      onChange={handleChange}
                    />
                    {errors.password && (
                      <p className={styles.errorText}>{errors.password}</p>
                    )}
                  </div>
                  <div className={styles.formGroup}>
                    {/* <label htmlFor="password">Mật khẩu</label> */}
                    <input
                      type="resetPassword"
                      id="resetPassword"
                      name="resetPassword"
                      placeholder="Nhập lại mật khẩu..."
                      value={user.resetPassword}
                      onChange={handleChange}
                    />
                    {errors.resetPassword && (
                      <p className={styles.errorText}>{errors.resetPassword}</p>
                    )}
                  </div>
                  <div className={clsx("flex justify-between")}>
                    <div
                      onClick={handleForgotPassword}
                      className="p-[4px] text-[12px] font-[300] text-[#ffffff4d] cursor-pointer"
                    >
                      Quên mật khẩu?
                    </div>
                    {isLogin ? (
                      <div
                        onClick={toggleForm}
                        className="p-[4px] text-[12px] font-[300] text-[#ffffff4d] cursor-pointer"
                      >
                        Bạn chưa có tài khoản?
                      </div>
                    ) : (
                      <div
                        onClick={toggleForm}
                        className="p-[4px] text-[12px] font-[300] text-[#ffffff4d] cursor-pointer"
                      >
                        Bạn đã có tài khoản?
                      </div>
                    )}
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
          </>
        ) : (
          ////////////////////////////////////////////////////// reset password
          <>
            <h2>Khôi phục mật khẩu</h2>
            <form onSubmit={handleForgotPasswordSubmit}>
              <div className={styles.formGroup}>
                {/* <label htmlFor="email">Email hoặc tên người dùng</label> */}
                <input
                  type="text"
                  id="email"
                  name="email"
                  placeholder="Email..."
                />
              </div>
              {errors.email && (
                <p className={styles.errorText}>{errors.email}</p>
              )}
              <div className={clsx("flex justify-between")}>
                <div
                  onClick={handleBackToRegister}
                  className="p-[4px] text-[12px] font-[300] text-[#ffffff4d] cursor-pointer"
                >
                  Bạn chưa có tài khoản?
                </div>
                <div
                  onClick={handleBackToLogin}
                  className="p-[4px] text-[12px] font-[300] text-[#ffffff4d] cursor-pointer"
                >
                  Tiếp tục đăng nhập?
                </div>
              </div>
              <button type="submit" className={styles.loginBtn}>
                Tìm tài khoản
              </button>
            </form>
          </>
        )}
        <button type="button" className={styles.closeBtn} onClick={togglePopup}>
          <ReactSVG src="/close.svg" />
        </button>
      </div>
    </div>
  );
};

export default Login;
