import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";
import styles from "./Comments.module.css";
import { LoginActions } from "../../util/action/LoginAction";
import { useRecoilValue } from "recoil";
import { loginState } from "../../util/recoil/atom";
const BASE_URL = process.env.REACT_APP_API_URL;

function Comment({ postId }) {
    const [comments, setComments] = useState([]); // 댓글 데이터를 저장할 상태
    const [newComment, setNewComment] = useState(""); // 새 댓글 입력 상태
    const [userName, setUserName] = useState("사용자"); // 사용자 이름 상태
    const [isLogin, setIsLogin] = useState(false);
    // 로그인 상태
    const [currentUserId, setCurrentUserId] = useState(null);

    const loginInfo = useRecoilValue(loginState);

    useEffect(() => {
        if (loginInfo.login_status && loginInfo.userId) {
            setCurrentUserId(loginInfo.userId);
        }
    }, []);

    useEffect(() => {
        if (loginInfo.login_status) {
            setIsLogin(true);
            fetchUserData(loginInfo.userId);
        }
    }, [loginInfo]);

    useEffect(() => {
        axios
            .get(`${BASE_URL}/comments/posts/${postId}`)
            .then((response) => {
                // API에서 가져온 댓글 데이터를 상태에 저장함.
                const allComments = response.data.data;
                setComments(allComments);
            })
            .catch((error) => {
                console.error("댓글 목록을 가져오는 데 실패했습니다.", error);
            });
    }, [postId]);

    const fetchUserData = async (userId) => {
        try {
            const response = await axios.get(`${BASE_URL}/users/${userId}`);
            const data = response.data.username;
            setUserName(data);
        } catch (error) {
            console.error("사용자 정보를 가져오는 데 실패했습니다.", error);
        }
    };
    // 새 댓글을 생성하는 API 요청
    const handleAddComment = async () => {
        if (newComment.trim() !== "") {
            try {
                const commentData = {
                    userId: currentUserId,
                    commentText: newComment,
                };

                // 응답에서 생성된 댓글 정보를 가져와서 상태에 추가합니다.
                const newCommentObject = {
                    postId: postId,
                    user: {
                        userId: currentUserId,
                        username: userName,
                    },
                    commentText: newComment,
                };

                await axios.post(`${BASE_URL}/comments/posts/${postId}`, commentData);

                setComments([...comments, newCommentObject]);
                setNewComment("");
            } catch (error) {
                console.error("댓글 생성에 실패했습니다.", error);
            }
        }
    };

    // 댓글을 삭제하는 API 요청
    const handleDeleteComment = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/comments/${id}`);
            const updatedComments = comments.filter((comment) => comment.commentId !== id);
            setComments(updatedComments);
        } catch (error) {
            console.error("댓글 삭제에 실패했습니다.", error);
        }
    };

    // 댓글을 수정하는 API 요청
    const handleEditComment = async (id) => {
        const editedComment = prompt(
            "댓글을 수정하세요:",
            comments.find((comment) => comment.commentId === id)?.commentText,
        );
        if (editedComment !== null) {
            try {
                const response = await axios.patch(`${BASE_URL}/comments/${id}`, {
                    userId: currentUserId,
                    commentText: editedComment,
                });

                // 수정 후에 서버에서 다시 댓글 목록을 가져와서 상태를 업데이트
                const updatedComment = response.data;
                const updatedComments = comments.map((comment) =>
                    comment.commentId === id ? { ...comment, commentText: updatedComment.commentText } : comment,
                );
                setComments(updatedComments);
            } catch (error) {
                console.error("댓글 수정에 실패했습니다.", error);
            }
        }
    };

    return (
        <div className={styles.commentContainer}>
            {/* comments 배열이 비어있을 때 렌더링하지 않도록 조건부 렌더링 */}
            <div className={styles.addComment}>
                <span className={styles.userName}>{userName}</span>
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="새 댓글을 입력하세요"
                    className={styles.commentInput}
                />
                <button onClick={handleAddComment} className={styles.addBtn}>
                    댓글 추가
                </button>
            </div>
            {comments.length > 0 && (
                <div className={styles.commentList}>
                    <ul>
                        {comments.map((comment) => (
                            <li key={comment.commentId} className={styles.commentItem}>
                                {comment.user && (
                                    <div className={styles.commentBox}>
                                        <span className={styles.commentUser}>{comment.user.username}</span>
                                        <span className={styles.commentText}> {comment.commentText} </span>
                                    </div>
                                )}
                                {currentUserId !== null &&
                                    comment.user &&
                                    Number(currentUserId) === Number(comment.user.userId) && (
                                        <>
                                            <button
                                                onClick={() => handleDeleteComment(comment.commentId)}
                                                className={styles.commentBtn}
                                            >
                                                <FaTrash />
                                            </button>
                                            <button
                                                onClick={() => handleEditComment(comment.commentId, comment)}
                                                className={styles.commentBtn}
                                            >
                                                <FaEdit />
                                            </button>
                                        </>
                                    )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Comment;
