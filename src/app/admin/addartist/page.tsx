"use client";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { v4 as uuidv4 } from 'uuid';
import styles from "./AddArtist.module.scss";

interface Artist {
    id_artist: string;
    name: string;
    slug: string | null;
    url_cover: string;
    created_at: string;
    last_update: string;
    is_show: number;
    followers: number;
}

export default function AddArtist() {
    const [artist, setArtist] = useState<Artist>({
        id_artist: uuidv4(),
        name: "",
        slug: null,
        url_cover: "",
        created_at: new Date().toISOString(),
        last_update: new Date().toISOString(),
        is_show: 1,
        followers: 0,
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [message, setMessage] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setArtist({ ...artist, [name]: value });
    };

    const removeVietnameseTones = (str: string) => {
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .replace(/[^a-zA-Z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .toLowerCase();
    };

    useEffect(() => {
        // Update slug whenever the name changes
        if (artist.name) {
            setArtist(prev => ({
                ...prev,
                slug: removeVietnameseTones(artist.name),
            }));
        }
    }, [artist.name]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);

            const fileUrl = URL.createObjectURL(e.target.files[0]);
            setPreviewUrl(fileUrl);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!file) {
            setMessage("Vui lòng chọn một file.");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response: any = await axios.post("/upload-image", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response?.result?.url) {
                const imageUrl = response.result.url;
                setMessage("Tải lên thành công: " + imageUrl);

                const artistResponse: any = await axios.post("/artist", {
                    ...artist,
                    url_cover: imageUrl,
                });

                if (artistResponse.status === 200 || artistResponse.status === 201) {
                    alert("Nghệ sĩ đã được thêm thành công!");
                    window.location.href = "/admin/adminartist";
                } else {
                    alert("Thêm nghệ sĩ không thành công.");
                }
            } else {
                setMessage("Dữ liệu trả về không đúng định dạng.");
            }
        } catch (error: any) {
            console.error("Lỗi khi gửi dữ liệu nghệ sĩ:", error);
            setMessage("Đã xảy ra lỗi khi gửi dữ liệu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h2>Thêm mới nghệ sĩ</h2>
            <div className={styles.formGroup}>
                <input
                    type="text"
                    name="name"
                    placeholder="Tên nghệ sĩ"
                    value={artist.name}
                    onChange={handleChange}
                />
                {previewUrl && (
                    <div className={styles.preview}>
                        <img src={previewUrl} alt="Xem trước hình ảnh" />
                    </div>
                )}
                <label htmlFor="file-upload" className={styles.customFileUpload}>
                    Chọn ảnh
                </label>
                <input
                    id="file-upload"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
                <button onClick={handleSubmit} disabled={loading}>
                    {loading ? "Đang gửi..." : "Thêm nghệ sĩ"}
                </button>
                {message && <div className={styles.message}>{message}</div>}
            </div>
        </div>
    );
}
