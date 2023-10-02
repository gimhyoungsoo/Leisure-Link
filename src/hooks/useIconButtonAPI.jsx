import axios from "axios";
import { useState } from "react";

const BASE_URL = process.env.REACT_APP_API_URL;

export function useIconButtonAPI() {
    // 추천
    const [recommendedPostId, setRecommendedPostId] = useState([]);
    const getRecommend = async (userId) => {
        try {
            const response = await axios.get(`${BASE_URL}/recommend/${userId}`);
            const data = await response.data;

            setRecommendedPostId(
                data.map((el) => {
                    return el.postId;
                }),
            );
        } catch (error) {
            console.error(error.code, "추천 정보 get 실패");
        }
    };

    const postRecommmend = async (postId, userId) => {
        try {
            const response = await axios.post(`${BASE_URL}/recommend/${postId}?userId=${userId}`);
            if (response.status === 200) {
                return true;
            } else {
                console.error("추천 정보 post 실패. 응답 코드:", response.status);
                return false;
            }
        } catch (error) {
            console.error(error.code, "추천 정보 post 실패");
            alert("서버와의 통신 오류로 추천이 변경되지 않았습니다.");
            return false;
        }
    };

    //북마크
    const [bookmarkedPostId, setBookmarkedPostId] = useState([]);
    const getBookmark = async (userId) => {
        try {
            const response = await axios.get(`${BASE_URL}/bookmarks/${userId}`);
            const data = await response.data;

            setBookmarkedPostId(data.map((el) => el.post_id));
        } catch (error) {
            console.error(error.code, "북마크 정보 get 실패");
        }
    };

    const postBookmark = async (postId,userId) => {
        try {
            const response = await axios.post(`${BASE_URL}/bookmarks`, {
                post_id: postId,
                user_id: userId,
                bookmark_name: "",
            });

            if (response.status === 201) {
                return true
            } else {
                console.error("북마크 정보 post 실패. 응답 코드:", response.status);
                return false
            }
        } catch (error) {
            console.error(error.code, "북마크 정보 post 실패");
            return false
        }
    };

    const deleteBookmark = async (postId,userId) => {
        try {
            const response = await axios.delete(`${BASE_URL}/bookmarks`, {
                data: {
                    post_id: postId,
                    user_id: userId,                    
                },
            });
            if ((response.status === 200, response.status === 204)) {
                return true
            } else {
                console.error("북마크 정보 post 실패. 응답 코드:", response.status);
                return false
            }
        } catch (error) {
            console.error(error, "북마크 정보 delete 실패");
            return false
        }
    };

    return { getRecommend, recommendedPostId, postRecommmend, getBookmark, bookmarkedPostId, postBookmark, deleteBookmark };
}
