"use client";
import { useState } from "react";
import axios from "@/lib/axios";
import { v4 as uuidv4 } from "uuid";
import styles from "./AddUser.module.scss";

interface User {
    id_user: string;
    fullname: string;
    email: string;
    password: string;
    role: "user" | "admin";
    url_avatar?: string;
    is_banned: 0 | 1;
}

export default function AddUser() {
    const [user, setUser] = useState<User>({
        id_user: uuidv4(),
        fullname: "",
        email: "",
        password: "",  // Thêm trường mật khẩu
        role: "user",
        url_avatar: "",
        is_banned: 0,  // Mặc định là hoạt động (0)
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [message, setMessage] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: name === "is_banned" ? Number(value) : value, // Chuyển đổi `is_banned` thành số
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            const fileUrl = URL.createObjectURL(e.target.files[0]);
            setPreviewUrl(fileUrl);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Kiểm tra dữ liệu đầu vào
        if (!user.fullname || !user.email || user.password.length < 6) {
            setMessage("Vui lòng nhập đủ thông tin và mật khẩu hợp lệ.");
            return;
        }

        setLoading(true);

        try {
            let avatarUrl = "";
            if (file) {
                const formData = new FormData();
                formData.append("file", file);

                const uploadResponse: any = await axios.post("/upload-image", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                avatarUrl = uploadResponse?.result?.url || "";
            }

            // Gửi yêu cầu thêm người dùng
            const response: any = await axios.post("/user", {
                ...user,
                url_avatar: avatarUrl,
            });

            if (response.status === 200 || response.status === 201) {
                alert("Thêm người dùng thành công!");
                window.location.href = "/admin/adminuser";
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
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={user.email}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Mật khẩu"
                    value={user.password}
                    onChange={handleChange}
                />
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
                <input id="file-upload" type="file" style={{ display: "none" }} onChange={handleFileChange} />
                {previewUrl && (
                    <div className={styles.preview}>
                        <img src={previewUrl} alt="Xem trước hình ảnh" />
                    </div>
                )}
                <button onClick={handleSubmit} disabled={loading}>
                    {loading ? "Đang gửi..." : "Thêm người dùng"}
                </button>
                {message && <div className={styles.message}>{message}</div>}
            </div>
        </div>
    );
}
