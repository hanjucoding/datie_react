import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ResponsiveAppBar from '../RealHeader';
import Footer from '../Footer';
import { TextField, Button as MuiButton, Box, Typography } from '@mui/material';
import axios from 'axios';
import './CardPasswordChange.css';

const apiUrl = process.env.REACT_APP_API_URL;

const CardPasswordChange = () => {
    const { userno } = useParams();
    const navigate = useNavigate();

    // State 관리
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // 비밀번호 변경 처리 함수
    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            setError('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const response = await axios.post(`${apiUrl}/api/changepassword/${userno}`, {
                userno,
                currentPassword,
                newPassword,
            });

            setSuccess('비밀번호가 성공적으로 변경되었습니다.');
            setError('');

            // 비밀번호 변경 성공 시, 프로필 페이지로 이동
            navigate(`/view-profile/${userno}`);
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data);
            } else {
                setError('비밀번호 변경에 실패했습니다.');
            }
        }
    };

    return (
        <div className="CardPasswordChange">
            <ResponsiveAppBar /> {/* ResponsiveAppBar 사용 */}
            <div className="content">
                <h2 style={{ textAlign: 'center', marginTop: '20px' }}>카드 비밀번호 변경</h2>
                <div className="password_change_container">
                    <TextField
                        id="currentPassword"
                        label="현재 비밀번호"
                        variant="standard"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        inputProps={{ maxLength: 4 }} // 입력 길이 제한
                        sx={{ mt: 2, width: '100%' }}
                    />
                    <TextField
                        id="newPassword"
                        label="새 비밀번호"
                        variant="standard"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        inputProps={{ maxLength: 4 }} // 입력 길이 제한
                        sx={{ mt: 2, width: '100%' }}
                    />
                    <TextField
                        id="confirmPassword"
                        label="새 비밀번호 확인"
                        variant="standard"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        inputProps={{ maxLength: 4 }} // 입력 길이 제한
                        sx={{ mt: 2, width: '100%' }}
                    />
                    {error && (
                        <Typography sx={{ mt: 2, color: 'red', textAlign: 'center' }}>
                            {error}
                        </Typography>
                    )}
                    {success && (
                        <Typography sx={{ mt: 2, color: 'green', textAlign: 'center' }}>
                            {success}
                        </Typography>
                    )}
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
                            onClick={handlePasswordChange}
                        >
                            비밀번호 변경
                        </MuiButton>
                    </Box>
                </div>
            </div>
            <Footer className="Footer" /> {/* Footer가 content 뒤에 위치 */}
        </div>
    );
};

export default CardPasswordChange;
