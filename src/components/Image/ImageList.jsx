import ImageItem from "./ImageItem";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { modalState } from "../../util/recoil/atom";
import { loginState } from "../../util/state/LoginState";
import styles from "./ImageList.module.css";

const BASE_URL = process.env.REACT_APP_API_URL;

function ImageList({ url }) {
    const loginInfo = useRecoilValue(loginState);
    const [isLogin, setIsLogin] = useState(false);
    const [userId, setUserId] = useState(null);
    const [pageNum, setPageNum] = useState(1);
    const [columnState, setColumnState] = useState({ first: [], second: [], third: [] });
    const [bookmarkedPostId, setBookmarkedPostId] = useState([]);
    const [recommendedPostId, setRecommendeddPostId] = useState([]);
    const [targetRef, isIntersecting] = useIntersectionObserver();
    const modalRecoilValue = useRecoilValue(modalState);

    useEffect(() => {
        if (loginInfo.login_status === true) {
            setIsLogin(true);
            setUserId(loginInfo.userId);
        }
        getApiData();
    }, []);

    useEffect(() => {
        if (isLogin) {
            getRecommmend();
            getBookmark();
        }
    }, [isLogin]);
    useEffect(() => {
        if (isIntersecting) {
            getApiData();
        }
    }, [isIntersecting]);
    useEffect(()=>{
        if (isLogin && !modalRecoilValue.isOpen) {
            console.log("추천,북마크 재렌더링");
            getRecommmend();
            getBookmark();
        }
    },[modalRecoilValue])


    // 추천 get 통신
    const getRecommmend = async () => {
        try {
            // ``
            const response = await axios.get(`${BASE_URL}/recommend/${userId}`);
            const data = await response.data;

            setRecommendeddPostId(
                data.map((el) => {
                    return el.postId;
                }),
            );
        } catch (error) {
            console.error(error.code, "추천 정보 get 실패");
        }
    };

    //북마크 get 통신
    const getBookmark = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/bookmarks/${userId}`);
            const data = await response.data;

            setBookmarkedPostId(data.map((el) => el.post_id));
        } catch (error) {
            console.error(error.code, "북마크 정보 get 실패");
        }
    };

    const getApiData = async () => {
        try {
            const config = {
                params: {
                    page: pageNum,
                },
            };
            const response = await axios.get(url, config);
            const targetObj = response.data;
            DistributeImage(targetObj.data);
            setPageNum((prev) => prev + 1);
        } catch (error) {
            console.error("데이터를 불러오는 중 오류 발생:", error);
            // 오류 토스트 컴포넌트를 여기에 추가할 수 있습니다.
        }
    };

    //이미지 분배 로직
    const DistributeImage = (fetchedData) => {
        const stock = { first: [], second: [], third: [] };
        fetchedData.forEach((el, idx) => {
            if (idx % 3 === 0) {
                stock.first.push(el);
            } else if (idx % 3 === 1) {
                stock.second.push(el);
            } else {
                stock.third.push(el);
            }
        });
        setColumnState((prevState) => {
            return {
                first: [...prevState.first, ...stock.first],
                second: [...prevState.second, ...stock.second],
                third: [...prevState.third, ...stock.third],
            };
        });
    };

    // ImageItem 컴포넌트 렌더링
    function RenderImageItem({ column }) {
        return (
            <div className={styles.column_grid}>
                {column.map((el) => {
                    return (
                        <ImageItem
                            key={el.postId}
                            data={el}
                            isMarked={{
                                recommend: recommendedPostId.includes(Number(el.postId)),
                                bookmark: bookmarkedPostId.includes(Number(el.postId)),
                            }}
                        />
                    );
                })}
            </div>
        );
    }

    return (
        <>
            <section className={styles.container}>
                <div className={styles.top_grid}>
                    {columnState.first.length !== 0 && <RenderImageItem column={columnState.first} />}
                    {columnState.second.length !== 0 && <RenderImageItem column={columnState.second} />}
                    {columnState.third.length !== 0 && <RenderImageItem column={columnState.third} />}
                </div>
            </section>
            <div className={styles.sentry} ref={targetRef}></div>
        </>
    );
}
export default ImageList;
