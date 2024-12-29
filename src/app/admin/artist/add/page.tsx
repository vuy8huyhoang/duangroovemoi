"use client";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { v4 as uuidv4 } from "uuid";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
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
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [message, setMessage] = useState<string>("");

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
            .required("Ảnh bìa là bắt buộc.")
            .test("fileSize", "Kích thước ảnh không được vượt quá 10MB.", (value) =>
                value instanceof File ? value.size <= 10 * 1024 * 1024 : false
            )
            .test(
                "fileFormat",
                "Định dạng file không hợp lệ. Chỉ chấp nhận .jpeg, .png, .jpg, .gif, .webp.",
                (value) =>
                    value instanceof File &&
                    ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"].includes(
                        value.type
                    )
            ),
        is_show: yup
            .number()
            .oneOf([0, 1], "Trạng thái hiển thị không hợp lệ.")
            .required("Trạng thái hiển thị là bắt buộc."),
    });

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        setMessage("");
        const formData = new FormData();
        formData.append("file", values.file);

        try {
            const response: any = await axios.post("/upload-image", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response?.result?.url) {
                const imageUrl = response.result.url;

                const artistData = {
                    id_artist: uuidv4(),
                    name: values.name,
                    slug: removeVietnameseTones(values.name),
                    url_cover: imageUrl,
                    created_at: new Date().toISOString(),
                    last_update: new Date().toISOString(),
                    is_show: values.is_show,
                    followers: 0,
                };

                const artistResponse: any = await axios.post("/artist", artistData);

                if (artistResponse.status === 200 || artistResponse.status === 201) {
                    alert("Nghệ sĩ đã được thêm thành công!");
                    window.location.href = "/admin/adminartist";
                } else {
                    setMessage("Thêm nghệ sĩ không thành công.");
                }
            } else {
                setMessage("Dữ liệu trả về không đúng định dạng.");
            }
        } catch (error: any) {
            console.error("Lỗi khi gửi dữ liệu nghệ sĩ:", error);
            setMessage("Đã xảy ra lỗi khi gửi dữ liệu.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <h2>Thêm mới nghệ sĩ</h2>
            <Formik
                initialValues={{
                    name: "",
                    file: null,
                    is_show: 1,
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
                                    setFieldValue("file", file); // Set file in Formik
                                    if (file) {
                                        setPreviewUrl(URL.createObjectURL(file)); // Show preview
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
                            {isSubmitting ? "Đang gửi..." : "Thêm nghệ sĩ"}
                        </button>
                        {message && <div className={styles.message}>{message}</div>}
                    </Form>
                )}
            </Formik>
        </div>
    );
}
