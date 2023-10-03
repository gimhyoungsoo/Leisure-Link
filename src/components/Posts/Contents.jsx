import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import styles from "./Contents.module.css";
import Comments from "./Comments";
import { FaUser } from "react-icons/fa";
import ButtonBookmark from "../IconButtons/ButtonBookmark";
import ButtonRecommend from "../IconButtons/ButtonRecommend";
import { useRecoilValue } from "recoil";
import { loginState } from "../../util/recoil/atom";
import { useIconButtonAPI } from "../../hooks/useIconButtonAPI";
import { useModal } from "../../hooks/useModal";

const BASE_URL = process.env.REACT_APP_API_URL;
const PROXY_KEY = process.env.REACT_APP_PROXY_KEY;

const axiosConfig = {
    headers: {
        "x-cors-api-key": PROXY_KEY,
    },
};
function Contents({ postId }) {
    //게시글 관련 상태
    const [postData, setPostData] = useState(null);
    const [editedCaption, setEditedCaption] = useState(""); // 수정한 캡션을 저장
    const [isEditing, setIsEditing] = useState(false);
    const { getRecommend, recommendedPostId, getBookmark, bookmarkedPostId } = useIconButtonAPI();
    const { closeModal } = useModal();

    //로그인 관련 상태
    const [currentUserId, setCurrentUserId] = useState(null);
    const loginInfo = useRecoilValue(loginState);

    //이미지 반응형 관련 훅
    const imageRef = useRef(null);

    useEffect(() => {
        if (imageRef.current) {
            const img = imageRef.current;
            const handleImageLoad = () => {
                const { width, height } = img;
                const isHorizontal = width > height;
                img.style.width = isHorizontal ? "100%" : "auto";
                img.style.height = isHorizontal ? "auto" : "100%";
            };

            img.addEventListener("load", handleImageLoad);

            return () => {
                img.removeEventListener("load", handleImageLoad);
            };
        }
    });

    useEffect(() => {
        fetchPostData();
        if (loginInfo.login_status) {
            setCurrentUserId(Number(loginInfo.userId));
        }
    }, []);

    useEffect(() => {
        if (currentUserId !== null) {
            getRecommend(currentUserId);
            getBookmark(currentUserId);
        }
    }, [currentUserId]);

    // 특정 게시글의 데이터를 받아오는 함수
    const fetchPostData = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/posts/${postId}`, axiosConfig);
            setPostData(response.data);
            setEditedCaption(response.data.postCaption);
        } catch (error) {
            console.error("데이터를 가져오는 중 오류가 발생했습니다:", error);
        }
    };

    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Add 1 to month because it's zero-based
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}.${month}.${day}`;
    }

    // 게시글 수정 함수
    const handleEditPost = () => {
        // 게시글 작성자의 ID
        const postUserId = Number(postData.user.userId);

        if (currentUserId === null) {
            alert("로그인 후 이용해주세요");
        }

        // 게시글 작성자와 현재 사용자가 동일한 경우에만 수정 가능
        else if (currentUserId === postUserId) {
            setIsEditing(true);
        } else {
            alert("게시글 작성자와 현재 사용자가 다릅니다. 수정할 수 없습니다.");
        }
    };

    // 수정 완료 버튼 클릭 시 호출되는 함수
    const handleSaveEdit = () => {
        // 수정 완료 시 실행할 작업을 추가
        // 예: 수정한 내용 저장, 수정 모드 종료
        // axios.patch() 또는 필요한 작업을 수행하세요.
        // 수정이 완료되면 isEditing 값을 변경하여 수정 모드 종료
        const postUserId = postData.user.userId;

        if (currentUserId === null) {
            alert("로그인 후 이용해주세요");
            setIsEditing(false); // 수정 모드 종료
        } else if (currentUserId === postUserId) {
            // 수정할 내용과 게시글 id를 사용하여 patch 요청을 보냄
            const editData = {
                postCaption: editedCaption, // 수정된 내용
                tags: postData.tags, // 태그 정보는 그대로 사용
            };
            axios
                .patch(`${BASE_URL}/posts/${postId}?userId=${currentUserId}`, editData, axiosConfig)
                .then((response) => {
                    setPostData({ ...postData, postCaption: editedCaption });
                    setIsEditing(false); // 수정 모드 종료
                })
                .catch((error) => {
                    console.error("게시글 수정 중 오류가 발생했습니다:", error);
                    setIsEditing(false); // 수정 모드 종료
                });
        } else {
            alert("게시글 작성자와 현재 사용자가 다릅니다. 수정할 수 없습니다.");
            setIsEditing(false); // 수정 모드 종료
        }
    };

    // 게시글 삭제 함수
    const handleDeletePost = () => {
        const postUserId = Number(postData.user.userId);

        if (currentUserId === null) {
            // User is not logged in, show an alert
            alert("로그인 후 이용해주세요.");
            return;
        }

        // 게시글 작성자와 현재 사용자가 동일한 경우에만 삭제 가능
        if (currentUserId === Number(postUserId)) {
            // 게시글 ID와 유저 ID를 사용하여 DELETE 요청을 보냄
            axios
                .delete(`${BASE_URL}/posts/${postId}?userId=${currentUserId}`, axiosConfig)
                .then((response) => {
                    closeModal();
                })
                .catch((error) => {
                    console.error("게시글 삭제 중 오류가 발생했습니다:", error);
                });
        } else {
            // 게시글 작성자와 현재 사용자가 다른 경우 삭제할 수 없음을 알림
            alert("게시글 작성자와 현재 사용자가 다릅니다. 삭제할 수 없습니다.");
        }
    };

    return (
        <>
            {postData && (
                <>
                    <div className={styles.image_section}>
                        <img src={postData.postImage} alt="게시글 이미지" className={styles.image} ref={imageRef} />
                    </div>
                    <div>
                        <div className={styles.info_section}>
                            {currentUserId === Number(postData.user.userId) && (
                                <div>
                                    <button onClick={handleEditPost} className={styles.edit_button}>
                                        게시글 수정
                                    </button>
                                    <button onClick={handleDeletePost} className={styles.delete_button}>
                                        게시글 삭제
                                    </button>
                                    {isEditing && (
                                        <button onClick={handleSaveEdit} className={styles.complete_button}>
                                            수정 완료
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* 태그 */}
                            <div className={styles.tags}>
                                {postData.tags && postData.tags.map((tag) => <span key={tag}>#{tag}</span>)}
                            </div>

                            {/* 제목 */}
                            <h1 className={styles.postTitle}>{postData.postTitle}</h1>

                            {/* 주소 */}
                            <p className={styles.postAddress}></p>

                            {/* 유저정보 */}
                            <div className={styles.user_info}>
                                {postData.user.profileImage ? (
                                    <img
                                        src={postData.user.profileImage}
                                        alt="프로필 이미지"
                                        className={styles.profileImage}
                                    />
                                ) : (
                                    <div className={styles.profileIcon}>
                                        <FaUser size={20} />
                                    </div>
                                )}
                                <p className={styles.username}>{postData.user.username}</p>
                                {/* 추천, 북마크자리 */}
                                <ButtonRecommend
                                    postId={postId}
                                    isMarked={recommendedPostId.includes(Number(postId))}
                                />
                                <ButtonBookmark postId={postId} isMarked={bookmarkedPostId.includes(Number(postId))} />
                            </div>

                            {/* 날짜 */}
                            <p className={styles.createdAt}>{formatDate(postData.createdAt)}</p>

                            {/* 캡션 */}
                            {/* 수정 중이 아니라면 내용을 나타나게 하고, 수정 중이라면 textarea가 나타나도록 함. */}
                            {isEditing ? (
                                <textarea
                                    value={editedCaption}
                                    onChange={(e) => setEditedCaption(e.target.value)}
                                    rows="3"
                                    cols="35"
                                />
                            ) : (
                                <p className={styles.postCaption}>{postData.postCaption}</p>
                            )}
                        </div>
                        <Comments postId={postId} />
                    </div>
                </>
            )}
        </>
    );
}

export default Contents;
