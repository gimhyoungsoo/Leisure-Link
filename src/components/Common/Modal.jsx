import { createPortal } from "react-dom";
import { modalState } from "../../util/recoil/atom";
import { useSetRecoilState } from "recoil";
import PostDetail from "../Posts/Contents";
import UploadForm from "../Posts/UploadForm";
import styles from "./Modal.module.css";
import { useState } from "react";

/**
 * @param {object} param
 * @param {number} [param.postId]
 * @param {string} param.type
 * @param {JSX.Element} param.children
 */
function Modal({ postId, type, children }) {
    const setModalRecoilState = useSetRecoilState(modalState);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleOutterClick = (e) => {
        console.log(e);
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    const renderContent = () => {
        let content;
        switch (type) {
            case "postView":
                content = <PostDetail postId={postId} onClose={closeModal} />;
                break;
            case "upload":
                content = <UploadForm onClose={closeModal} />;
                break;
            default:
                return null;
        }
        return (
            <div className={styles.modal_outter} onClick={handleOutterClick}>
                {content}
            </div>
        );
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
        setModalRecoilState(true);
    };

    return (
        <>
            <div onClick={handleOpenModal}>{children}</div>
            {isModalOpen && createPortal(renderContent(), document.body)}
        </>
    );
}

export default Modal;
