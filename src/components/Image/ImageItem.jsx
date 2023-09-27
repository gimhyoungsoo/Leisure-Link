import Modal from "../Common/Modal"
import ButtonBookmark from "../IconButtons/ButtonBookmark"
import ButtonRecommend from "../IconButtons/ButtonRecommend";
import styles from "./ImageItem.module.css";


function ImageItem({ data, isMarked }) {
    const handleClickThumbnail = () => {
        //썸네일을 클릭하면 특정 게시글 컴포넌트로 모달 띄움
        // 그때 data를 전달하면 됨
    };

    return (
        <div className={styles.container}>
            <figure className={styles.figure}>
                <Modal postId={data.postId} type="postView">
                    <img className={styles.fig_img} onClick={handleClickThumbnail} src={data.thumbnail} alt={``} />
                </Modal>
                <figcaption className={styles.figcaption}>
                    <div>
                        <div>
                            <ButtonRecommend postId={data.postId} isMarked={isMarked.recommend} />
                        </div>
                        <div>
                            <ButtonBookmark postId={data.postId} isMarked={isMarked.bookmark} />
                        </div>
                        {/* <div>*위치*</div> */}
                    </div>
                </figcaption>
            </figure>
        </div>
    );
}
export default ImageItem;
