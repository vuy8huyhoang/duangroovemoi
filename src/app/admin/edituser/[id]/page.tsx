"use client";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import styles from "../EditUser.module.scss";

interface User {
  id_user: string;
  fullname: string;
  email: string;
  role: "user" | "admin";
  url_avatar?: string;
  is_banned: 0 | 1;
}

export default function EditUser({ params }: { params: { id: string } }) {
  const { id } = params;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [errorMessages, setErrorMessages] = useState({
    fullname: "",
    email: "",
    password: "",
    file: "", // Thêm trường file để xử lý lỗi file
  });

  useEffect(() => {
    if (id) {
      // console.log("Fetching user with ID:",id);

      axios
        .get(`/user/${id}`)
        .then((response: any) => {
          if (response?.result?.data) {
            // console.log("user data 1:", response.result);

            setUser(response.result.data);
            setPreviewUrl(response.result.data.url_avatar || null);
          }
        })
        .catch((error: any) => {
          console.error("Error fetching user:", error);
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);
  //   console.log("người dùng:", user);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (user) {
      setUser({ ...user, [name]: value });
    }
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

  const handleSubmit = async () => {
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

    // if (user.password.length < 6) {
    //     newErrorMessages.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    //     isValid = false;
    // };

    setErrorMessages({
      ...errorMessages,
      ...newErrorMessages,
    });

    if (!isValid) {
      return;
    }

    if (!user) return;
    setLoading(true);

    try {
      let imageUrl = user.url_avatar;

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

        if (uploadResponse?.result?.url) {
          imageUrl = uploadResponse.result.url;
        } else {
          setMessage("Invalid response format from image upload.");
          return;
        }
      }

      const userData = { ...user, url_avatar: imageUrl };

      const response: any = await axios.patch(
        `/user/${user.id_user}`,
        userData,
        {
          // headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert("Cập nhật người dùng thành công!");
        window.location.href = "/admin/adminuser";
      } else {
        alert("User update failed.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error submitting data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found.</div>;

  return (
    <div className={styles.container}>
      <h2>Chỉnh sửa thông tin người dùng</h2>
      <div className={styles.formGroup}>
        <input
          type="text"
          name="fullname"
          placeholder="Full Name"
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

        <select name="role" value={user.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        {previewUrl && (
          <div className={styles.preview}>
            <img src={previewUrl} alt="Preview avatar" />
          </div>
        )}
        <label htmlFor="file-upload" className={styles.customFileUpload}>
          Chọn hình đại diện
        </label>
        <input
          id="file-upload"
          type="file"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        {errorMessages.file && (
          <div className={styles.errorMessage}>{errorMessages.file}</div>
        )}

        <div className={styles.visibilityRadioButtons}>
          <div>
            <label>Hoạt động</label>
            <input
              type="radio"
              name="is_banned"
              value="0"
              checked={!user.is_banned}
              onChange={() => setUser({ ...user, is_banned: 0 })}
            />
          </div>
          <div>
            <label>Bị khóa</label>
            <input
              type="radio"
              name="is_banned"
              value="1"
              checked={!!user.is_banned}
              onChange={() => setUser({ ...user, is_banned: 1 })}
            />
          </div>
        </div>

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting..." : "Cập Nhật User"}
        </button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
}
