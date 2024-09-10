import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
} from '@mui/material';

import recommendIcon from '../../assets/recommend.png';

const apiUrl = process.env.REACT_APP_API_URL;

const GptRecommend = ({ cardno }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchRecommendations = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(
                `${apiUrl}/api/recommend/${cardno}?page=0&size=10`,
            );

            console.log('API Response:', response.data); // API 응답을 확인하기 위한 콘솔 로그

            if (Array.isArray(response.data)) {
                setRecommendations(response.data); // API가 배열을 반환한다면 상태를 설정
            } else {
                setError('결제내역이 존재하지 않습니다.'); // 데이터가 배열이 아닌 경우 처리
            }
        } catch (err) {
            setError('추천을 가져오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecommendations();
    }, [cardno]);

    const handleMapClick = (location) => {
        const kakaoMapUrl = `https://map.kakao.com/?q=${encodeURIComponent(
            location,
        )}`;
        window.open(kakaoMapUrl, '_blank'); // 새 탭에서 카카오맵 열기
    };

    return (
        <Box sx={{ maxWidth: 600, margin: '0 auto', padding: 2 }}>
            <Box
                sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        fontFamily: '"Gamja Flower", cursive',
                        fontSize: '25px',
                        fontWeight: 'bold',
                        marginRight: '10px', // 텍스트와 아이콘 사이에 간격 추가
                    }}
                >
                    당신만을 위한 데이티의 추천
                </Typography>
                <Box
                    component="img"
                    src={recommendIcon}
                    alt="Recommend Icon"
                    sx={{ width: 40, height: 40 }} // 아이콘 크기 설정
                />
            </Box>

            {loading && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        margin: '20px 0',
                    }}
                >
                    <CircularProgress />
                </Box>
            )}
            {error && <Typography color="error">{error}</Typography>}

            {!loading && !error && recommendations.length > 0 && (
                <Typography
                    variant="h4"
                    sx={{
                        marginBottom: 2,
                        fontFamily: '"Gamja Flower", cursive',
                        fontSize: '22px',
                    }}
                >
                    {recommendations[0].Basis}에 사용하신 횟수가 제일 많아요!
                </Typography>
            )}
            {!loading && !error && recommendations.length > 0 && (
                <List>
                    {recommendations.map((recommendation, index) => (
                        <ListItem
                            key={index}
                            divider
                            button
                            onClick={() =>
                                handleMapClick(recommendation.Location)
                            } // 클릭 시 카카오맵으로 연결
                        >
                            <ListItemText
                                primary={`${recommendation.Activity}`}
                                secondary={`${recommendation.Location}`}
                                primaryTypographyProps={{
                                    fontFamily: '"Gamja Flower", cursive',
                                    fontSize: '20px',
                                }}
                                secondaryTypographyProps={{
                                    fontFamily: '"Gamja Flower", cursive',
                                    fontSize: '18px',
                                }}
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
};

export default GptRecommend;
