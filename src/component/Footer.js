import React from 'react';
import { useNavigate } from 'react-router-dom'; // React Router의 useNavigate 훅 import
import styled from 'styled-components';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

const StyledBottomNavigation = styled(BottomNavigation)`
    margin-top: 40px; /* margin-top 추가 */
`;

const StyledBottomNavigationAction = styled(BottomNavigationAction)`
    & .MuiBottomNavigationAction-label {
        opacity: 0; /* 기본 상태에서는 label 숨김 */
        transition: opacity 0.3s;
    }

    &:hover .MuiBottomNavigationAction-label {
        opacity: 1; /* 마우스 오버 시 label 표시 */
    }
`;

function Footer() {
    const [value, setValue] = React.useState(0);
    const navigate = useNavigate(); // useNavigate 훅 사용

    const handleChange = (event, newValue) => {
        setValue(newValue);

        // value에 따라 경로 이동
        if (newValue === 'diary') {
            navigate('/diary');
        } else if (newValue === 'home') {
            navigate('/main');
        } else if (newValue === 'card') {
            navigate('/paymentRecord');
        }
    };

    return (
        <StyledBottomNavigation
            value={value}
            onChange={handleChange} // onChange 이벤트 핸들러에 handleChange 함수 전달
            sx={{
                backgroundColor: 'rgb(148, 160, 227)',
            }}
        >
            <StyledBottomNavigationAction
                label="메인"
                value="home"
                icon={<HomeIcon />}
                sx={{
                    color: 'white', // 기본 색상
                    '&.Mui-selected': {
                        color: 'white', // 선택된 상태 색상
                    },
                }}
            />
            <StyledBottomNavigationAction
                label="카드사용내역"
                value="card"
                icon={<CreditCardIcon />}
                sx={{
                    color: 'white', // 기본 색상
                    '&.Mui-selected': {
                        color: 'white', // 선택된 상태 색상
                    },
                }}
            />
            <StyledBottomNavigationAction
                label="데이트일기"
                value="diary"
                icon={<AutoStoriesIcon />}
                sx={{
                    color: 'white', // 기본 색상
                    '&.Mui-selected': {
                        color: 'white', // 선택된 상태 색상
                    },
                }}
            />
        </StyledBottomNavigation>
    );
}

export default Footer;
