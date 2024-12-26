import React, { useState, useEffect, useContext } from "react";
import axios from "@/lib/axios";
import style from "./comment.module.scss";
import { AppContext } from "@/app/layout";
import { formatTimeFromNow } from "@/utils/String";
import { Img } from "react-image";

interface CommentProps {
  id_music: string;
}

interface Comment {
  id_comment: string;
  user: string;
  text: string;
  created_at: string;
  user_url: string;
}

const Comment: React.FC<CommentProps> = ({ id_music }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [myComment, setMyComment] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { state, dispatch } = useContext(AppContext);
  const [visibleLayerId, setVisibleLayerId] = useState(null);

  const toggleLayer = (id) => {
    setVisibleLayerId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response: any = await axios.get(`/comment`, {
          params: { id_music },
        });
        // console.log("Response Data:", response.result.data);
        setComments(response.result.data || []);
        console.log(response.result.data);
      } catch (err) {
        setError("Failed to load comments");
      } finally {
        setLoading(false);
      }
    };
    fetchComments();

    axios.get(`/comment/me?id_music=${id_music}`).then((res: any) => {
      setMyComment(res.result.data);
    });
  }, [id_music]);

  const handleAddComment = async () => {
    if (newComment.trim() === "") {
      return;
    }

    try {
      const response: any = await axios.post(`/comment`, {
        id_music,
        text: newComment,
      });

      // console.log("Posted Comment Response:", response.result.data);

      if (response.status === 201) {
        const updatedComments: any = await axios.get(`/comment`, {
          params: { id_music },
        });
        setComments(updatedComments.result.data || []);
        setNewComment("");
      }
    } catch (err) {
      if (err.response.status === 403) {
        alert("Hãy đăng nhập để bình luận.");
        dispatch({ type: "SHOW_LOGIN", payload: true });
      } else {
        setError("Có lỗi xảy ra khi thêm bình luận.");
      }
    }
  };

  const handleDeleteComment = async (id_comment: string) => {
    try {
      await axios.delete(`/comment/${id_comment}`);
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id_comment !== id_comment)
      );
    } catch (err) {
      alert("Không xóa được bình luận của người dùng khác.");
    }
  };

  // if (loading) return <p>Loading comments...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="w-[450px] mt-[60px]">
      <h3 className="font-medium text-[20px] text-gray-300 mb-[30px]">
        Bình luận
      </h3>
      <form className="mb-4 flex gap-4 items-center">
        <input
          type="text"
          value={newComment}
          onChange={(e) => {
            setNewComment(e.target.value);
          }}
          placeholder="Bình luận..."
          required
          className="py-[10px] px-[20px] h-[40px] rounded-[100px] outline-none flex-1 text-[14px] font-normal text-gray-200 placeholder:text-gray-500"
          style={{ backgroundColor: "rgba(255, 255, 255, .05)" }}
        />
        <button
          type="button"
          className="py-[4px] px-[8px] text-[14px] bg-blue-500 rounded-[100px] text-gray-200"
          onClick={handleAddComment}
        >
          Bình luận
        </button>
      </form>
      <div className="flex gap-1 flex-col">
        {comments.length > 0 ? (
          comments.map((comment) =>
            comment && comment.user && comment.text && comment.id_comment ? (
              // comments.map((comment) => (
              <div
                key={comment.id_comment}
                className="mb-[10px] flex gap-3 relative group"
              >
                <Img
                  src={comment.user_url}
                  className="h-[30px] w-[30px] rounded-full"
                  unloader={
                    <img
                      src="/default_avatar.jpg"
                      alt="default"
                      className="h-[30px] w-[30px] rounded-full"
                    />
                  }
                />
                <div className="flex flex-col">
                  <div className="flex gap-2 items-center">
                    {myComment
                      ?.map((i) => i.id_comment)
                      .includes(comment.id_comment) ? (
                      <span className="text-[14px] font-medium text-gray-400 block">
                        Bạn
                      </span>
                    ) : (
                      <span className="text-[14px] font-medium text-gray-300 block">
                        {comment.user}
                      </span>
                    )}
                    <span className="text-[12px] font-regular text-gray-500 block">
                      {formatTimeFromNow(comment.created_at)}
                    </span>
                  </div>
                  <span className="text-[14px] font-normal text-gray-300">
                    {comment.text}
                  </span>
                </div>
                {myComment
                  ?.map((i) => i.id_comment)
                  .includes(comment.id_comment) && (
                  <button
                    className="p-1 rounded-full h-[24px] w-[24px] absolute top-[4px] right-0 hidden hover:bg-gray-500 group-hover:block hover:bg-gray-500"
                    onClick={() => toggleLayer(comment.id_comment)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="rgba(255, 255, 255, .4)"
                      className="size-6 w-full h-full"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                      />
                    </svg>
                  </button>
                )}
                {visibleLayerId === comment.id_comment && (
                  <div className="absolute right-0 top-[32px] bg-gray-400 text-white text-sm rounded shadow-lg z-10">
                    <button
                      onClick={() => {
                        handleDeleteComment(comment.id_comment);
                        setVisibleLayerId(null); // Đóng layer sau khi xóa
                      }}
                      className="hover:bg-gray-600 px-4 py-1 rounded w-full text-left"
                    >
                      Xóa
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // ))
              <p key={Math.random()} className={style.commentError}>
                Invalid comment data
              </p>
            )
          )
        ) : (
          <p>Không có bình luận.</p>
        )}
      </div>
    </div>
  );
};

export default Comment;
