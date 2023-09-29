import Contents from "../Posts/Contents";
import ButtonBookmark from "../IconButtons/ButtonBookmark";
import ButtonRecommend from "../IconButtons/ButtonRecommend";
import styles from "./ImageItem.module.css";
import { useModal } from "../../hooks/useModal";

function ImageItem({ data, isMarked }) {
    const {openModal} = useModal();

    const handleThumbnailClick = () => {
        openModal("post", data.postId);
    };

    return (
        <div className={styles.container}>
            <figure className={styles.figure}>
                <img className={styles.fig_img} onClick={handleThumbnailClick} src={data.thumbnail} alt={``} />
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
