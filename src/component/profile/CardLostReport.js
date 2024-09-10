import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RealHeader from '../RealHeader';
import Footer from '../Footer';
import { Button as MuiButton, Box, Typography, TextField } from '@mui/material';
import './CardLostReport.css';
import axios from 'axios';
import Swal from 'sweetalert2';

const apiUrl = process.env.REACT_APP_API_URL;

const CardLostReport = () => {
    const { userno } = useParams();
    const navigate = useNavigate();
    const [isReported, setIsReported] = useState(false);
    const [isPasswordPrompt, setIsPasswordPrompt] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleReport = () => {
        setIsPasswordPrompt(true);
    };

    const handlePasswordSubmit = async () => {
        if (password !== confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const response = await axios.post(`${apiUrl}/api/lostcard/${userno}`, {
                currentPassword: password,
            });

            // Swal 팝업을 띄우고 팝업 확인 후 setIsReported(true) 실행
            Swal.fire({
                icon: 'success',
                title: '성공',
                text: '카드 분실 신고가 완료되었습니다.',
                confirmButtonText: '확인',
            }).then(() => {
                // 팝업 확인 후 분실 신고 상태를 업데이트
                setIsReported(true);
                navigate(`/view-profile/${userno}`); // view-profile/userno 경로로 이동
            });
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data);
            } else {
                setError('카드 분실 신고에 실패했습니다.');
            }
        }
    };

    return (
        <div className="CardLostReport">
            <RealHeader />
            <div className="content">
                <h2 style={{ textAlign: 'center', marginTop: '20px' }}>카드 분실 신고</h2>
                <div className="report_container">
                    {!isReported ? (
                        <>
                            <Typography sx={{ textAlign: 'center', mb: 2 }}>
                                카드 분실 신고를 접수할 수 있습니다.
                            </Typography>

                            {!isPasswordPrompt && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                    <MuiButton
                                        variant="contained"
                                        sx={{
                                            backgroundColor: 'rgb(148, 160, 227)',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: 'rgb(120, 140, 200)',
                                            },
                                            width: '150px',
                                        }}
                                        onClick={handleReport}
                                    >
                                        분실 신고
                                    </MuiButton>
                                </Box>
                            )}

                            {isPasswordPrompt && (
                                <Box sx={{ mt: 2, width: '100%', textAlign: 'center' }}>
                                    <TextField
                                        label="현재 비밀번호"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        sx={{ mb: 2, width: '100%' }}
                                        inputProps={{ maxLength: 4 }}
                                    />
                                    <TextField
                                        label="비밀번호 확인"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        sx={{ mb: 2, width: '100%' }}
                                        inputProps={{ maxLength: 4 }}
                                    />
                                    <MuiButton
                                        variant="contained"
                                        sx={{
                                            backgroundColor: 'rgb(148, 160, 227)',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: 'rgb(120, 140, 200)',
                                            },
                                            width: '150px',
                                        }}
                                        onClick={handlePasswordSubmit}
                                    >
                                        확인
                                    </MuiButton>
                                </Box>
                            )}
                        </>
                    ) : (
                        <Typography sx={{ textAlign: 'center', mb: 2 }}>
                            카드가 분실 신고된 상태입니다.
                        </Typography>
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

export default CardLostReport;
