import React, { useState } from 'react';
import { useParams } from 'react-router-dom'; // useParams 추가
import RealHeader from '../RealHeader'; // RealHeader로 변경
import Footer from '../Footer';
import { Button as MuiButton, Box, Typography, TextField } from '@mui/material';
import './CardCancellation.css'; // 스타일 시트 필요에 따라 추가
import axios from 'axios'; // Axios 추가

const apiUrl = process.env.REACT_APP_API_URL;

const CardCancellation = () => {
    const { userno } = useParams(); // useParams로 userno 받아오기
    const [isCancelled, setIsCancelled] = useState(false); // 카드 해지 상태 (기본값은 해지되지 않은 상태)
    const [isPasswordPrompt, setIsPasswordPrompt] = useState(false); // 비밀번호 입력 폼 표시 여부
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleCancelCard = () => {
        setIsPasswordPrompt(true); // 비밀번호 입력 폼을 표시
    };

    const handlePasswordSubmit = async () => {
        if (password !== confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            setSuccess('');
            return;
        }

        try {
            const response = await axios.post(`${apiUrl}/api/cancelcard/${userno}`, {
                currentPassword: password
            });

            setSuccess(response.data);
            setError('');
            setIsCancelled(true); // 카드 상태를 해지된 상태로 설정
            setIsPasswordPrompt(false); // 비밀번호 입력 폼 숨김

        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data);
            } else {
                setError('카드 해지에 실패했습니다.');
            }
            setSuccess('');
        }
    };

    return (
        <div className="CardCancellation">
            <RealHeader /> {/* RealHeader로 변경 */}
            <div className="content">
                <h2 style={{ textAlign: 'center', marginTop: '20px' }}>카드 해지 신청</h2>
                <div className="cancellation_container">
                    <Typography sx={{ textAlign: 'center', mb: 2 }}>
                        {isCancelled ? '카드가 해지된 상태입니다.' : '카드 해지 신청을 할 수 있습니다.'}
                    </Typography>

                    {!isCancelled && !isPasswordPrompt && (
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
                                onClick={handleCancelCard}
                            >
                                카드 해지 신청
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
                                inputProps={{ maxLength: 4 }} // 비밀번호 최대 길이 4글자 제한
                            />
                            <TextField
                                label="비밀번호 확인"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                sx={{ mb: 2, width: '100%' }}
                                inputProps={{ maxLength: 4 }} // 비밀번호 확인 최대 길이 4글자 제한
                            />
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
                                onClick={handlePasswordSubmit}
                            >
                                확인
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

export default CardCancellation;
