import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, Button, List, ListItem, ListItemText } from "@mui/material";

const apiUrl = process.env.REACT_APP_API_URL;

const GptRecommend = ({ cardno }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRecommendations = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${apiUrl}/api/recommend/${cardno}?page=0&size=10`);
      
      console.log("API Response:", response.data);  // API 응답을 확인하기 위한 콘솔 로그

      if (Array.isArray(response.data)) {
        setRecommendations(response.data); // API가 배열을 반환한다면 상태를 설정
      } else {
        setError("추천 결과가 올바른 형식이 아닙니다."); // 데이터가 배열이 아닌 경우 처리
      }
    } catch (err) {
      setError("추천을 가져오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [cardno]);

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", padding: 2 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        추천 활동
      </Typography>
      

      {loading && <Typography>로딩 중...</Typography>}
      {error && <Typography color="error">{error}</Typography>}

        {!loading && !error && recommendations.length > 0 && (
            <Typography variant="h4" sx={{marginBottom: 2}}>
                {recommendations[0].Basis}에 가장 많이 사용하셨어요
            </Typography>
        )}
      {!loading && !error && recommendations.length > 0 && (
        <List>
          {recommendations.map((recommendation, index) => (
            <ListItem key={index} divider>
              <ListItemText
                primary={`활동 ${index + 1}: ${recommendation.Activity}`}
                secondary={`${recommendation.Location}`}
              />
            </ListItem>
          ))}
        </List>
      )}

      <Button variant="contained" onClick={fetchRecommendations} disabled={loading}>
        추천 새로고침
      </Button>
    </Box>
  );
};

export default GptRecommend;
