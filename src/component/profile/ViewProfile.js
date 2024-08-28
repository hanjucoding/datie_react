import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import { Button as MuiButton, Typography, Box, Avatar } from '@mui/material';
import axios from 'axios';
import '../../index.css';
import './ViewProfile.css';

const ViewProfile = () => {
    const { userno } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profileImageUrl, setProfileImageUrl] = useState('/default-avatar.png');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null); // State for preview URL

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const url = `http://localhost:8090/api/profile?userno=${userno}`;
                const response = await axios.get(url);
                setUser(response.data);

                // Fetch profile image
                try {
                    const imageResponse = await axios.get(
                        `http://localhost:8090/api/profileImage/${userno}`,
                        { responseType: 'blob' },
                    );
                    const imageUrl = URL.createObjectURL(imageResponse.data);
                    setProfileImageUrl(imageUrl);
                } catch (imageError) {
                    // If fetching the image fails, set the default image URL
                    if (imageError.response?.status === 404) {
                        setProfileImageUrl('/default-avatar.png');
                    } else {
                        console.error(
                            'Error fetching profile image:',
                            imageError,
                        );
                        setProfileImageUrl('/default-avatar.png');
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('사용자 데이터를 가져오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userno]);

    useEffect(() => {
        if (selectedFile) {
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreviewUrl(objectUrl);

            // Clean up the object URL after the component is unmounted or file changes
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [selectedFile]);

    const handleEdit = () => { 
        navigate(`/edit-profile/${userno}`);
    };

    const handleCardPasswordChange = () => {
        navigate(`/changecardpassword/${userno}`);
    };

    const handleCardLostReport = () => {
        navigate(`/card-lost-report/${userno}`);
    };

    const handleCardCancellation = () => {
        navigate(`/card-cancellation/${userno}`);
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('정말로 회원 탈퇴를 하시겠습니까?')) {
            try {
                const deleteData = {
                    userno: userno,
                    cardno: 0, // 필요한 경우 다른 cardno 값
                    status: 0 // 필요한 경우 다른 status 값
                };
    
                await axios.post(`http://localhost:8090/api/delete/${userno}`, deleteData);
                alert('회원 탈퇴가 완료되었습니다.');
                navigate('/login');
            } catch (error) {
                console.error('Error deleting account:', error);
                alert('회원 탈퇴에 실패했습니다.');
            }
        }
    };
    
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleProfileUpload = async () => {
        if (!selectedFile) {
            alert('프로필 사진을 선택하세요.');
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('userno', userno);

        try {
            await axios.post(
                'http://localhost:8090/api/profileUpload',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } },
            );
            alert('프로필 사진이 성공적으로 업로드되었습니다.');
            window.location.reload(); // Refresh the page
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            alert('프로필 사진 업로드에 실패했습니다.');
        }
    };

    const handleCancel = () => {
        setSelectedFile(null);
        setPreviewUrl(null); // Clear the preview URL
    };

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p>{error}</p>;
    if (!user) return <p>사용자 정보를 찾을 수 없습니다.</p>;

    return (
        <div className="ViewProfile">
            <Header title="내 프로필" />
            <div className="view_profile_container">
                <Box sx={{ mt: 2, width: '100%', textAlign: 'center' }}>
                    <Avatar
                        alt={user.name}
                        src={previewUrl || profileImageUrl} // Use preview URL if available
                        sx={{ width: 100, height: 100, margin: '0 auto' }}
                    />
                </Box>
                <Box sx={{ mt: 2, width: '100%', textAlign: 'center' }}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        id="profile-upload"
                    />
                    {!selectedFile ? (
                        <label htmlFor="profile-upload">
                            <MuiButton
                                variant="contained"
                                component="span"
                                sx={{
                                    backgroundColor: 'rgb(148, 160, 227)',
                                    '&:hover': {
                                        backgroundColor: 'rgb(120, 140, 200)',
                                    },
                                }}
                            >
                                프로필 사진 변경
                            </MuiButton>
                        </label>
                    ) : (
                        <Box sx={{ mt: 2 }}>
                            <MuiButton
                                variant="contained"
                                sx={{
                                    backgroundColor: 'rgb(148, 160, 227)',
                                    '&:hover': {
                                        backgroundColor: 'rgb(120, 140, 200)',
                                    },
                                    mr: 2,
                                }}
                                onClick={handleProfileUpload}
                            >
                                사진 업로드
                            </MuiButton>
                            <MuiButton
                                variant="contained"
                                sx={{
                                    backgroundColor: 'rgb(255, 0, 0)',
                                    '&:hover': {
                                        backgroundColor: 'rgb(200, 0, 0)',
                                    },
                                }}
                                onClick={handleCancel}
                            >
                                취소
                            </MuiButton>
                        </Box>
                    )}
                </Box>
                <Box sx={{ mt: 2, width: '100%' }}>
                    <Typography
                        variant="h6"
                        sx={{ fontFamily: 'Gamja Flower, cursive' }}
                    >
                        이름
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ fontFamily: 'Gamja Flower, cursive' }}
                    >
                        {user.name}
                    </Typography>
                </Box>
                <Box sx={{ mt: 2, width: '100%' }}>
                    <Typography
                        variant="h6"
                        sx={{ fontFamily: 'Gamja Flower, cursive' }}
                    >
                        유저번호
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ fontFamily: 'Gamja Flower, cursive' }}
                    >
                        {user.userno}
                    </Typography>
                </Box>
                <Box sx={{ mt: 2, width: '100%' }}>
                    <Typography
                        variant="h6"
                        sx={{ fontFamily: 'Gamja Flower, cursive' }}
                    >
                        주소
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ fontFamily: 'Gamja Flower, cursive' }}
                    >
                        {user.addr1}
                    </Typography>
                </Box>
                <Box sx={{ mt: 2, width: '100%' }}>
                    <Typography
                        variant="h6"
                        sx={{ fontFamily: 'Gamja Flower, cursive' }}
                    >
                        상세주소
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ fontFamily: 'Gamja Flower, cursive' }}
                    >
                        {user.addr2}
                    </Typography>
                </Box>
                <Box sx={{ mt: 2, width: '100%' }}>
                    <Typography
                        variant="h6"
                        sx={{ fontFamily: 'Gamja Flower, cursive' }}
                    >
                        성별
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ fontFamily: 'Gamja Flower, cursive' }}
                    >
                        {user.sex}
                    </Typography>
                </Box>
                <Box sx={{ mt: 2, width: '100%' }}>
                    <Typography
                        variant="h6"
                        sx={{ fontFamily: 'Gamja Flower, cursive' }}
                    >
                        나이
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ fontFamily: 'Gamja Flower, cursive' }}
                    >
                        {user.age}
                    </Typography>
                </Box>
                <Box sx={{ mt: 2, width: '100%' }}>
                    <Typography
                        variant="h6"
                        sx={{ fontFamily: 'Gamja Flower, cursive' }}
                    >
                        은행 이름
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ fontFamily: 'Gamja Flower, cursive' }}
                    >
                        {user.bank}
                    </Typography>
                </Box>
                <Box sx={{ mt: 2, width: '100%' }}>
                    <Typography
                        variant="h6"
                        sx={{ fontFamily: 'Gamja Flower, cursive' }}
                    >
                        계좌번호
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ fontFamily: 'Gamja Flower, cursive' }}
                    >
                        {user.account}
                    </Typography>
                </Box>
                <Box sx={{ mt: 3, width: '100%' }}>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: 2,
                        }}
                    >
                        <MuiButton
                            variant="contained"
                            sx={{
                                backgroundColor: 'rgb(148, 160, 227)',
                                '&:hover': {
                                    backgroundColor: 'rgb(120, 140, 200)',
                                },
                                width: '100%',
                            }}
                            onClick={handleCardPasswordChange}
                        >
                            카드 비밀번호 변경
                        </MuiButton>
                        <MuiButton
                            variant="contained"
                            sx={{
                                backgroundColor: 'rgb(148, 160, 227)',
                                '&:hover': {
                                    backgroundColor: 'rgb(120, 140, 200)',
                                },
                                width: '100%',
                            }}
                            onClick={handleCardLostReport}
                        >
                            카드 분실 신청/해지
                        </MuiButton>
                        <MuiButton
                            variant="contained"
                            sx={{
                                backgroundColor: 'rgb(148, 160, 227)',
                                '&:hover': {
                                    backgroundColor: 'rgb(120, 140, 200)',
                                },
                                width: '100%',
                            }}
                            onClick={handleCardCancellation}
                        >
                            카드 해지 신청
                        </MuiButton>
                        <MuiButton
                            variant="contained"
                            sx={{
                                backgroundColor: 'rgb(148, 160, 227)',
                                '&:hover': {
                                    backgroundColor: 'rgb(120, 140, 200)',
                                },
                                width: '100%',
                            }}
                            onClick={handleEdit}
                        >
                            내 정보수정
                        </MuiButton>
                        <MuiButton
                            variant="contained"
                            sx={{
                                backgroundColor: 'rgb(255, 0, 0)',
                                '&:hover': {
                                    backgroundColor: 'rgb(200, 0, 0)',
                                },
                                width: '100%',
                            }}
                            onClick={handleDeleteAccount}
                        >
                            회원 탈퇴
                        </MuiButton>
                    </Box>
                </Box>
            </div>
            <Footer />
        </div>
    );
};

export default ViewProfile;
