import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { loginState } from "../../util/recoil/atom";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../hooks/useModal";
import { useIconButtonAPI } from "../../hooks/useIconButtonAPI";
import styles from "./Button.module.css";
const RECOMMEND_COLOR = "#337CCF";

function ButtonRecommend({ postId, isMarked }) {
    const [isRecommended, setIsRecommended] = useState(isMarked);
    const [isLogin, setIsLogin] = useState(false);
    const [userId, setUserId] = useState(null);
    const loginInfo = useRecoilValue(loginState);
    const { closeModal } = useModal();
    const { postRecommmend } = useIconButtonAPI();
    const navigate = useNavigate();

    useEffect(() => {
        if (loginInfo.login_status) {
            setIsLogin(true);
            setUserId(loginInfo.userId);
        }
    }, []);
  
    useEffect(() => {
        if (isRecommended !== isMarked) {
            setIsRecommended(isMarked);
        }
    }, [isMarked]);

    // 클릭 이벤트리스너
    const handleRecommend = () => {
        if (!isLogin) {
            const loginConfirm = window.confirm("로그인이 필요합니다. 로그인하시겠습니까?");
            if (loginConfirm) {
                navigate("/LoginPage");
                closeModal();
            }
            return null;
        }
        if (postRecommmend(postId, userId)) {
            setIsRecommended((prev) => !prev);
        }
    };

    const RecommendIcon = () => {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
                fill={isRecommended ? RECOMMEND_COLOR : "none"}
                stroke={isRecommended ? "none" : RECOMMEND_COLOR}
                strokeWidth="64"
                strokeLinecap="round"
            >
                <path d="M720-120H320v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h218q32 0 56 24t24 56v80q0 7-1.5 15t-4.5 15L794-168q-9 20-30 34t-44 14ZM240-640v520H80v-520h160Z" />
            </svg>
        );
    };

    return (
        <button className={styles.button} onClick={handleRecommend}>
            <RecommendIcon />
        </button>
    );
}
export default ButtonRecommend;
