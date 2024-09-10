import React, { useState, useEffect } from 'react';
import RealHeader from '../RealHeader';  // RealHeader로 변경
import Footer from '../Footer';
import { Button as MuiButton, Box, Typography } from '@mui/material';
import axios from 'axios';  // Axios 추가
import './CardLostReportCancellation.css'; // 스타일 시트 필요에 따라 추가
import Swal from 'sweetalert2';

const apiUrl = process.env.REACT_APP_API_URL;

const CardLostReportCancellation = () => {
    const [isReported, setIsReported] = useState(false); // 카드 분실 신고 상태
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    
    // 사용자 번호를 URL에서 가져오는 방법
    const userno = 1; // 예시로 직접 값을 지정 (실제 사용시에는 useParams()로 변경)

    useEffect(() => {
        const checkReportStatus = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/cardstatus/${userno}`);
                const cardStatus = response.data; // 카드 상태를 받아오는 예시
                setIsReported(cardStatus === 2 || cardStatus === 4); // 상태가 2 또는 4면 true
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
                setSuccess('카드 분실 신고가 성공적으로 해지되었습니다.');
                setError('');
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data);
            } else {
                setError('비밀번호가 일치 하지 않습니다.');
            }
            setSuccess('');
        }
    };

    return (
        <div className="CardLostReportCancellation">
            <RealHeader /> {/* RealHeader로 변경 */}
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

                    {success && (
                        <Typography sx={{ mt: 2, color: 'green', textAlign: 'center' }}>
                            {success}
                        </Typography>
                    )}
                    {error && (
                        <Typography sx={{ mt: 2, color: 'red', textAlign: 'center' }}>
                            {error}
                        </Typography>
                    )}
                </div>
            </div>
            <Footer /> {/* 푸터를 페이지 하단에 추가 */}
        </div>
    );
};

export default CardLostReportCancellation;
