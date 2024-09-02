import React, { useEffect, useState } from "react";
import { Box, Typography, Card, Collapse, List, ListItem, ListItemText } from "@mui/material";
import { PieChart } from '@mui/x-charts/PieChart';
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import ResponsiveAppBar from "../RealHeader";

// 아이콘 이미지 임포트
import martIcon from "../../assets/mart.png";
import foodIcon from "../../assets/food.png";
import hospitalIcon from "../../assets/hospital.png";
import hobbyIcon from "../../assets/hobby.png";
import questionMarkIcon from "../../assets/question-mark.png";

function PaymentRecordSummary() {
  const [paymentRecords, setPaymentRecords] = useState([]); // 거래 내역을 저장할 상태
  const [groupedRecords, setGroupedRecords] = useState({}); // 카테고리별로 그룹화된 거래 내역을 저장할 상태
  const [openCategories, setOpenCategories] = useState([]); // 열려 있는 카테고리를 저장할 상태
  const [chartData, setChartData] = useState([]); // 파이차트 데이터를 저장할 상태
  const [cardno, setCardno] = useState(null); // cardno를 저장할 상태

  const token = localStorage.getItem("jwt"); // JWT 토큰을 가져오는 부분
  console.log(token);
  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token); // JWT 토큰 디코딩
      const userno = decoded.userno; // userno 추출
      console.log(userno);

      // userno로 cardno 가져오기
      axios
        .post(`http://localhost:8090/api/getCardno?userno=${userno}`)
        .then((response) => {
            console.log(response);
            setCardno(response.data); // 가져온 cardno를 상태에 저장
        })
        .catch((error) => {
            console.error("Error fetching cardno:", error);
        });
    }
  }, [token]);

  useEffect(() => {
    if (cardno) {
      // 결제 기록 가져오기
      axios
        .post(`http://localhost:8090/api/card/${cardno}/payment-records-all`)
        .then((response) => {
          const records = response.data;
          setPaymentRecords(records); // 가져온 결제 기록을 상태에 저장

          // 카테고리별로 거래 내역을 그룹화
          const grouped = records.reduce((acc, record) => {
            const category = record.category || "기타"; // 카테고리가 없으면 "기타"로 분류
            if (!acc[category] && record.paystate === 1) {
              acc[category] = {
                total: 0,
                records: [],
              };
            }
            if (record.paystate === 1) {
              acc[category].total += record.amount;
              acc[category].records.push(record);
            }
            return acc;
          }, {});

          setGroupedRecords(grouped);

          // 파이차트 데이터 설정
          const chartData = Object.keys(grouped).map((category, index) => ({
            id: index,
            value: grouped[category].total,
            label: category,
          }));

          setChartData(chartData);
        })
        .catch((error) => {
          console.error("Error fetching payment records:", error);
        });
    }
  }, [cardno]);

  // 날짜 형식 변환 함수
  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const formattedTime = date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${formattedDate} ${formattedTime}`;
  };

  // 카테고리 클릭 핸들러
  const handleCategoryClick = (category) => {
    setOpenCategories((prevOpenCategories) =>
      prevOpenCategories.includes(category)
        ? prevOpenCategories.filter((cat) => cat !== category)
        : [...prevOpenCategories, category]
    );
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "식료품":
        return martIcon;
      case "외식":
        return foodIcon;
      case "의료비":
        return hospitalIcon;
      case "문화/여가":
        return hobbyIcon;
      default:
        return questionMarkIcon;
    }
  };

  return (
    <div>
    <ResponsiveAppBar />
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh", // 뷰포트 전체 높이로 설정
        maxWidth: "600px", // 최대 너비 설정
        width: "100%", // 너비 100%로 설정
        margin: "0 auto", // 가로 방향 중앙 정렬
        backgroundColor: "#f0f0f0",
        borderRadius: "8px",
        justifyContent: "center", // 세로 방향 중앙 정렬
        alignItems: "center", // 가로 방향 중앙 정렬
      }}
    >
      {/* 파이차트 섹션 */}
      <Box
        sx={{
          marginBottom: "20px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <PieChart
          series={[{ 
            data: chartData,
            highlightScope: { faded: 'global', highlighted: 'item' },
            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
         },
        ]}
          width={400}
          height={200}
        />
      </Box>

      {/* 카테고리별 거래 내역 섹션 */}
      <Box
        sx={{
          flex: "2",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          width: "600px",
          margin: "0px 10px",
          overflowY: "auto",
        }}
      >
        <Typography variant="h5" component="div" gutterBottom
          sx={{
            fontFamily: '"Gamja Flower", cursive',
            fontSize: '22px',
        }}>
          카테고리별 거래 내역
        </Typography>
        {Object.keys(groupedRecords).map((category) => (
          <Box key={category} sx={{ marginBottom: "20px" }}>
            <Card
              sx={{
                display: "flex",
                padding: "10px",
                cursor: "pointer",
                backgroundColor: "#f9f9f9",
              }}
              onClick={() => handleCategoryClick(category)}
            >
              <Box
                component="img"
                src={getCategoryIcon(category)}
                alt={category}
                sx={{
                  width: 24,
                  height: 24,
                  marginLeft: "10px",
                  cursor: "pointer",
                  marginRight: "10px",
                }}>
              </Box>
              <Typography variant="h6" sx={{ 
                fontFamily: '"Gamja Flower", cursive',
                fontSize: '22px',
              }}>
                {category}
              </Typography>
              <Typography variant="h6" sx={{ 
                fontFamily: '"Gamja Flower", cursive',
                fontSize: '22px',
                textAlign:"right",
                marginLeft: "auto", // 왼쪽 여백을 자동으로 설정하여 오른쪽으로 밀어냄
              }}>
                총 금액: {groupedRecords[category].total.toLocaleString()} 원
              </Typography>
            </Card>
            <Collapse in={openCategories.includes(category)}>
              <List>
                {groupedRecords[category].records.map((item, index) => (
                  <ListItem key={index} sx={{ paddingLeft: "20px" }}>
                    <ListItemText
                      primary={formatDateTime(item.confirmdate)}
                      secondary={`${item.content || "내용 없음"} - ${item.amount.toLocaleString()} 원`}
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
            </Collapse>
          </Box>
        ))}
      </Box>
    </Box>
    </div>
  );
}

export default PaymentRecordSummary;
