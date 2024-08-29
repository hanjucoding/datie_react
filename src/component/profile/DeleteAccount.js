import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import { Button as MuiButton, Typography, Box, TextField } from '@mui/material';
import axios from 'axios';
import '../../index.css';
import './ViewProfile.css';

const DeleteAccount = () => {
    const { userno } = useParams(); // URL 파라미터에서 userno 추출
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [hasCard, setHasCard] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:8090/api/profile/${userno}`);
                setUser(response.data);
                setHasCard(response.data.cardno !== 0); // cardno가 0이 아닌 경우 카드가 있는 것으로 간주
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('사용자 정보를 가져오는 데 실패했습니다.');
            }
        };

        fetchUserData();
    }, [userno]);

    const handleDeleteAccount = async () => {
        if (user) {
            if (!hasCard) {
                // 카드가 없는 경우 회원 탈퇴 진행
                if (window.confirm('정말로 회원 탈퇴를 하시겠습니까?')) {
                    try {
                        await axios.post(`http://localhost:8090/api/delete/${userno}`, {
                            userno: userno,
                            cardno: 0, // cardno가 0이면 회원 탈퇴 로직으로 간주
                            status: 0,
                            currentPassword: currentPassword
                        });
                        alert('회원 탈퇴가 완료되었습니다.');
                        navigate('/login');
                    } catch (error) {
                        console.error('Error deleting account:', error);
                        setError('회원 탈퇴에 실패했습니다.');
                    }
                }
            } else {
                // 카드가 있는 경우 카드 탈퇴 페이지로 이동
                navigate(`/card-cancellation/${userno}`);
            }
        }
    };

    return (
        <div className="DeleteAccount">
            <Header title="회원 탈퇴" />
            <div className="delete_account_container">
                <Box sx={{ mt: 4, width: '100%', textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontFamily: 'Gamja Flower, cursive' }}>
                        {hasCard ? '카드 해지 또는 회원 탈퇴' : '회원 탈퇴'}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        {hasCard
                            ? '카드가 등록되어 있습니다. 먼저 카드 해지를 진행하시겠습니까?'
                            : '회원 탈퇴를 진행하시겠습니까? 이 작업은 복구할 수 없습니다.'}
                    </Typography>
                    <TextField
                        type="password"
                        label="현재 비밀번호"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <Box sx={{ mt: 4 }}>
                        <MuiButton
                            variant="contained"
                            color="error"
                            sx={{
                                backgroundColor: "rgb(148, 160, 227)",
                                "&:hover": {
                                    backgroundColor: "rgb(120, 140, 200)",
                                },
                            }}
                            onClick={handleDeleteAccount}
                        >
                            {hasCard ? '카드 해지 페이지로 이동' : '회원 탈퇴'}
                        </MuiButton>
                    </Box>
                    {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
                </Box>
            </div>
            <Footer />
        </div>
    );
};

export default DeleteAccount;
