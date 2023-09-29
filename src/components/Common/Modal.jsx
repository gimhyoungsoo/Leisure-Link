import styles from "./Modal.module.css";
import { useModal } from "../../hooks/useModal";

function Modal() {
    const {modalRecoilState, handleBackdropClick} = useModal();
    return (
        <>
            {modalRecoilState.isOpen && (
                <div className={styles.modal_outter} onClick={handleBackdropClick}>
                    {modalRecoilState.modalContents}
                </div>
            )}
        </>
    );
}

export default Modal;
