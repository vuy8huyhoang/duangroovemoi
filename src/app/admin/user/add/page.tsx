"use client";
import { useState } from "react";
import axios from "@/lib/axios";
import styles from "./AddUser.module.scss";

interface User {
  fullname: string;
  email: string;
  password: string;
  role: "user" | "admin";
  url_avatar?: string;
  is_banned: 0 | 1;
}

export default function AddUser() {
  const [user, setUser] = useState<User>({
    fullname: "",
    email: "",
    password: "", // Thêm trường mật khẩu
    role: "user",
    url_avatar: "",
    is_banned: 0, // Mặc định là hoạt động (0)
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [errorMessages, setErrorMessages] = useState({
    fullname: "",
    email: "",
    password: "",
    file: "", // Thêm trường file để xử lý lỗi file
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: name === "is_banned" ? Number(value) : value, // Chuyển đổi `is_banned` thành số
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Kiểm tra loại tệp hình ảnh
      const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];

      // Kiểm tra kích thước tệp (10MB = 10 * 1024 * 1024 = 10485760 bytes)
      const MAX_FILE_SIZE = 10485760; // 10MB

      if (!validImageTypes.includes(selectedFile.type)) {
        setErrorMessages({
          ...errorMessages,
          file: "Định dạng hình ảnh không hợp lệ. Chỉ hỗ trợ JPG, JPEG, PNG.", // Hiển thị lỗi cho trường file
        });
        setFile(null); // Reset tệp đã chọn
        setPreviewUrl(null); // Reset ảnh xem trước
        return;
      }

      // Kiểm tra kích thước tệp
      if (selectedFile.size > MAX_FILE_SIZE) {
        setErrorMessages({
          ...errorMessages,
          file: "Kích thước hình ảnh vượt quá 10MB.", // Hiển thị lỗi khi kích thước vượt quá 10MB
        });
        setFile(null); // Reset tệp đã chọn
        setPreviewUrl(null); // Reset ảnh xem trước
        return;
      }

      // Nếu tệp hợp lệ, thiết lập file và ảnh xem trước
      setFile(selectedFile);
      const fileUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(fileUrl);

      // Xóa thông báo lỗi nếu tệp hợp lệ
      setErrorMessages({
        ...errorMessages,
        file: "", // Xóa lỗi nếu tệp hợp lệ
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Kiểm tra dữ liệu đầu vào
    let isValid = true;
    const newErrorMessages = {
      fullname: "",
      email: "",
      password: "",
      file: "",
    };

    if (!user.fullname) {
      newErrorMessages.fullname = "Vui lòng nhập họ và tên.";
      isValid = false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!user.email) {
      newErrorMessages.email = "Vui lòng nhập email.";
      isValid = false;
    } else if (!emailRegex.test(user.email)) {
      newErrorMessages.email = "Vui lòng nhập email hợp lệ.";
      isValid = false;
    }

    if (user.password.length < 6) {
      newErrorMessages.password = "Mật khẩu phải có ít nhất 6 ký tự.";
      isValid = false;
    }

    setErrorMessages({
      ...errorMessages,
      ...newErrorMessages,
    });

    if (!isValid) {
      return;
    }

    setLoading(true);

    try {
      let avatarUrl = "";
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadResponse: any = await axios.post(
          "/upload-image",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        avatarUrl = uploadResponse?.result?.url || "";
      }

      // Gửi yêu cầu thêm người dùng
      const response: any = await axios.post("/user", {
        fullname: user.fullname,
        email: user.email,
        password: user.password,
        role: user.role,
        url_avatar: avatarUrl,
        is_banned: user.is_banned,
      });

      if (response.status === 200 || response.status === 201) {
        alert("Thêm người dùng thành công!");
        window.location.href = "/admin/user";
      } else {
        alert("Thêm người dùng không thành công.");
      }
    } catch (error) {
      console.error("Lỗi khi thêm người dùng:", error);
      setMessage("Có lỗi xảy ra khi gửi dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Thêm mới người dùng</h2>
      <div className={styles.formGroup}>
        <input
          type="text"
          name="fullname"
          placeholder="Tên người dùng"
          value={user.fullname}
          onChange={handleChange}
        />
        {errorMessages.fullname && (
          <div className={styles.errorMessage}>{errorMessages.fullname}</div>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={user.email}
          onChange={handleChange}
        />
        {errorMessages.email && (
          <div className={styles.errorMessage}>{errorMessages.email}</div>
        )}

        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={user.password}
          onChange={handleChange}
        />
        {errorMessages.password && (
          <div className={styles.errorMessage}>{errorMessages.password}</div>
        )}

        <select name="role" value={user.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <select name="is_banned" value={user.is_banned} onChange={handleChange}>
          <option value={0}>Hoạt động</option>
          <option value={1}>Bị khóa</option>
        </select>
        <label htmlFor="file-upload" className={styles.customFileUpload}>
          Chọn ảnh đại diện
        </label>
        <input
          id="file-upload"
          type="file"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        {previewUrl && (
          <div className={styles.preview}>
            <img src={previewUrl} alt="Xem trước hình ảnh" />
          </div>
        )}
        {errorMessages.file && (
          <div className={styles.errorMessage}>{errorMessages.file}</div>
        )}

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Đang gửi..." : "Thêm người dùng"}
        </button>
        {message && <div className={styles.message}>{message}</div>}
      </div>
    </div>
  );
}
