"use client";
import { useState } from "react";
import axios from "@/lib/axios";
import styles from "../../form.module.scss";

interface Type {
  id_type: string;
  name: string;
  slug: string;

  is_show: number;
}

export default function AddType() {
  const [type, setType] = useState<Type>({
    id_type: "",
    name: "",
    slug: "",

    is_show: 1,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setType({ ...type, [name]: value });
  };

  const handleSubmit = async () => {
    // Kiểm tra nếu tên thể loại trống
    if (!type.name.trim()) {
      setError("Vui lòng nhập tên thể loại.");
      return; // Không gửi form nếu tên trống
    }

    setLoading(true);
    const slug = type.name.toLowerCase().replace(/\s+/g, "-");
    const typeData = { ...type, slug };

    try {
      const response: any = await axios.post("/type", typeData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200 || response.status === 201) {
        alert("Thể loại đã được thêm thành công!");
        window.location.href = "/admin/type";
      } else {
        alert("Thêm thể loại không thành công.");
      }
    } catch (error) {
      console.error("Error submitting type data:", error);
      alert("Đã xảy ra lỗi khi gửi dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Thêm mới thể loại</h2>
      <div className={styles.formGroup}>
        <div>
          <input
            type="text"
            name="name"
            placeholder="Tên thể loại"
            value={type.name}
            onChange={handleChange}
            className={styles.input} // Đảm bảo có lớp CSS cho input
          />
          {error && <p className={styles.errorMessage}>{error}</p>}{" "}
        </div>
        {/* Hiển thị thông báo lỗi nếu có */}
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
        {loading ? "Đang gửi..." : "Thêm thể loại"}
      </button>
    </div>
  );
}
