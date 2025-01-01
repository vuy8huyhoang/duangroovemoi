"use client";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import styles from "../../form.module.scss";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { useRouter } from "next/navigation";

interface Artist {
  id_artist: string;
  name: string;
  slug: string;
  url_cover: string;
}

interface Type {
  id_type: string;
  name: string;
  slug: string;
  created_at: string;
  is_show: number;
}

interface Composer {
  id_composer: string;
  name: string;
}

interface Song {
  id_music: string;
  name: string;
  slug: string;
  url_path: string;
  url_cover: string;
  total_duration: string | null;
  producer: string;
  composer: string;
  id_composer: string;
  release_date: string | null;
  created_at: string;
  last_update: string;
  is_show: number;
  view: number;
  favorite: number;
  artists: string[];
  types: string[];
}

interface Lyric {
  lyrics: string;
  start_time: number;
  end_time: number;
}

export default function AddMusic() {
  const [song, setSong] = useState<Song>({
    id_music: "",
    name: "",
    slug: "",
    url_path: "",
    url_cover: "",
    total_duration: null,
    producer: "",
    composer: null,
    id_composer: null,
    release_date: null,
    created_at: new Date().toISOString(),
    last_update: new Date().toISOString(),
    is_show: 1,
    view: 0,
    favorite: 0,
    artists: [],
    types: [],
  });
  const router = useRouter();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [composers, setComposers] = useState<Composer[]>([]); // State for composers
  const [file, setFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewAudio, setPreviewAudio] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [lyrics, setLyrics] = useState<Lyric[]>([]);
  const validationSchema = yup.object().shape({
    name: yup.string().required("Tên bài hát là bắt buộc."),
    producer: yup.string().required("Nhà sản xuất là bắt buộc."),
    artists: yup
      .array()
      .min(1, "Vui lòng chọn ít nhất một nghệ sĩ.")
      .required("Danh sách nghệ sĩ là bắt buộc."),
    types: yup
      .array()
      .min(1, "Vui lòng chọn ít nhất một thể loại.")
      .required("Danh sách thể loại là bắt buộc."),
    composer: yup.string().required("Nhạc sĩ là bắt buộc."),
    is_show: yup
      .number()
      .oneOf([0, 1], "Trạng thái hiển thị không hợp lệ.")
      .required("Trạng thái hiển thị là bắt buộc."),
    file: yup
      .mixed<File>()
      .required("Ảnh bìa là bắt buộc.")
      .test("fileSize", "Kích thước ảnh không được vượt quá 10MB.", (value) =>
        value instanceof File ? value.size <= 10 * 1024 * 1024 : false
      )
      .test(
        "fileFormat",
        "Định dạng file không hợp lệ. Chỉ chấp nhận .jpeg, .png, .jpg, .gif, .webp.",
        (value) =>
          value instanceof File &&
          [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/gif",
            "image/webp",
          ].includes(value.type)
      ),

    audioFile: yup.mixed().required("Tệp âm thanh là bắt buộc."),
  });

  useEffect(() => {
    axios
      .get("/artist")
      .then((response: any) => {
        setArtists(response?.result?.data || []);
      })
      .catch(() => setArtists([]));

    axios
      .get("/type")
      .then((response: any) => {
        setTypes(response?.result?.data || []);
      })
      .catch(() => setTypes([]));

    axios
      .get("/composer")
      .then((response: any) => {
        setComposers(response?.result?.data || []);
      })
      .catch(() => setComposers([]));
  }, []);

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const imageFormData = new FormData();
      if (values.file) {
        imageFormData.append("file", values.file);
      } else {
        alert("Vui lòng chọn một tệp ảnh.");
        return;
      }

      const imageUploadResponse: any = await axios.post(
        "/upload-image",
        imageFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrl = imageUploadResponse?.result?.url;

      if (!imageUrl) {
        alert("Tải ảnh lên thất bại.");
        return;
      }

      const audioFormData = new FormData();
      if (values.audioFile) {
        audioFormData.append("file", values.audioFile);
      } else {
        alert("Vui lòng chọn một tệp âm thanh.");
        return;
      }

      const audioUploadResponse: any = await axios.post(
        "/upload-audio",
        audioFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const audioUrl = audioUploadResponse?.result?.url;

      if (!audioUrl) {
        alert("Tải âm thanh lên thất bại.");
        return;
      }

      console.log(lyrics);

      const songData = {
        ...values,
        slug: values.name.toLowerCase().replace(/\s+/g, "-"),
        url_cover: imageUrl,
        url_path: audioUrl,
        lyrics: lyrics,
      };

      const response = await axios.post("/music", songData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200 || response.status === 201) {
        alert("Bài hát đã được thêm thành công!");
        router.push("/admin/music");
      } else {
        alert("Thêm bài hát không thành công.");
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        setMessage("Bị trùng tên bài hát.");
      } else {
        console.error("Lỗi khi gửi dữ liệu:", error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Thêm mới bài hát</h2>
      <Formik
        initialValues={{
          name: "",
          producer: "",
          artists: [],
          types: [],
          composer: "",
          is_show: 1,
          file: null,
          audioFile: null,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values, isSubmitting }) => (
          <Form className={styles.formGroup}>
            <div>
              <label>Tên bài hát</label>
              <Field type="text" name="name" placeholder="Tên bài hát" />
              <ErrorMessage
                name="name"
                component="div"
                className={styles.errorMessage}
              />
            </div>

            <div>
              <label>Nhà sản xuất</label>
              <Field type="text" name="producer" placeholder="Nhà sản xuất" />
              <ErrorMessage
                name="producer"
                component="div"
                className={styles.errorMessage}
              />
            </div>

            <div>
              <label>Chọn nghệ sĩ</label>
              <Field
                as="select"
                name="artists"
                multiple
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const selectedValues = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  );
                  setFieldValue("artists", selectedValues);
                }}
              >
                {artists.map((artist) => (
                  <option key={artist.id_artist} value={artist.id_artist}>
                    {artist.name}
                  </option>
                ))}
              </Field>

              <ErrorMessage
                name="artists"
                component="div"
                className={styles.errorMessage}
              />
            </div>

            <div>
              <label>Chọn thể loại</label>
              <Field
                as="select"
                name="types"
                multiple
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const selectedValues = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  );
                  setFieldValue("types", selectedValues);
                }}
              >
                {types.map((type) => (
                  <option key={type.id_type} value={type.id_type}>
                    {type.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="types"
                component="div"
                className={styles.errorMessage}
              />
            </div>

            <div>
              <label>Chọn nhạc sĩ</label>
              <Field as="select" name="composer">
                <option value="">Chọn nhạc sĩ</option>
                {composers.map((composer) => (
                  <option
                    key={composer.id_composer}
                    value={composer.id_composer}
                  >
                    {composer.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="composer"
                component="div"
                className={styles.errorMessage}
              />
            </div>

            <Field name="is_show">
              {({ field, form }: any) => (
                <div className={styles.anhien}>
                  <div className={styles.visibilityRadioButtons}>
                    <div>
                      <label>Hiện</label>
                      <input
                        type="radio"
                        {...field}
                        value="1"
                        checked={form.values.is_show === 1}
                        onChange={() => form.setFieldValue("is_show", 1)}
                      />
                    </div>

                    <div>
                      <label>Ẩn</label>
                      <input
                        type="radio"
                        {...field}
                        value="0"
                        checked={form.values.is_show === 0}
                        onChange={() => form.setFieldValue("is_show", 0)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </Field>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <label>Lời bài hát</label>
                <div
                  onClick={() =>
                    setLyrics([
                      ...lyrics,
                      { lyrics: "", start_time: 0, end_time: 0 },
                    ])
                  }
                  className="rounded-full p-2 bg-gray-100 hover:bg-gray-200 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </div>
              </div>
              {lyrics && lyrics?.length > 0 && (
                <div className="flex flex-col gap-6 p-5 shadow">
                  {lyrics.map((lyric, index) => (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-lg flex-1">
                        {index + 1}.{" "}
                      </span>
                      <div key={index} className="flex flex-col gap-3">
                        <input
                          placeholder="Lời bài hát..."
                          value={lyric.lyrics}
                          onChange={(e) =>
                            setLyrics(
                              lyrics.map((l, i) =>
                                i === index
                                  ? { ...l, lyrics: e.target.value }
                                  : l
                              )
                            )
                          }
                          className={styles.textarea}
                        />
                        <div className="flex gap-3 items-center">
                          <input
                            type="number"
                            placeholder="Thời gian bắt đầu (s)"
                            value={lyric.start_time || ""}
                            onChange={(e) =>
                              setLyrics(
                                lyrics.map((l, i) =>
                                  i === index
                                    ? {
                                        ...l,
                                        start_time: Number(e.target.value),
                                      }
                                    : l
                                )
                              )
                            }
                            className={styles.input}
                          />
                          <input
                            type="number"
                            placeholder="Thời gian kết thúc (s)"
                            value={lyric.end_time || ""}
                            onChange={(e) =>
                              setLyrics(
                                lyrics.map((l, i) =>
                                  i === index
                                    ? { ...l, end_time: Number(e.target.value) }
                                    : l
                                )
                              )
                            }
                            className={styles.input}
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setLyrics(lyrics.filter((_, i) => i !== index))
                        }
                        className="hover:!bg-red-500 hover:!text-white !text-gray-500 !bg-transparent !rounded-full !w-10 !h-10 flex items-center justify-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6 w-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 12h14"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
                    setPreviewImage(URL.createObjectURL(file));
                  }
                }}
              />
              {previewImage && (
                <div className={styles.preview}>
                  <img src={previewImage} alt="Preview" />
                </div>
              )}
              <label htmlFor="file-upload" className={styles.customFileUpload}>
                Chọn ảnh bìa
              </label>
              <ErrorMessage
                name="file"
                component="div"
                className={styles.errorMessage}
              />
            </div>

            <div>
              <input
                id="audio-upload"
                type="file"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files ? e.target.files[0] : null;
                  setFieldValue("audioFile", file);
                  if (file) {
                    setPreviewAudio(URL.createObjectURL(file));
                  }
                }}
              />
              {previewAudio && (
                <div className={styles.preview}>
                  <audio controls src={previewAudio}>
                    Trình duyệt không hỗ trợ phát âm thanh.
                  </audio>
                </div>
              )}
              <label htmlFor="audio-upload" className={styles.customFileUpload}>
                Chọn tệp âm thanh
              </label>
              <ErrorMessage
                name="audioFile"
                component="div"
                className={styles.errorMessage}
              />
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang gửi..." : "Thêm bài hát"}
            </button>
            {message && <div className={styles.errorMessage}>{message}</div>}
          </Form>
        )}
      </Formik>
    </div>
  );
}
