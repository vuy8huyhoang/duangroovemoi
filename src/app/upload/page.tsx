"use client"
import React, { useState } from "react";
import axios from "@/lib/axios"; // Thay đường dẫn phù hợp với file cấu hình axios của bạn

const UploadForm = () => {
  const [file, setFile] = useState(null); // Lưu trữ file người dùng chọn
  const [message, setMessage] = useState(""); // Thông báo kết quả
  const [name, setName] = useState("")

  // Xử lý sự kiện khi người dùng chọn file
  const handleFileChange = (event:any) => {
    setFile(event.target.files[0]);
  };

  // Xử lý sự kiện submit form
  const handleSubmit = async (event:any) => {
    event.preventDefault();
    
    if (!file) {
      setMessage("Vui lòng chọn một file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response: any = await axios.post("/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Tải lên thành công: " + response);
      console.log(response);

      const artistResponse: any = await axios.post("/artist", {
            name, url_cover: response.result.url
      })
      
    } catch (error:any) {
      setMessage("Tải lên thất bại: " + error);
    }
  };

  return (
    <div>
      <h2>Upload Image</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
        <input type="text" value={name} onChange={(e)=>setName(e.target.value)} />
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadForm;