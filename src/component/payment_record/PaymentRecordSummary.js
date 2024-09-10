import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import ResponsiveAppBar from "../RealHeader";
import Footer from "../Footer";

// 아이콘 이미지 임포트
import martIcon from "../../assets/mart.png";
import foodIcon from "../../assets/food.png";
import hospitalIcon from "../../assets/hospital.png";
import hobbyIcon from "../../assets/hobby.png";
import questionMarkIcon from "../../assets/question-mark.png";

const apiUrl = process.env.REACT_APP_API_URL;

function PaymentRecordSummary() {
  const [paymentRecords, setPaymentRecords] = useState([]); // 거래 내역을 저장할 상태
  const [groupedRecords, setGroupedRecords] = useState({}); // 카테고리별로 그룹화된 거래 내역을 저장할 상태
  const [openCategories, setOpenCategories] = useState([]); // 열려 있는 카테고리를 저장할 상태
  const [chartData, setChartData] = useState([]); // 파이차트 데이터를 저장할 상태
  const [cardno, setCardno] = useState(null); // cardno를 저장할 상태
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 현재 월로 초기화 (0부터 시작하므로 +1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // 현재 연도로 초기화

  const token = localStorage.getItem("jwt"); // JWT 토큰을 가져오는 부분

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token); // JWT 토큰 디코딩
        const userno = decoded.userno; // userno 추출
        console.log("Userno:", userno);

        // userno로 cardno 가져오기
        axios
          .post(`${apiUrl}/api/getCardno?userno=${userno}`)
          .then((response) => {
            setCardno(response.data);
          })
          .catch((error) => {
            console.error("Error fetching cardno:", error);
          });
      } catch (error) {
        console.error("Error decoding JWT:", error);
      }
    }
  }, [token]);

  useEffect(() => {
    if (cardno) {
      fetchPaymentRecordsByMonth(cardno, selectedYear, selectedMonth);
    }
  }, [cardno, selectedMonth, selectedYear]);

  const fetchPaymentRecordsByMonth = (cardno, year, month) => {
    axios
      .post(
        `${apiUrl}/api/card/${cardno}/payment-records-month`,
        null, // POST 요청의 본문이 필요 없으면 null로 설정
        {
          params: {
            year: year,
            month: month,
          },
        }
      )
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
  };

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

  // 카테고리에 맞는 아이콘 반환 함수
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

  // 카테고리를 총액에 따라 내림차순으로 정렬
  const sortedCategories = Object.keys(groupedRecords).sort(
    (a, b) => groupedRecords[b].total - groupedRecords[a].total
  );

  return (
    <div>
      <ResponsiveAppBar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh", // 최소 높이를 뷰포트 전체 높이로 설정
          maxWidth: "600px", // 최대 너비 설정
          width: "100%", // 너비 100%로 설정
          margin: "0 auto", // 가로 방향 중앙 정렬
          backgroundColor: "#f0f0f0",
          borderRadius: "8px",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        {/* 월 및 연도 선택 섹션 */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            padding: "10px 0",
          }}
        >
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="year-select-label">연도</InputLabel>
            <Select
              labelId="year-select-label"
              value={selectedYear}
              label="연도"
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {/* 최근 5개 연도 표시 */}
              {[...Array(5)].map((_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <MenuItem key={year} value={year}>
                    {year}년
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="month-select-label">월</InputLabel>
            <Select
              labelId="month-select-label"
              value={selectedMonth}
              label="월"
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {/* 1월부터 12월까지 표시 */}
              {[...Array(12)].map((_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {i + 1}월
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

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
          {chartData.length > 0 ? (
            <PieChart
              series={[
                {
                  data: chartData,
                  highlightScope: { faded: "global", highlighted: "item" },
                  faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
                },
              ]}
              width={400}
              height={200}
            />
          ) : (
            <Typography variant="body1">데이터가 없습니다.</Typography>
          )}
        </Box>

        {/* 카테고리별 거래 내역 섹션 */}
        <Box
          sx={{
            flex: "2",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            width: "100%",
            margin: "0px 10px",
            overflowY: "auto",
            padding: "10px",
            boxSizing: "border-box",
          }}
        >
          <Typography
            variant="h5"
            component="div"
            gutterBottom
            sx={{
              fontFamily: '"Gamja Flower", cursive',
              fontSize: "22px",
            }}
          >
            카테고리별 거래 내역
          </Typography>
          {sortedCategories.length > 0 ? (
            sortedCategories.map((category) => (
              <Box key={category} sx={{ marginBottom: "20px" }}>
                <Card
                  sx={{
                    display: "flex",
                    alignItems: "center",
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
                      marginRight: "10px",
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: '"Gamja Flower", cursive',
                      fontSize: "22px",
                      flexGrow: 1,
                    }}
                  >
                    {category}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: '"Gamja Flower", cursive',
                      fontSize: "22px",
                      textAlign: "right",
                      marginLeft: "auto",
                    }}
                  >
                    총 금액: {groupedRecords[category].total.toLocaleString()} 원
                  </Typography>
                </Card>
                <Collapse in={openCategories.includes(category)}>
                  <List>
                    {groupedRecords[category].records.map((item, index) => (
                      <ListItem key={index} sx={{ paddingLeft: "40px" }}>
                        <ListItemText
                          primary={formatDateTime(item.confirmdate)}
                          secondary={`${item.content || "내용 없음"} - ${item.amount.toLocaleString()} 원`}
                          primaryTypographyProps={{
                            fontFamily: '"Gamja Flower", cursive',
                            fontSize: "20px",
                          }}
                          secondaryTypographyProps={{
                            fontFamily: '"Gamja Flower", cursive',
                            fontSize: "18px",
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </Box>
            ))
          ) : (
            <Typography variant="body1">해당 기간에 거래 내역이 없습니다.</Typography>
          )}
        </Box>
      </Box>
      <Footer />
    </div>
  );
}

export default PaymentRecordSummary;
