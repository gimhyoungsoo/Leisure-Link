import { useRecoilState, useRecoilValue } from "recoil";
import axios from "axios";
import { loginState } from "../recoil/atom";

const BASE_URL = process.env.REACT_APP_API_URL;
const PROXY_KEY = process.env.REACT_APP_PROXY_KEY;

export function LoginActions() {
    const [loginInfo, setLoginInfo] = useRecoilState(loginState);
    const currentState = useRecoilValue(loginState);

    const setEmail = (email) => {
        setLoginInfo((prevState) => ({ ...prevState, email }));
    };

    const setPassword = (password) => {
        setLoginInfo((prevState) => ({ ...prevState, password }));
    };

    const setInvalidEmail = (value) => {
        setLoginInfo((prevState) => ({ ...prevState, invalidEmail: value }));
    };

    const setInvalidPassword = (value) => {
        setLoginInfo((prevState) => ({ ...prevState, invalidPassword: value }));
    };

    const setUserId = (value) => {
        setLoginInfo((prevState) => ({ ...prevState, userId: value }));
    };

    const setLoginError = (value) => {
        setLoginInfo((prevState) => ({ ...prevState, loginError: value }));
    };

    const setLoginStatus = (value) => {
        setLoginInfo((prevState) => ({ ...prevState, login_status: value }));
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[\w.-]+@[\w.-]+\.\w+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async () => {
        setInvalidEmail(false);
        setInvalidPassword(false);
        setLoginError(false);
        setLoginStatus(false);

        if (!isValidEmail(currentState.email)) {
            setInvalidEmail(true);
            if (!currentState.password) {
                setInvalidPassword(true);
            }
            return;
        }

        if (!currentState.password) {
            setInvalidPassword(true);
            return;
        }

        const requestData = {
            email: currentState.email,
            password: currentState.password,
        };

        const axiosConfig = {
            headers: {
                "x-cors-api-key": PROXY_KEY,
            },
        };

        try {
            const response = await axios.post(`${BASE_URL}/users/login`, requestData, axiosConfig);
            const accessToken = response.data.accessToken;
            const refreshToken = response.data.refreshToken;
            setUserId(response.data.userId);
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
            setLoginStatus(true);
            return true;
        } catch (error) {
            console.error("로그인 실패:", error);
            setLoginError(true);
            if (error.response.status === 401) {
                const refreshToken = localStorage.getItem("refreshToken");
                if (refreshToken) {
                    try {
                        // 리프레쉬토큰을 사용하여 새로운 Access Token 발급 요청
                        const refreshResponse = await axios.post(`${BASE_URL}/users/login`, refreshToken, axiosConfig);
                        const newAccessToken = refreshResponse.data.token;
                        localStorage.setItem("accessToken", newAccessToken);
                        axios.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
                        const retryRequestData = {
                            email: currentState.email,
                            password: currentState.password,
                        };
                        const retryResponse = await axios.post(
                            `${BASE_URL}/users/login`,
                            retryRequestData,
                            axiosConfig,
                        );
                        setLoginError(false);
                        setLoginStatus(true);
                        return true;
                    } catch (refreshError) {
                        console.error("Refresh token error:", refreshError);
                        setLoginError(true);
                        return false;
                    }
                } else {
                    // Refresh Token이 없는 경우 로그아웃 처리(라우팅으로 로그인 화면으로)
                    console.log("No refresh token available");
                    setLoginError(true);
                    return false;
                }
            }
        }
    };

    return {
        email: loginInfo.email,
        password: loginInfo.password,
        setEmail,
        setPassword,
        handleSubmit,
        setInvalidEmail,
        setInvalidPassword,
        loginError: loginInfo.loginError,
        setLoginError,
        setLoginStatus,
        userId: loginInfo.userId,
        invalidEmail: loginInfo.invalidEmail,
        invalidPassword: loginInfo.invalidPassword,
        login_status: loginInfo.login_status,
    };
}
