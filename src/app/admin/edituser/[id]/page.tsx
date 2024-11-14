"use client";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import styles from "../EditUser.module.scss";

interface User {
    id_user: string;
    fullname: string;
    email: string;
    role: 'user' | 'admin';
    url_avatar?: string;
    is_banned: 0 | 1;
}

export default function EditUser({ params }: { params: { id: string } }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        setLoading(true);  // Đặt lại loading khi thay đổi ID
        setUser(null);     // Đặt lại user trước khi lấy dữ liệu mới
        if (params.id) {console.log(params.id);
        
            axios
                .get(`/user/${params.id}`)
                .then((response: any) => {
                    if (response?.result?.data) {
                        setUser(response.result.data);
                        setPreviewUrl(response.result.data.url_avatar || null);
                        console.log(response);
                        
                    } else {
                        setUser(null);
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
    }, [params.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (user) {
            setUser({ ...user, [name]: value });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            const fileUrl = URL.createObjectURL(e.target.files[0]);
            setPreviewUrl(fileUrl);
        }
    };

    const handleSubmit = async () => {
        if (!user) return;
        setLoading(true);

        try {
            let imageUrl = user.url_avatar;

            if (file) {
                const formData = new FormData();
                formData.append("file", file);

                const uploadResponse: any = await axios.post("/upload-image", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                if (uploadResponse?.result?.url) {
                    imageUrl = uploadResponse.result.url;
                } else {
                    setMessage("Invalid response format from image upload.");
                    return;
                }
            }

            const userData = { ...user, url_avatar: imageUrl };

            const response:any = await axios.patch(`/user/${user}`, userData, {
                headers: { "Content-Type": "application/json" },
            });

            if (response.status === 200 || response.status === 201) {
                alert("User updated successfully!");
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
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />

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
