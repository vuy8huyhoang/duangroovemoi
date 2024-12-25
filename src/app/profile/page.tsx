"use client";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import style from "./profile.module.scss";
import clsx from "clsx";

interface Profile {
  birthday: string;
  country: string;
  created_at: string;
  email: string;
  fullname: string;
  gender: string;
  last_update: string;
  phone: string;
  role: string;
  url_avatar: string;
}

const fakeApiFetchCountries = () => {
  return new Promise<string[]>((resolve) => {
    setTimeout(() => {
      resolve([
        "Vietnam",
        "USA",
        "UK",
        "Canada",
        "Australia",
        "Germany",
        "France",
        "Japan",
        "India",
        "Brazil",
        // Add more countries as needed
      ]);
    }, 1000); // Simulate a 1 second delay
  });
};

export default function Profile() {
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [file, setFile] = useState(null); // Lưu trữ file người dùng chọn
  const [message, setMessage] = useState(""); // Thông báo kết quả
  const [imagePreview, setImagePreview] = useState<string | null>(null); // Add state for image preview
  const [countries, setCountries] = useState<string[]>([]);

  useEffect(() => {
    axios
      .get("profile")
      .then((response: any) => {
        // console.log(response);

        if (response && response.result.data) {
          setProfileData(response.result.data);
        } else {
          console.error("Response data is undefined or null", response);
        }
      })
      .catch((error: any) => {
        console.error("Error fetching profile details", error);
      })
      .finally(() => {
        setLoading(false);
      });

    // Fetch countries from the fake API
    fakeApiFetchCountries().then((data) => {
      setCountries(data);
    });
  }, []);

  const handleEditClick = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue);
  };
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  // Xử lý sự kiện khi người dùng chọn file
  const handleFileChange = (event: any) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const fileURL = URL.createObjectURL(selectedFile); // Create a URL for the selected file
      setImagePreview(fileURL); // Set the image preview state
    }
  };
  // Xử lý sự kiện submit form
  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!file) {
      alert("Chưa có ảnh");
      return;
    }

    // Validate file type and size (example: only allow images under 2MB)
    if (
      !["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
        file.type
      ) ||
      file.size > 10 * 1024 * 1024
    ) {
      alert("Vui lòng chọn một tệp hình ảnh hợp lệ dưới 10MB.");
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
      alert("Tải ảnh lên thành công");
      //   console.log(response);

      const profileResponse: any = await axios.patch("/update-infor", {
        url_avatar: response.result.url,
      });
    } catch (error: any) {
      alert("Tải ảnh lên thất bại: " + error);
    }
  };

  const handleSaveClick = () => {
    if (profileData && editingField) {
      // Validate updated profile data
      if (editingField === "phone") {
        if (!/^0\d{9}$/.test(editValue)) {
          alert("Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số.");
          return;
        }
      }
      if (editingField === "email" && !/\S+@\S+\.\S+/.test(editValue)) {
        alert("Email không hợp lệ.");
        return;
      }

      const updatedProfile = { ...profileData, [editingField]: editValue };
      setProfileData(updatedProfile);
      setEditingField(null);

      axios
        .patch("/update-infor", updatedProfile)
        .then((response) => {
          // console.log('Profile updated successfully', response);
          // console.log(updatedProfile);
        })
        .catch((error) => {
          console.error("Error updating profile", error);
        });
    }
  };

  if (loading) return <div className={style.loader}>Đang tải...</div>;

  return (
    <div
      className={clsx(style.profileContainer, "shadow rounded-[10px]")}
      style={{ backgroundColor: "rgba(0, 0, 0, .1" }}
    >
      <div className={clsx(style.profileDetails, "grid grid-cols-12 gap-4")}>
        <div className={clsx(style.profileimg, "col-span-2")}>
          <form onSubmit={handleSubmit}>
            <label htmlFor="file-upload">
              {profileData?.url_avatar || imagePreview ? (
                <img
                  src={imagePreview || profileData?.url_avatar} // Use imagePreview if available
                  alt="Profile Avatar"
                  style={{ cursor: "pointer" }} // Change cursor to pointer for better UX
                />
              ) : (
                <img src="/Setting.svg" alt="" />
              )}
            </label>
            <input
              type="file"
              id="file-upload"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <div>
              <button type="submit">Lưu ảnh</button>
              {message && <p className={style.message}>{message}</p>}
            </div>
          </form>
        </div>
        {/* <input type="file" multiple /> */}
        <div
          className={clsx(style.info, "col-span-10 grid grid-cols-12 gap-4")}
        >
          <div className={clsx(style.infoItem, "col-span-6")}>
            <p>
              <strong>Email:</strong> {profileData?.email}
            </p>
          </div>

          {/* Name */}
          <div className={clsx(style.infoItem, "col-span-6")}>
            <p>
              <strong>Tên đầy đủ: </strong>
              {editingField === "fullname" ? (
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
              ) : (
                profileData?.fullname
              )}
            </p>
            {editingField === "fullname" ? (
              <button
                className={clsx(
                  style.editButton,
                  "bg-yellow-600 hover:bg-yellow-500 col-span-6"
                )}
                onClick={handleSaveClick}
              >
                Lưu
              </button>
            ) : (
              <button
                className={clsx(
                  style.editButton,
                  "bg-yellow-600 hover:bg-yellow-500 col-span-6"
                )}
                onClick={() =>
                  handleEditClick("fullname", profileData?.fullname || "")
                }
              >
                Sửa thông tin
              </button>
            )}
          </div>

          {/* Phone Input */}
          <div className={clsx(style.infoItem, "col-span-6")}>
            <p>
              <strong>SĐT: </strong>
              {editingField === "phone" ? (
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
              ) : (
                profileData?.phone
              )}
            </p>
            {editingField === "phone" ? (
              <button
                className={clsx(
                  style.editButton,
                  "bg-yellow-600 hover:bg-yellow-500 col-span-6"
                )}
                onClick={handleSaveClick}
              >
                Lưu
              </button>
            ) : (
              <button
                className={clsx(
                  style.editButton,
                  "bg-yellow-600 hover:bg-yellow-500 col-span-6"
                )}
                onClick={() =>
                  handleEditClick("phone", profileData?.phone || "")
                }
              >
                Sửa thông tin
              </button>
            )}
          </div>

          {/* Birthday Input */}
          <div className={clsx(style.infoItem, "col-span-6")}>
            <p>
              <strong>Ngày sinh: </strong>
              {editingField === "birthday" ? (
                <input
                  type="date"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
              ) : profileData?.birthday ? (
                formatDate(profileData?.birthday || "")
              ) : (
                ""
              )}
            </p>
            {editingField === "birthday" ? (
              <button
                className={clsx(
                  style.editButton,
                  "bg-yellow-600 hover:bg-yellow-500 col-span-6"
                )}
                onClick={handleSaveClick}
              >
                Lưu
              </button>
            ) : (
              <button
                className={clsx(
                  style.editButton,
                  "bg-yellow-600 hover:bg-yellow-500 col-span-6"
                )}
                onClick={() =>
                  handleEditClick("birthday", profileData?.birthday || "")
                }
              >
                Sửa thông tin
              </button>
            )}
          </div>

          {/* Gender Input */}
          <div className={clsx(style.infoItem, "col-span-6")}>
            <p>
              <strong>Giới tính: </strong>
              {editingField === "gender" ? (
                <div>
                  <label>
                    <input
                      type="radio"
                      value="male"
                      checked={editValue === "male"}
                      onChange={() => setEditValue("male")}
                    />
                    Nam
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="female"
                      checked={editValue === "female"}
                      onChange={() => setEditValue("female")}
                    />
                    Nữ
                  </label>
                </div>
              ) : profileData?.gender === "male" ? (
                "Nam"
              ) : (
                "Nữ"
              )}
            </p>
            {editingField === "gender" ? (
              <button
                className={clsx(
                  style.editButton,
                  "bg-yellow-600 hover:bg-yellow-500 col-span-6"
                )}
                onClick={handleSaveClick}
              >
                Lưu
              </button>
            ) : (
              <button
                className={clsx(
                  style.editButton,
                  "bg-yellow-600 hover:bg-yellow-500 col-span-6"
                )}
                onClick={() =>
                  handleEditClick("gender", profileData?.gender || "")
                }
              >
                Sửa thông tin
              </button>
            )}
          </div>

          {/* Country Input */}
          <div className={clsx(style.infoItem, "col-span-6")}>
            <p>
              <strong>Quốc gia: </strong>
              {editingField === "country" ? (
                <select
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                >
                  <option value="">Chọn quốc gia</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              ) : (
                profileData?.country
              )}
            </p>
            {editingField === "country" ? (
              <button
                className={clsx(
                  style.editButton,
                  "bg-yellow-600 hover:bg-yellow-500 col-span-6"
                )}
                onClick={handleSaveClick}
              >
                Lưu
              </button>
            ) : (
              <button
                className={clsx(
                  style.editButton,
                  "bg-yellow-600 hover:bg-yellow-500 col-span-6"
                )}
                onClick={() =>
                  handleEditClick("country", profileData?.country || "")
                }
              >
                Sửa thông tin
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
