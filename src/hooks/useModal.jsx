import { modalState } from "../util/recoil/atom";
import { useRecoilState } from "recoil";
import UploadForm from "../components/Posts/UploadForm";
import Contents from "../components/Posts/Contents";
/**
 * @param {object} param
 * @param {number} [param.postId]
 * @param {string} param.type
 * @param {JSX.Element} param.children
 */
export function useModal() {
    const [modalRecoilState, setModalRecoilState] = useRecoilState(modalState);

    function openModal(type, postId) {
        console.log(type, postId);
        let contents;
        switch (type) {
            case "upload":
                contents = <UploadForm />;
                break;
            case "post":
                contents = <Contents postId={postId} />;
                break;
            default:
                return null;
        }
        setModalRecoilState({ isOpen: true, modalContents: contents });
    }

    const closeModal = () => {
        setModalRecoilState({ isOpen: false, modalContents: null });
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    return { modalRecoilState, handleBackdropClick, openModal };
}
