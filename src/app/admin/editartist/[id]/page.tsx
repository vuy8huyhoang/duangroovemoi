"use client";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
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
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        if (params.id) {
            axios
                .get(`/artist/${params.id}`)
                .then((response: any) => {
                    if (response?.result?.data) {
                        console.log(response);
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

    const removeVietnameseTones = (str: string) => {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D")
            .replace(/[^a-zA-Z0-9\s]/g, "")
            .replace(/\s+/g, "-")
            .toLowerCase();
    };

    const validationSchema = yup.object().shape({
        name: yup.string().required("Tên nghệ sĩ là bắt buộc."),
        file: yup
            .mixed()
            .nullable() 
            .test(
                "fileFormat",
                "Định dạng file không hợp lệ. Chỉ chấp nhận .jpeg, .png, .jpg, .gif, .webp.",
                (value) =>
                    value === null || 
                    (value instanceof File &&
                        ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"].includes(value.type))
            )
            .test(
                "fileSize",
                "Kích thước ảnh không được vượt quá 10MB.",
                (value) =>
                    value === null || 
                    (value instanceof File && value.size <= 10 * 1024 * 1024) 
            ),
        is_show: yup
            .number()
            .oneOf([0, 1], "Trạng thái hiển thị không hợp lệ.")
            .required("Trạng thái hiển thị là bắt buộc."),
    });




    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        if (!artist) return;

        setLoading(true);
        setMessage("");

        try {
            let imageUrl = artist.url_cover; 

            if (values.file) {
                const formData = new FormData();
                formData.append("file", values.file);

                const uploadResponse: any = await axios.post("/upload-image", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                if (uploadResponse?.result?.url) {
                    imageUrl = uploadResponse.result.url; 
                } else {
                    setMessage("Lỗi khi upload ảnh mới.");
                    setSubmitting(false);
                    setLoading(false);
                    return;
                }
            }

            const slug = removeVietnameseTones(values.name); 
            const artistData = { ...artist, name: values.name, slug, url_cover: imageUrl, is_show: values.is_show };

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
            setMessage("Đã xảy ra lỗi khi gửi dữ liệu.");
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };



    if (loading) return <div>Đang tải...</div>;
    if (!artist) return <div>Không tìm thấy nghệ sĩ.</div>;

    return (
        <div className={styles.container}>
            <h2>Sửa thông tin nghệ sĩ</h2>
            <Formik
                initialValues={{
                    name: artist.name,
                    file: null,
                    is_show: artist.is_show,
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ setFieldValue, values, isSubmitting }) => (
                    <Form className={styles.formGroup}>
                        <div>
                            <Field
                                type="text"
                                name="name"
                                placeholder="Tên nghệ sĩ"
                                className={styles.inputField}
                            />
                            <ErrorMessage name="name" component="div" className={styles.error} />
                        </div>

                        <div>
                            <input
                                id="file-upload"
                                type="file"
                                style={{ display: "none" }}
                                onChange={(e) => {
                                    const file = e.target.files ? e.target.files[0] : null;
                                    setFieldValue("file", file);
                                    if (file) {
                                        setPreviewUrl(URL.createObjectURL(file)); 
                                    } else {
                                        setPreviewUrl(artist.url_cover); 
                                    }
                                }}
                            />

                            {previewUrl && (
                                <div className={styles.preview}>
                                    <img src={previewUrl} alt="Xem trước hình ảnh" />
                                </div>
                            )}
                            <label htmlFor="file-upload" className={styles.customFileUpload}>
                                Chọn ảnh
                            </label>
                            <ErrorMessage name="file" component="div" className={styles.error} />
                        </div>

                        <div className={styles.visibilityRadioButtons}>
                                <label>Hiện</label>
                                <Field
                                    type="radio"
                                    name="is_show"
                                    value="1"
                                    checked={values.is_show === 1}
                                    onChange={() => setFieldValue("is_show", 1)}
                                />
                            
                           
                                <label>Ẩn</label>
                                <Field
                                    type="radio"
                                    name="is_show"
                                    value="0"
                                    checked={values.is_show === 0}
                                    onChange={() => setFieldValue("is_show", 0)}
                                />
                        </div>

                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Đang gửi..." : "Cập nhật nghệ sĩ"}
                        </button>
                        {message && <p className={styles.message}>{message}</p>}
                    </Form>
                )}
            </Formik>
        </div>
    );
}
