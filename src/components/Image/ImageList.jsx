import ImageItem from "./ImageItem";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { loginState, modalState } from "../../util/recoil/atom";
import { useIconButtonAPI } from "../../hooks/useIconButtonAPI";
import styles from "./ImageList.module.css";

function ImageList({ url }) {
    const loginInfo = useRecoilValue(loginState);
    const [isLogin, setIsLogin] = useState(false);
    const [userId, setUserId] = useState(null);

    const modalRecoilValue = useRecoilValue(modalState);
    const [pageNum, setPageNum] = useState(1);
    const [targetRef, isIntersecting] = useIntersectionObserver();
    const [columnState, setColumnState] = useState({ first: [], second: [], third: [] });
    const { getRecommend, recommendedPostId, getBookmark, bookmarkedPostId } = useIconButtonAPI();

    useEffect(() => {
        if (loginInfo.login_status === true) {
            setIsLogin(true);
            setUserId(loginInfo.userId);
        }
        getImageData();
    }, []);

    useEffect(() => {
        if (isLogin) {
            getRecommend(userId);
            getBookmark(userId);
        }
    }, [isLogin]);

    useEffect(() => {
        if (isIntersecting) {
            getImageData();
        }
    }, [isIntersecting]);

    useEffect(() => {
        if (isLogin && !modalRecoilValue.isOpen) {
            //게시물 업로드나 삭제시 모달 닫힌 후의 메인페이지에 반영되어야 함
            getRecommend(userId);
            getBookmark(userId);
        }
    }, [modalRecoilValue]);

    const getImageData = async () => {
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
