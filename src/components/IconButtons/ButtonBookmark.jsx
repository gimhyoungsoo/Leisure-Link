import { useEffect, useState } from "react";
import styles from "./Button.module.css";
import { useRecoilValue } from "recoil";
import { loginState } from "../../util/recoil/atom";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../hooks/useModal";
import { useIconButtonAPI } from "../../hooks/useIconButtonAPI";

const BOOKMARK_COLOR = "#FFC436";

function ButtonBookmark({ postId, isMarked }) {
    const [isBookmarked, setIsBookmarked] = useState(isMarked);
    const [isLogin, setIsLogin] = useState(false);
    const [userId, setUserId] = useState(null);
    const loginInfo = useRecoilValue(loginState);
    const { closeModal } = useModal();
    const { postBookmark, deleteBookmark } = useIconButtonAPI();
    const navigate = useNavigate();

    useEffect(() => {
        if (loginInfo.login_status) {
            setIsLogin(true);
            setUserId(loginInfo.userId);
        }
    }, []);

    useEffect(() => {
        if (isBookmarked !== isMarked) {
            setIsBookmarked(isMarked);
        }
    }, [isMarked]);

    const handleBookmark = () => {
        if (!isLogin) {
            const loginConfirm = window.confirm("로그인이 필요합니다. 로그인하시겠습니까?");
            if (loginConfirm) {
                navigate("/LoginPage");
                closeModal();
            }
            return null;
        }
        isBookmarked ? setIsBookmarked(!deleteBookmark(postId, userId)) : setIsBookmarked(postBookmark(postId, userId));
    };

    const BookmarkIcon = () => {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
                fill={isBookmarked ? BOOKMARK_COLOR : "none"}
                stroke={BOOKMARK_COLOR}
                strokeWidth="64"
                strokeLinecap="round"
            >
                <path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Z" />
            </svg>
        );
    };

    return (
        <button className={styles.button} onClick={handleBookmark}>
            <BookmarkIcon />
        </button>
    );
}
export default ButtonBookmark;
