"use client";
import { useState, useEffect } from "react";
import axios from "@/lib/axios"; // Đảm bảo rằng bạn đã cấu hình axios đúng
import { v4 as uuidv4 } from "uuid";
import styles from "./AddUser.module.scss"; // Đảm bảo rằng CSS đúng

interface User {
    id_user: string;
    fullname: string;
    email: string;
    role: "user" | "admin";
    url_avatar?: string;
    is_banned: 'active' | 'banned';
}

export default function AddUser() {
    const [user, setUser] = useState<User>({
        id_user: uuidv4(),
        fullname: "",
        email: "",
        role: "user",
        url_avatar: "",
        is_banned: 'active',
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [message, setMessage] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
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

        if (!user.fullname || !user.email) {
            setMessage("Vui lòng điền đầy đủ thông tin.");
            return;
        }

        if (file) {
            setLoading(true);
            const formData = new FormData();
            formData.append("file", file);

            try {
                // Upload ảnh đại diện
                const uploadResponse:any = await axios.post("/upload-image", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                if (uploadResponse?.result?.url) {
                    const avatarUrl = uploadResponse.result.url;

                    // Gửi yêu cầu thêm người dùng
                    const response:any = await axios.post("/user", {
                        ...user,
                        url_avatar: avatarUrl,
                    });

                    if (response.status === 200 || response.status === 201) {
                        alert("Người dùng đã được thêm thành công!");
                        window.location.href = "/admin/adminuser"; // Điều hướng đến trang danh sách người dùng
                    } else {
                        alert("Thêm người dùng không thành công.");
                    }
                } else {
                    setMessage("Lỗi tải lên ảnh.");
                }
            } catch (error) {
                console.error("Lỗi khi gửi dữ liệu người dùng:", error);
                setMessage("Đã xảy ra lỗi khi gửi dữ liệu.");
            } finally {
                setLoading(false);
            }
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
                <select name="role" value={user.role} onChange={handleChange}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                
                <select name="is_banned" value={user.is_banned} onChange={handleChange}>
                    <option value="active">Hoạt động</option>
                    <option value="banned">Bị khóa</option>
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
                
                <button onClick={handleSubmit} disabled={loading}>
                    {loading ? "Đang gửi..." : "Thêm người dùng"}
                </button>
                {message && <div className={styles.message}>{message}</div>}
            </div>
        </div>
    );
}
