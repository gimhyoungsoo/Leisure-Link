import { useRecoilState } from 'recoil';
import axios from 'axios';
import { loginState } from '../recoil/atom';

const BASE_URL = process.env.REACT_APP_API_URL;
const PROXY_KEY = process.env.REACT_APP_PROXY_KEY

export function LogoutActions() {
  const [loginInfo, setLoginInfo] = useRecoilState(loginState);
  const accessToken = localStorage.getItem('accessToken');

  const handleLogout = async () => {
    try {
        const response = await axios.post(`${BASE_URL}/users/logout`,
          { email:loginInfo.email },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "x-cors-api-key": PROXY_KEY,
            },
          }
        );
  
        // 로그아웃 요청이 성공하면 로컬 스토리지에서 토큰 제거 및 사용자 정보 초기화
        if (response.status === 200) {
          console.log('로그아웃 성공!');  
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.reload();
        }

      setLoginInfo({
        email: '',
        password: '',
        userId: null,
        loginError: false,
        login_status: false,
        invalidEmail: false,
        invalidPassword: false,
      });
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return {
    handleLogout,
  };
}