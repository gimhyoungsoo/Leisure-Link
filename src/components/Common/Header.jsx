import styles from "./Header.module.css";
import { RxMagnifyingGlass } from "react-icons/rx";
import { Link } from "react-router-dom";
import { useModal } from "../../hooks/useModal";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { loginState } from "../../util/recoil/atom";
import { LogoutActions } from "../../util/action/LogoutAction";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;
const PROXY_KEY = process.env.REACT_APP_PROXY_KEY;

const axiosConfig = {
    headers: {
        "x-cors-api-key": PROXY_KEY,
    },
};

function Header() {
    const [isLogin, setIsLogin] = useState(false);
    const [userName, setUserName] = useState("사용자");
    const loginInfo = useRecoilValue(loginState);
    const { handleLogout } = LogoutActions();
    const { openModal, closeModal } = useModal();
    const navigate = useNavigate();

    useEffect(() => {
        if (loginInfo.login_status) {
            setIsLogin(true);
            fetchUserData(loginInfo.userId);
        }
    }, [loginInfo]);

    const fetchUserData = async (userId) => {
        try {
            const response = await axios.get(`${BASE_URL}/users/${userId}`, axiosConfig);
            const data = response.data.username;
            setUserName(data);
        } catch (error) {
            console.log("사용자 정보를 가져오는 데 실패했습니다.", error);
        }
    };

    const handleUploadClick = () => {
        if (!isLogin) {
            const loginConfirm = window.confirm("로그인이 필요합니다. 로그인하시겠습니까?");
            if (loginConfirm) {
                navigate("/LoginPage");
                closeModal();
            }
            return null;
        }
        openModal("upload");
    };

    return (
        <header className={styles.header}>
            <div className={`${styles.container} ${styles.flex}`}>
                <div className={`${styles.left} ${styles.flex}`}>
                    <div>
                        <div className={styles.logo}>
                            <Link to="/">
                                <div>Leisure Link</div>
                            </Link>
                        </div>
                    </div>
                    <div className={styles.search}>
                        <div className={styles.icon_wrap}>
                            <RxMagnifyingGlass size={32} />
                        </div>

                        <input className={styles.bar}></input>
                    </div>
                </div>
                <div className={`${styles.right} ${styles.flex}`}>
                    <div className={styles.add_picture} onClick={handleUploadClick}>
                        <button>사진 올리기</button>
                    </div>
                    <div className={styles.user_name}>
                        {isLogin ? (
                            <>
                                <Link to="/mypage">{userName}님</Link>
                                <button onClick={handleLogout}>로그아웃</button>
                            </>
                        ) : (
                            <Link to="/LoginPage">로그인하기</Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
export default Header;
