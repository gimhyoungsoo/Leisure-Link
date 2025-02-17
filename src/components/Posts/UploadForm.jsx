import React, { useRef, useState, useEffect } from "react";
import styles from "./UploadForm.module.css";
import axios from "axios";
import { BsTrash3Fill } from "react-icons/bs";
import { useRecoilValue } from "recoil";

import { loginState } from "../../util/recoil/atom";
import { useModal } from "../../hooks/useModal";

const BASE_URL = process.env.REACT_APP_API_URL;
const PROXY_KEY = process.env.REACT_APP_PROXY_KEY;

export default function UploadForm() {
    const { closeModal } = useModal();
    const [image, setImage] = useState(null);
    const [imageObjectURL, setImageObjectURL] = useState(null);

    const [place, setPlace] = useState("");
    const [description, setDescription] = useState("");
    const initialTags = [];
    const [tags, setTags] = useState(initialTags);
    const [addressPermission, setAddressPermission] = useState(false);
    const [commentPermission, setCommentPermission] = useState(false);

    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadError, setUploadError] = useState("");

    // 로그인 상태
    const [currentUserId, setCurrentUserId] = useState(null);

    const loginInfo = useRecoilValue(loginState);

    useEffect(() => {
        if (loginInfo.login_status && loginInfo.userId) {
            setCurrentUserId(loginInfo.userId);
        }
    }, []); // loginInfo 객체가 변경될 때 useEffect를 실행

    const removeTags = (indexToRemove) => {
        const filter = tags.filter((el, index) => index !== indexToRemove);
        setTags(filter);
    };

    const addTags = (event) => {
        event.preventDefault();
        if (event.key.toLowerCase() === "enter") {
            const inputVal = event.target.value.trim();
            if (inputVal !== "" && !tags.includes(inputVal)) {
                setTags((prev) => [...prev, inputVal]);
                event.target.value = "";
            }
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const objectURL = URL.createObjectURL(file);

            // 이미지를 미리 로드하여 가로 너비를 확인
            const img = new Image();
            img.src = objectURL;

            img.onload = () => {
                const minWidth = 400; // 최소 가로 너비 (수정)

                let newWidth = img.width;
                let newHeight = img.height;

                // 이미지 크기가 최소 너비보다 작은 경우 최소 가로 너비로 설정 (수정)
                if (img.width < minWidth) {
                    newWidth = minWidth;
                    newHeight = (img.height * minWidth) / img.width;
                }

                // 이미지를 미리보기에 설정
                setImage(file);
                const objectURL = URL.createObjectURL(file);
                setImageObjectURL(objectURL);
            };
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (image) {
            formData.append("postImage", image);
        }
        const json = JSON.stringify({
            // 데이터를 추가
            postTitle: place,
            postCaption: description,
            tags: tags,
            postAddress: addressPermission,
            postCommentPermission: commentPermission,
            userId: currentUserId,
        });
        const blob = new Blob([json], { type: "application/json" });
        formData.append("data", blob);

        const Alldata = Object.fromEntries(formData);

        setUploading(true);

        try {
            const axiosConfig = {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "x-cors-api-key": PROXY_KEY,
                },
            };

            const response = await axios.post(`${BASE_URL}/posts`, formData, axiosConfig);
            setUploadSuccess(true);
            setImage(null);
            setPlace("");
            setDescription("");
            setTags([]);
            closeModal();
            alert("업로드에 성공했습니다!");
        } catch (error) {
            setUploadError("죄송합니다. 문제가 발생했습니다.");
            console.log(uploadError);
            alert(
                "죄송합니다. 문제가 발생했습니다. 잠시 후 다시 시도해주시거나, 페이지를 새로 고침하여 다시 입력해주세요.",
            );
        } finally {
            setUploading(false);
        }
    };

    const fileInputRef = useRef(null);
    const handleClickUpload = () => {
        fileInputRef.current.click();
    };

    return (
        <>
            <form className={styles.form_container} onSubmit={handleSubmit}>
                <div className={styles.left_box}>
                    <label className={styles.image_section}>
                        <div className={styles.image_upload_label} onClick={handleClickUpload}>
                            {imageObjectURL ? (
                                <>
                                    <img src={imageObjectURL} alt="업로드된 사진" className={styles.image} />
                                    <button
                                        type="button"
                                        className={styles.delete_button}
                                        onClick={() => {
                                            setImage(null);
                                            setImageObjectURL(null);
                                        }}
                                    >
                                        <BsTrash3Fill />
                                    </button>
                                </>
                            ) : (
                                <div className={styles.image_placeholder}>
                                    최고의 사진을 올려주세요
                                    <div className={styles.image_upload_overlay}>클릭하여 업로드</div>
                                </div>
                            )}
                        </div>
                    </label>
                    <input
                        name="image"
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                        className={styles.image_input}
                        ref={fileInputRef}
                        required
                    />
                </div>

                <div className={styles.right_box}>
                    <div className={styles.input_section}>
                        <input
                            placeholder="사진 속 장소는 어디인가요?"
                            type="text"
                            id="place"
                            value={place}
                            onChange={(e) => setPlace(e.target.value)}
                            required
                            className={styles.input_place}
                        />
                        <input
                            placeholder="얼마나 멋진 장소인지 설명해주세요!"
                            type="text"
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className={styles.input_description}
                        />
                        <div className={styles.tag_container}>
                            <ul className={styles.tags}>
                                {tags.map((tag, index) => (
                                    <li key={index} className={styles.tag}>
                                        <span className={styles.tag_title}>{tag}</span>
                                        <span
                                            className={styles.tag_close_icon}
                                            onClick={() => removeTags(index)}
                                        ></span>
                                    </li>
                                ))}
                            </ul>
                            <input
                                name="tagInput"
                                className={styles.tag_input}
                                type="text"
                                onKeyUp={(e) => addTags(e)}
                                placeholder="최대 3개까지 #태그를 입력해주세요 (예시) #바다"
                                onKeyPress={(e) => {
                                    e.key === "Enter" && e.preventDefault();
                                }}
                            />
                        </div>
                    </div>
                    <div className={styles.confirm_section}>
                        <button
                            type="submit"
                            className={styles.submit_button}
                            disabled={uploading} // 업로드 중일 때 버튼 비활성화
                        >
                            {uploading ? "업로드 중..." : "게시하기"}
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
}
