"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import styles from "../../../form.module.scss";
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
  release_date: string | null;
  created_at: string;
  last_update: string;
  is_show: number;
  view: number;
  favorite: number;
  artists: { id_artist: string; name: string }[];
  types: { id_type: string; name: string }[];
  id_composer: string;
}

interface Lyric {
  lyrics: string;
  start_time: number;
  end_time: number;
}

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
    .nullable()
    .test("fileSize", "Kích thước ảnh không được vượt quá 10MB.", (value) =>
      value ? value.size <= 10 * 1024 * 1024 : true
    )
    .test(
      "fileFormat",
      "Định dạng file không hợp lệ. Chỉ chấp nhận .jpeg, .png, .jpg, .gif, .webp.",
      (value) =>
        value
          ? [
              "image/jpeg",
              "image/png",
              "image/jpg",
              "image/gif",
              "image/webp",
            ].includes(value.type)
          : true
    ),
  audioFile: yup
    .mixed<File>()
    .nullable()
    .test(
      "fileSize",
      "Kích thước tệp âm thanh không được vượt quá 10MB.",
      (value) => (value ? value.size <= 10 * 1024 * 1024 : true)
    ),
});

export default function EditMusic({ params }: { params: { id: string } }) {
  const [song, setSong] = useState<Song | null>(null);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [composers, setComposers] = useState<Composer[]>([]);
  const [lyrics, setLyrics] = useState<Lyric[]>([]);
  const router = useRouter();

  useEffect(() => {
    axios.get("/artist").then((response: any) => {
      setArtists(response?.result?.data || []);
    });

    axios.get("/type").then((response: any) => {
      setTypes(response?.result?.data || []);
    });

    axios.get("/composer").then((response: any) => {
      setComposers(response?.result?.data || []);
    });
  }, []);

  useEffect(() => {
    if (params.id) {
      axios
        .get(`/music/${params.id}`)
        .then((response: any) => {
          if (response?.result?.data) {
            setSong(response.result.data);
            setLyrics(response?.result?.data?.lyrics);
          }
        })
        .catch((error) => console.error("Lỗi fetch bài hát:", error));
    }
  }, [params.id]);

  if (!song) return <p>Đang tải...</p>;

  return (
    <div className={styles.container}>
      <h2>Chỉnh sửa bài hát</h2>
      <Formik
        initialValues={{
          name: song.name || "",
          producer: song.producer || "",
          artists: song.artists.map((artist) => artist.id_artist),
          types: song.types.map((type) => type.id_type),
          composer: song.id_composer || "",
          is_show: song.is_show,
          file: null,
          audioFile: null,
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const songData: any = {
              ...values,
              lyrics,
            };

            if (values.file) {
              const imageFormData = new FormData();
              imageFormData.append("file", values.file);
              const imageUploadResponse: any = await axios.post(
                "/upload-image",
                imageFormData
              );
              songData.url_cover =
                imageUploadResponse?.result?.url || song.url_cover;
            }

            if (values.audioFile) {
              const audioFormData = new FormData();
              audioFormData.append("file", values.audioFile);
              const audioUploadResponse: any = await axios.post(
                "/upload-audio",
                audioFormData
              );
              songData.url_path =
                audioUploadResponse?.result?.url || song.url_path;
            }

            await axios.patch(`/music/${params.id}`, songData);
            alert("Cập nhật thành công!");
            router.push("/admin/music");
          } catch (error) {
            console.error("Lỗi cập nhật bài hát:", error);
            alert("Cập nhật thất bại.");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ setFieldValue, values }) => (
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
                onChange={(e) => {
                  const selectedValues = Array.from(
                    e.target.selectedOptions,
                    (option: any) => option.value
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
                onChange={(e) => {
                  const selectedValues = Array.from(
                    e.target.selectedOptions,
                    (option: any) => option.value
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

            <div>
              <div className={styles.visibilityRadioButtons}>
                <div>
                  <label>Hiện</label>
                  <Field
                    type="radio"
                    name="is_show"
                    value="1"
                    checked={values.is_show === 1}
                    onChange={() => setFieldValue("is_show", 1)}
                  />
                </div>

                <div>
                  <label>Ẩn</label>
                  <Field
                    type="radio"
                    name="is_show"
                    value="0"
                    checked={values.is_show === 0}
                    onChange={() => setFieldValue("is_show", 0)}
                  />
                </div>
              </div>
              <ErrorMessage
                name="is_show"
                component="div"
                className={styles.errorMessage}
              />
            </div>

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
                              i === index ? { ...l, lyrics: e.target.value } : l
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
                                  ? { ...l, start_time: Number(e.target.value) }
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
            </div>

            <div>
              <input
                id="file-upload"
                type="file"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files ? e.target.files[0] : null;
                  setFieldValue("file", file); // Đưa giá trị tệp vào Formik
                  if (file) {
                    const previewUrl = URL.createObjectURL(file);
                    setSong((prevSong) =>
                      prevSong ? { ...prevSong, url_cover: previewUrl } : null
                    );
                  }
                }}
              />

              {song?.url_cover && (
                <div className={styles.preview}>
                  <img src={song.url_cover} alt="Preview" />
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
                    const previewUrl = URL.createObjectURL(file);
                    setSong((prevSong) =>
                      prevSong ? { ...prevSong, url_path: previewUrl } : null
                    );
                  }
                }}
              />

              {song?.url_path && (
                <div className={styles.preview}>
                  <audio controls src={song.url_path}>
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

            <button type="submit">Cập nhật bài hát</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
