import * as React from 'react';
import './Editor.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rating } from '@mui/material';
import Button from '@mui/material/Button';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

const Editor = ({ diaryNo, companyName, rate, review, onSubmit }) => {
    const [value, setValue] = useState(rate || 0);
    const [reviewText, setReviewText] = useState(review || '');
    const [selectedImages, setSelectedImages] = useState([]);
    const [fadingImageIndex, setFadingImageIndex] = useState(null); // 상태 추가
    const fileInputRef = React.useRef(null);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedImages((prevImages) => [...prevImages, ...files]);
    };

    const handleImageUpload = async () => {
        const imageFormData = new FormData();
        imageFormData.append('diaryNo', diaryNo);

        selectedImages.forEach((image) => {
            imageFormData.append('images', image);
        });

        try {
            const response = await axios.post(
                `${apiUrl}/api/diary/imageUpload`,
                imageFormData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            );

            if (response.status !== 200) {
                throw new Error('Failed to upload images');
            }
        } catch (error) {
            console.error('Error uploading images:', error);
            throw error;
        }
    };

    const handleSubmit = async () => {
        try {
            // 이미지 업로드 요청
            await handleImageUpload();

            // 나머지 폼 데이터 전송
            const formData = new FormData();
            formData.append('diaryNo', diaryNo);
            formData.append('rate', value);
            formData.append('review', reviewText);

            const response = await axios.post(
                `${apiUrl}/api/diary/upload`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            );

            if (response.status === 200) {
                onSubmit({
                    diaryNo,
                    companyName,
                    rate: value,
                    review: reviewText,
                });
                // 알림 표시
                alert('작성이 완료되었습니다');
                // navigate를 사용하여 페이지를 새로 고침
                navigate(0); // 페이지를 새로 고침
            }
        } catch (error) {
            console.error('Error uploading data:', error);
        }
    };

    const handleImageClick = (index) => {
        setFadingImageIndex(index);

        // 애니메이션 후 이미지 삭제
        setTimeout(() => {
            setSelectedImages((prevImages) =>
                prevImages.filter((_, i) => i !== index),
            );
            setFadingImageIndex(null);
        }, 500); // 애니메이션과 동일한 시간
    };

    const handleFileInputClick = () => {
        fileInputRef.current.click();
    };

    return (
        <>
            <div className="Editor">
                <div className="editor_section_head">
                    <h1>{companyName}</h1>
                </div>
                <div className="editor_section">
                    <Rating
                        name="simple-controlled"
                        size="large"
                        value={value}
                        onChange={(event, newValue) => {
                            setValue(newValue);
                        }}
                    />
                </div>
                <div className="editor_section">
                    <div className="input_wrapper">
                        <textarea
                            placeholder="한줄평을 남겨주세요"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                        />
                    </div>
                </div>
                <div className="editor_section">
                    <button
                        type="button"
                        className="upload_button"
                        onClick={handleFileInputClick}
                    >
                        사진 추가+
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                    />
                    <div className="image_preview">
                        {selectedImages.length > 0 &&
                            selectedImages.map((image, index) => (
                                <div
                                    key={index}
                                    className="image_container"
                                    onClick={() => handleImageClick(index)}
                                >
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={`selected ${index}`}
                                        className={`preview_image ${
                                            fadingImageIndex === index
                                                ? 'fade-out'
                                                : ''
                                        }`}
                                    />
                                </div>
                            ))}
                    </div>
                </div>
                <div className="editor_section bottom_section">
                    <Button
                        variant="outlined"
                        sx={{ fontFamily: '"Gamja Flower", sans-serif' }}
                        onClick={handleSubmit}
                    >
                        작성 완료
                    </Button>
                </div>
            </div>
        </>
    );
};

export default Editor;
