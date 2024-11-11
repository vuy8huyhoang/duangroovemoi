import React, { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import style from './comment.module.scss';

interface CommentProps {
    id_music: string;
}

interface Comment {
    id_comment: string;
    user: string;
    text: string;
    created_at: string;
}

const Comment: React.FC<CommentProps> = ({ id_music }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response: any = await axios.get(`/comment`, {
                    params: { id_music },
                });
                console.log("Response Data:", response.result.data);
                setComments(response.result.data || []);
            } catch (err) {
                setError('Failed to load comments');
            } finally {
                setLoading(false);
            }
        };
        fetchComments();
    }, [id_music]);

    const handleAddComment = async () => {
        try {
            const response: any = await axios.post(`/comment`, {
                id_music,
                text: newComment,
            });

            console.log("Posted Comment Response:", response.result.data); 

            if (response.status === 201) {
                const updatedComments: any = await axios.get(`/comment`, { params: { id_music } });
                setComments(updatedComments.result.data || []);
                setNewComment('');
            }
        } catch (err) {
            alert("Hãy đăng nhập để bình luận.");
        }
    };

    const handleDeleteComment = async (id_comment: string) => {
        try {
            await axios.delete(`/comment/${id_comment}`); 
            setComments((prevComments) => prevComments.filter((comment) => comment.id_comment !== id_comment));
        } catch (err) {
            alert("Không xóa được bình luận của người dùng khác.");
        }
    };

    if (loading) return <p>Loading comments...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className={style.commentSection}>
            <h3>Bình luận</h3>
            <div className={style.commentList}>
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        comment && comment.user && comment.text && comment.id_comment ? (
                            <div key={comment.id_comment} className={style.comment}>
                                <div className={style.content}>
                                <p><strong>{comment.user}</strong>: {comment.text}</p>
                                <p className={style.timestamp}>Posted on: {new Date(comment.created_at).toLocaleString()}</p>
                                </div>
                                <button onClick={() => handleDeleteComment(comment.id_comment)} className={style.deleteButton}>
                                    Xóa
                                </button>
                            </div>
                        ) : (
                            <p key={Math.random()} className={style.commentError}>
                                Invalid comment data
                            </p>
                        )
                    ))
                ) : (
                    <p>Không có bình luận.</p>
                )}
            </div>
            <div className={style.commentForm}>
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Bình luận..."
                />
                <button onClick={handleAddComment}>Đăng bình luận</button>
            </div>
        </div>
    );
};

export default Comment;
