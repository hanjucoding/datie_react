import React, { useState, useEffect } from 'react';
import RealHeader from '../RealHeader';
import Footer from '../Footer';
import { Button as MuiButton, Box, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // useNavigate 추가
import './CardLostReportCancellation.css';
import Swal from 'sweetalert2';

const apiUrl = process.env.REACT_APP_API_URL;

const CardLostReportCancellation = () => {
    const [isReported, setIsReported] = useState(false);
    const [error, setError] = useState('');
    
    const navigate = useNavigate(); // navigate 훅 사용

    const userno = 1; // 예시로 직접 값을 지정

    useEffect(() => {
        const checkReportStatus = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/cardstatus/${userno}`);
                const cardStatus = response.data;
                setIsReported(cardStatus === 2 || cardStatus === 4);
            } catch (error) {
                console.error('Error fetching card status:', error);
            }
        };

        checkReportStatus();
    }, [userno]);

    const handleCancelReport = async () => {
        if (!isReported) {
            setError('카드가 이미 분실 신고 해지되었습니다.');
            return;
        }

        try {
            const response = await axios.post(`${apiUrl}/api/cancelcard/${userno}`, {
                currentPassword: '' // 실제 비밀번호 입력 값을 받아야 함
            });

            if (response.data) {
                setIsReported(false); // 상태 업데이트: 신고 해지
                setError('');

                // Swal 팝업 메시지
                Swal.fire({
                    title: '성공',
                    text: '카드 분실 신고가 성공적으로 해지되었습니다.',
                    icon: 'success',
                    confirmButtonText: '확인'
                }).then(() => {
                    navigate('/view-profile/${userno}'); // 이동할 경로 설정
                });
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data);
            } else {
                setError('비밀번호가 일치 하지 않습니다.');
            }
        }
    };

    return (
        <div className="CardLostReportCancellation">
            <RealHeader />
            <div className="content">
                <h2 style={{ textAlign: 'center', marginTop: '20px' }}>카드 분실 신고 해지</h2>
                <div className="cancellation_container">
                    <Typography sx={{ textAlign: 'center', mb: 2 }}>
                        {isReported ? '현재 카드가 분실 신고된 상태입니다.' : '카드 분실 신고가 해지된 상태입니다.'}
                    </Typography>

                    {isReported && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <MuiButton
                                variant="contained"
                                sx={{
                                    backgroundColor: "rgb(148, 160, 227)",
                                    color: "white",
                                    "&:hover": {
                                        backgroundColor: "rgb(120, 140, 200)",
                                    },
                                    width: "150px"
                                }}
                                onClick={handleCancelReport}
                            >
                                분실 신고 해지
                            </MuiButton>
                        </Box>
                    )}

                    {error && (
                        <Typography sx={{ mt: 2, color: 'red', textAlign: 'center' }}>
                            {error}
                        </Typography>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CardLostReportCancellation;
