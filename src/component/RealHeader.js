import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import daiteLogo from '../assets/datie_logo.png';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 import
import { jwtDecode } from 'jwt-decode'; // jwtDecode를 잘못된 방식으로 사용하고 있어, 수정했습니다.
import { useEffect, useState } from 'react';

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['내 정보', '로그아웃'];

function ResponsiveAppBar() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [profileImageUrl, setProfileImageUrl] = useState(
        '/static/images/avatar/2.jpg',
    ); // 기본 아바타 이미지 URL
    const [userNo, setUserNo] = useState(null); // userNo 상태 관리

    const navigate = useNavigate(); // useNavigate 훅 사용

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleMenuItemClick = (setting) => {
        if (setting === '내 정보' && userNo !== null) {
            navigate(`/view-profile/${userNo}`); // "내 정보"를 클릭 시 이동
        }
        handleCloseUserMenu();
    };

    useEffect(() => {
        // 로컬 스토리지에서 토큰 가져오기
        const storedToken = localStorage.getItem('jwt'); // 'jwt'은 실제 저장한 키로 변경할 수 있습니다.
        if (storedToken) {
            const decoded = jwtDecode(storedToken); // 토큰 디코딩
            setUserNo(decoded.userno); // userNo 상태 설정
            console.log(decoded.userno);

            // 프로필 이미지 URL 가져오기
            axios
                .get(
                    `http://localhost:8090/api/profileImage/${decoded.userno}`,
                    {
                        responseType: 'blob',
                    },
                )
                .then((response) => {
                    setProfileImageUrl(URL.createObjectURL(response.data)); // 받은 URL로 프로필 이미지 설정
                })
                .catch((error) => {
                    console.error(
                        '프로필 이미지를 가져오는 중 오류가 발생했습니다:',
                        error,
                    );
                    // 오류 발생 시 기본 이미지로 유지
                });
        }
    }, []);

    return (
        <AppBar
            position="static"
            sx={{ backgroundColor: 'rgb(148, 160, 227)' }}
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexGrow: 1,
                        }}
                    >
                        <Box
                            sx={{
                                display: { xs: 'flex', md: 'flex' },
                                alignItems: 'center',
                            }}
                        >
                            <img
                                src={daiteLogo} // 이미지 파일 경로
                                alt="Daite Logo"
                                style={{ width: 90, height: 50 }} // 로고 크기 조정
                            />
                        </Box>
                        <Box sx={{ flexGrow: 1 }} />
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip title="Open settings">
                                <IconButton
                                    onClick={handleOpenUserMenu}
                                    sx={{ p: 0 }}
                                >
                                    <Avatar
                                        alt="Profile Image"
                                        src={profileImageUrl}
                                    />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (
                                    <MenuItem
                                        key={setting}
                                        onClick={() =>
                                            handleMenuItemClick(setting)
                                        } // 메뉴 항목 클릭 시 호출
                                    >
                                        <Typography
                                            textAlign="center"
                                            sx={{
                                                fontFamily:
                                                    'Gamja Flower, cursive',
                                            }}
                                        >
                                            {setting}
                                        </Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default ResponsiveAppBar;
