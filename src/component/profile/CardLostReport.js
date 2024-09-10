import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useNavigate 추가
import RealHeader from '../RealHeader'; // RealHeader로 변경
import Footer from '../Footer';
import { Button as MuiButton, Box, Typography, TextField } from '@mui/material';
import './CardLostReport.css'; // 스타일 시트 필요에 따라 추가
import axios from 'axios'; // Axios 추가
import Swal from 'sweetalert2';

const apiUrl = process.env.REACT_APP_API_URL;

const CardLostReport = () => {
    const { userno } = useParams(); // useParams로 userno 받아오기
    const navigate = useNavigate(); // useNavigate 훅 사용
    const [isReported, setIsReported] = useState(false); // 카드 분실 신고 상태 (기본값은 신고되지 않은 상태)
    const [isPasswordPrompt, setIsPasswordPrompt] = useState(false); // 비밀번호 입력 폼 표시 여부
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleReport = () => {
        setIsPasswordPrompt(true); // 비밀번호 입력 폼을 표시
    };

    const handlePasswordSubmit = async () => {
        if (password !== confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            setSuccess('');
            return;
        }

        try {
            // API 호출 로직을 추가하여 카드 분실 신고를 처리합니다.
            const response = await axios.post(`${apiUrl}/api/lostcard/${userno}`, {
                currentPassword: password
            });

            setSuccess('카드 분실 신고가 성공적으로 접수되었습니다.');
            setError('');
            setIsReported(true); // 카드 상태를 신고된 상태로 설정
            setIsPasswordPrompt(false); // 비밀번호 입력 폼 숨김

            // 성공 후 리다이렉트
            Swal.fire({
                icon: 'success',
                title: '성공',
                text: '카드 분실 신고가 완료되었습니다.',
                confirmButtonText: '확인'
            }).then(() => {
                navigate(`/view-profile/${userno}`); // view-profile/userno 경로로 이동
            });

        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data);
            } else {
                setError('카드 분실 신고에 실패했습니다.');
            }
            setSuccess('');
        }
    };

    return (
        <div className="CardLostReport">
            <RealHeader /> {/* RealHeader로 변경 */}
            <div className="content">
                <h2 style={{ textAlign: 'center', marginTop: '20px' }}>카드 분실 신고</h2>
                <div className="report_container">
                    <Typography sx={{ textAlign: 'center', mb: 2 }}>
                        {isReported ? '카드가 분실 신고된 상태입니다.' : '카드 분실 신고를 접수할 수 있습니다.'}
                    </Typography>

                    {!isReported && !isPasswordPrompt && (
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

export default CardLostReport;
