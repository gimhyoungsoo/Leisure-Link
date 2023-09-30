import styles from "./Modal.module.css";
import { useModal } from "../../hooks/useModal";

function Modal() {
    const { modalRecoilState, handleBackdropClick } = useModal();
    return (
        <>
            {modalRecoilState.isOpen && (
                <div className={styles.modal_outter} onClick={handleBackdropClick}>
                    <div className={styles.modal_window}>{modalRecoilState.modalContents}</div>
                </div>
            )}
        </>
    );
}

export default Modal;
