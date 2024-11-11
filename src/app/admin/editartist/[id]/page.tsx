"use client";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import styles from "../EditArtist.module.scss";

interface Artist {
    id_artist: string;
    name: string;
    slug: string | null;
    url_cover: string | null;
    created_at: string;
    last_update: string;
    is_show: number;
    followers: number;
}

export default function EditArtist({ params }: { params: { id: string } }) {
    const [artist, setArtist] = useState<Artist | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        if (params.id) {
            axios
                .get(`/artist/${params.id}`)
                .then((response: any) => {
                    console.log("Full API response for artist:", response);
                    if (response?.result?.data) {
                        setArtist(response.result.data);
                        setPreviewUrl(response.result.data.url_cover || null);
                    } else {
                        console.error("Không tìm thấy nghệ sĩ:", response);
                        setArtist(null);
                    }
                })
                .catch((error: any) => {
                    console.error("Lỗi fetch nghệ sĩ:", error);
                    setArtist(null);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [params.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (artist) {
            setArtist({ ...artist, [name]: value });
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
        if (!artist) return;

        setLoading(true);

        try {
            let imageUrl = artist.url_cover;

            // If a new file is selected, upload it first
            if (file) {
                const formData = new FormData();
                formData.append("file", file);

                const uploadResponse: any = await axios.post("/upload-image", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                if (uploadResponse?.result?.url) {
                    imageUrl = uploadResponse.result.url;
                } else {
                    setMessage("Dữ liệu trả về không đúng định dạng.");
                    return;
                }
            }

            const slug = artist.name.toLowerCase().replace(/\s+/g, '-');
            const artistData = { ...artist, slug, url_cover: imageUrl };

            const response = await axios.patch(`/artist/${artist.id_artist}`, artistData, {
                headers: { "Content-Type": "application/json" },
            });

            if (response.status === 200 || response.status === 204) {
                alert("Nghệ sĩ đã được cập nhật thành công!");
                window.location.href = "/admin/adminartist";
            } else {
                alert("Cập nhật nghệ sĩ không thành công.");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật dữ liệu nghệ sĩ:", error);
            alert("Đã xảy ra lỗi khi gửi dữ liệu.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Đang tải...</div>;
    if (!artist) return <div>Không tìm thấy nghệ sĩ.</div>;

    return (
        <div className={styles.container}>
            <h2>Sửa thông tin nghệ sĩ</h2>
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
                    {loading ? "Đang gửi..." : "Cập nhật nghệ sĩ"}
                </button>
            </div>
            {message && <p>{message}</p>}
        </div>
    );
}
