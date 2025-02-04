"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import styles from "../../../form.module.scss";

interface Type {
  id_type: string;
  name: string;
  slug: string;
  is_show: number;
}

export default function EditType({ params }: { params: { id: string } }) {
  const [type, setType] = useState<Type>({
    id_type: "",
    name: "",
    slug: "",
    is_show: 1,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>(""); // State để lưu lỗi

  useEffect(() => {
    const fetchType = async () => {
      try {
        const response: any = await axios.get(`/type/${params.id}`);
        if (response?.result?.data) {
          setType(response.result.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu loại:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchType();
  }, [params.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setType({ ...type, [name]: value });
  };

  const handleSubmit = async () => {
    // Kiểm tra nếu tên thể loại trống
    if (!type.name.trim()) {
      setError("Vui lòng nhập tên thể loại."); // Hiển thị lỗi nếu tên thể loại trống
      return;
    }

    setLoading(true);
    const slug = type.name.toLowerCase().replace(/\s+/g, "-");
    const updatedType = { ...type, slug };

    // console.log("ID :", type.id_type); // Log id_type
    // console.log("Data :", updatedType);

    try {
      const response: any = await axios.patch(
        `/type/${params.id}`,
        updatedType,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      //   console.log("Full Response:", response); // Log toàn bộ response
      //   console.log("Response Data:", response.data); // Log dữ liệu
      //   console.log("Response Result:", response.result); // Log kết quả cụ thể

      if (response.status === 200 || response.status === 201) {
        alert("Thể loại đã được cập nhật thành công!");
        window.location.href = "/admin/type";
      } else {
        alert("Cập nhật thể loại không thành công.");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật loại:", error);
      alert("Đã xảy ra lỗi khi cập nhật dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Đang tải...</p>;

  return (
    <div className={styles.container}>
      <h2>Chỉnh sửa thể loại</h2>
      <div className={styles.formGroup}>
        <div>
          <input
            type="text"
            name="name"
            placeholder="Tên thể loại"
            value={type.name}
            onChange={handleChange}
            className={styles.input}
          />
          {error && <p className={styles.errorMessage}>{error}</p>}{" "}
        </div>
        {/* Hiển thị thông báo lỗi */}
        {/* <input
          type="text"
          name="slug"
          placeholder="Slug (tự động tạo nếu để trống)"
          value={type.slug}
          onChange={handleChange}
        /> */}
        <select
          name="is_show"
          value={type.is_show}
          onChange={(e) =>
            setType({ ...type, is_show: parseInt(e.target.value) })
          }
        >
          <option value={1}>Hiển thị</option>
          <option value={0}>Ẩn</option>
        </select>
      </div>

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Đang cập nhật..." : "Cập nhật thể loại"}
      </button>
    </div>
  );
}
