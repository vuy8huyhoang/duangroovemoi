"use client";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import styles from "../../../form.module.scss";

interface Composer {
  id_composer: string;
  name: string;
  created_at: string;
  last_update: string;
}

export default function EditComposer({ params }: { params: { id: string } }) {
  const [composer, setComposer] = useState<Composer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (params.id) {
      axios
        .get(`/composer/${params.id}`)
        .then((response: any) => {
          // console.log("Full API response for composer:", response);
          if (response?.result?.data) {
            setComposer(response.result.data);
          } else {
            console.error("Không tìm thấy nhạc sĩ:", response);
            setComposer(null);
          }
        })
        .catch((error: any) => {
          console.error("Lỗi fetch nhạc sĩ:", error);
          setComposer(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [params.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (composer) {
      setComposer({ ...composer, [name]: value });
    }
  };

  const handleSubmit = async () => {
    if (!composer) return;

    setLoading(true);

    const slug = composer.name.toLowerCase().replace(/\s+/g, "-");

    const composerData = { ...composer };
    // console.log(composerData);

    try {
      // console.log(`/composer/${params.id}`, { name: composer.name });
      const response = await axios.patch(`/composer/${params.id}`, {
        name: composerData.name,
      });

      if (response.status === 200 || response.status === 204) {
        alert("Nhạc sĩ đã được cập nhật thành công!");
        window.location.href = "/admin/composer";
      } else {
        alert("Cập nhật nhạc sĩ không thành công.");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật dữ liệu nhạc sĩ:", error);
      alert("Đã xảy ra lỗi khi gửi dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (!composer) return <div>Không tìm thấy nhạc sĩ.</div>;

  return (
    <div className={styles.container}>
      <h2>Sửa thông tin nhạc sĩ</h2>
      <div className={styles.formGroup}>
        <input
          type="text"
          name="name"
          placeholder="Tên nhạc sĩ"
          value={composer.name}
          onChange={handleChange}
        />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Đang gửi..." : "Cập nhật nhạc sĩ"}
        </button>
      </div>
    </div>
  );
}
