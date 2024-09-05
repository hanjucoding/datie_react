import './DiaryItem.css';
import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { Rating } from '@mui/material';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 기본 이미지 URL
const DEFAULT_IMAGE_URL = 'http://localhost:8090/api/diary/image/default.png';
const apiUrl = process.env.REACT_APP_API_URL;

const DiaryItem = ({
    diaryNo,
    companyName,
    rate,
    review,
    uploadOrg,
    uploadReal,
}) => {
    const navigate = useNavigate();
    const [openEditorModal, setOpenEditorModal] = useState(false);
    const [openImageModal, setOpenImageModal] = useState(false);
    const [imageUrls, setImageUrls] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleOpenEditorModal = () => setOpenEditorModal(true);
    const handleCloseEditorModal = () => setOpenEditorModal(false);

    const handleOpenImageModal = () => setOpenImageModal(true);
    const handleCloseImageModal = () => setOpenImageModal(false);

    useEffect(() => {
        // 이미지 URL 리스트를 가져오기
        axios
            .get(`${apiUrl}/api/diary/images/${diaryNo}`)
            .then((response) => {
                setImageUrls(response.data);
                if (response.data.length > 0) {
                    setCurrentIndex(0); // 첫 번째 이미지를 기본으로 설정
                }
            })
            .catch((error) => {
                console.error('Error fetching image URLs:', error);
            });
    }, [diaryNo]);

    const goToPreviousImage = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1,
        );
    };

    const goToNextImage = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1,
        );
    };

    return (
        <div className="DiaryItem">
            <div className="img_section">
                <img
                    src={
                        imageUrls.length > 0 ? imageUrls[0] : DEFAULT_IMAGE_URL
                    }
                    alt="Diary"
                    onClick={handleOpenImageModal}
                    style={{ cursor: 'pointer' }}
                />
            </div>
            <div className="info_section">
                <div>
                    <Rating
                        name={rate ? 'conditional-read-only' : 'no-value'}
                        value={rate || null}
                        size="small"
                        readOnly={true}
                    />
                </div>
                <div className="date_wrapper">{companyName}</div>

                <div
                    className="content_wrapper"
                    style={{ color: review ? 'black' : 'gray' }}
                >
                    {review || '이 장소에 대한 평가를 남겨주세요!'}
                </div>
            </div>

            {/* Image Gallery Modal 컴포넌트 */}
            <Modal
                open={openImageModal}
                onClose={handleCloseImageModal}
                aria-labelledby="image-modal-title"
                aria-describedby="image-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        maxHeight: '80%',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        overflow: 'hidden',
                    }}
                >
                    {imageUrls.length > 0 && (
                        <div className="image-slider">
                            <button
                                className="slider-button prev"
                                onClick={goToPreviousImage}
                            >
                                &lt;
                            </button>
                            <img
                                src={imageUrls[currentIndex]}
                                alt={`Diary ${currentIndex}`}
                                style={{ width: '100%', height: 'auto' }}
                            />
                            <button
                                className="slider-button next"
                                onClick={goToNextImage}
                            >
                                &gt;
                            </button>
                        </div>
                    )}
                </Box>
            </Modal>
        </div>
    );
};

export default React.memo(DiaryItem);
