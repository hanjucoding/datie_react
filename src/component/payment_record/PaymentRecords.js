import React from "react";
import { Box, Typography } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import ResponsiveAppBar from "../RealHeader";
import Footer from '../Footer';

// 아이콘 이미지 임포트
import martIcon from "../../assets/mart.png";
import foodIcon from "../../assets/food.png";
import hospitalIcon from "../../assets/hospital.png";
import hobbyIcon from "../../assets/hobby.png";
import questionMarkIcon from "../../assets/question-mark.png";

const PaymentRecords = () => {
  const [cardno, setCardno] = useState(null);
  const [paymentRecords, setPaymentRecords] = useState([]);
  const [userno, setUserno] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedRecordIndex, setSelectedRecordIndex] = useState(null);
  const [iconPosition, setIconPosition] = useState({ top: 0, left: 0 }); // 아이콘의 위치 저장
  const token = localStorage.getItem("jwt");

  const observer = useRef();

  useEffect(() => {
      if (token) {
          const decoded = jwtDecode(token);
          const userno = decoded.userno;
          setUserno(userno);

          axios
              .post(`http://localhost:8090/api/getCardno?userno=${userno}`)
              .then((response) => {
                  setCardno(response.data);
              })
              .catch((error) => {
                  console.error("Error fetching cardno:", error);
              });
      }
  }, [token]);

  useEffect(() => {
      if (cardno && !isFetching) {
          loadMoreRecords();
      }
  }, [cardno]);

  const loadMoreRecords = () => {
      if (hasMore && !isFetching) {
          setIsFetching(true);
          axios
              .post(`http://localhost:8090/api/card/${cardno}/payment-records?page=${page}&size=4`)
              .then((response) => {
                  setPaymentRecords((prevRecords) => [...prevRecords, ...response.data.content]);
                  setHasMore(response.data.content.length === 4);
                  setPage((prevPage) => prevPage + 1);
              })
              .catch((error) => {
                  console.error("Error fetching payment records:", error);
              })
              .finally(() => {
                  setIsFetching(false);
              });
      }
  };

  const lastRecordRef = (node) => {
      if (isFetching) return;

      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting && hasMore) {
              loadMoreRecords();
          }
      });
      if (node) observer.current.observe(node);
  };

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

  const handleIconClick = (index, event) => {
    const { offsetTop, offsetLeft } = event.target; // 아이콘의 위치 계산
    setIconPosition({ top: offsetTop, left: offsetLeft }); // 위치 상태 저장
    setSelectedRecordIndex(selectedRecordIndex === index ? null : index);
  };

  const handleCategoryChange = async (index, newCategory) => {
    try {
      const record = paymentRecords[index];
      const response = await axios.post(`http://localhost:8090/api/payment-record/${record.payno}/category`, newCategory, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setPaymentRecords((prevRecords) =>
          prevRecords.map((record, i) =>
            i === index ? { ...record, category: newCategory } : record
          )
        );
      } else {
        console.error("Failed to update category:", response);
      }
    } catch (error) {
      console.error("Error updating category:", error);
    } finally {
      setSelectedRecordIndex(null); // Update successful or not, close the category selection
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <ResponsiveAppBar />
      <Box
          sx={{
              flex: "1", // 남은 공간을 채우도록 설정
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              width: "600px",
              margin: "0px auto",
              paddingBottom: "20px",
          }}
      >
          <Typography
              variant="h5"
              component="div"
              gutterBottom
              sx={{
                  fontFamily: '"Gamja Flower", cursive',
                  fontSize: "22px",
                  padding: "10px",
              }}
          >
              카드 내역
          </Typography>
          {paymentRecords.map((item, index) => (
              <Box
                  key={index}
                  ref={paymentRecords.length === index + 1 ? lastRecordRef : null}
                  sx={{
                      border: "3px solid #ccc",
                      borderRadius: "8px",
                      borderColor: item.paystate === 1 ? "green" : "red",
                      padding: "10px",
                      marginBottom: "10px",
                      maxWidth: "400px",
                      minHeight: "150px",
                      margin: "20px auto",
                      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
              >
                  <Typography
                      variant="body1"
                      sx={{
                        position: "absolute",
                        marginBottom: "5px",
                        fontFamily: '"Gamja Flower", cursive',
                        fontSize: "22px",
                      }}
                  >
                      {formatDateTime(item.confirmdate)}
                  </Typography>
                  <Typography
                      variant="body2"
                      sx={{
                        position: "relative",
                        top: "50px",
                        left: "50px",
                        marginBottom: "5px",
                        fontFamily: '"Gamja Flower", cursive',
                        fontSize: "22px",
                      }}
                  >
                      {item.content ? item.content : "Unknown"}
                  </Typography>
                  <Box
                    component="img"
                    src={getCategoryIcon(item.category)}
                    alt={item.category}
                    sx={{
                      position: "relative",
                      top: "15px",
                      width: 24,
                      height: 24,
                      marginLeft: "10px",
                      cursor: "pointer",
                    }}
                    onClick={(e) => handleIconClick(index, e)} // 아이콘 클릭 핸들러 추가
                  />
                  {selectedRecordIndex === index && (
                    <Box 
                      sx={{
                        position: "absolute", // 아이콘 위치를 기준으로 절대적으로 배치
                        top: `${iconPosition.top + 30}px`, // 저장된 아이콘의 좌표값 사용
                        left: `${iconPosition.left}px`,
                        display: "flex",
                        backgroundColor: "#ffffff",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                        padding: "5px",
                        borderRadius: "8px",
                        zIndex: 10,
                      }}
                    >
                      <Box
                        component="img"
                        src={martIcon}
                        alt="식료품"
                        sx={{ width: 24, height: 24, cursor: "pointer", marginRight: "10px" }}
                        onClick={() => handleCategoryChange(index, "식료품")}
                      />
                      <Box
                        component="img"
                        src={foodIcon}
                        alt="외식"
                        sx={{ width: 24, height: 24, cursor: "pointer", marginRight: "10px" }}
                        onClick={() => handleCategoryChange(index, "외식")}
                      />
                      <Box
                        component="img"
                        src={hospitalIcon}
                        alt="의료비"
                        sx={{ width: 24, height: 24, cursor: "pointer", marginRight: "10px" }}
                        onClick={() => handleCategoryChange(index, "의료비")}
                      />
                      <Box
                        component="img"
                        src={hobbyIcon}
                        alt="문화/여가"
                        sx={{ width: 24, height: 24, cursor: "pointer", marginRight: "10px" }}
                        onClick={() => handleCategoryChange(index, "문화/여가")}
                      />
                      <Box
                        component="img"
                        src={questionMarkIcon}
                        alt="기타"
                        sx={{ width: 24, height: 24, cursor: "pointer" }}
                        onClick={() => handleCategoryChange(index, "기타")}
                      />
                    </Box>
                  )}
                  <Typography
                      variant="body2"
                      sx={{
                        position: "relative",
                        left: "0px",
                        top: "50px",
                        fontWeight: "bold",
                        fontFamily: '"Gamja Flower", cursive',
                        fontSize: "22px",
                        textAlign: "right",
                        color: item.paystate === 1 ? "green" : "red", // 결제 상태에 따른 색상 변경
                        textDecoration: item.paystate === 1 ? "none" : "line-through",
                      }}
                  >
                      {item.amount.toLocaleString()} 원
                  </Typography>
                  <Typography
                      variant="body2"
                      sx={{
                        position: "relative",
                        top: "-100px",
                        marginTop: "5px",
                        fontFamily: '"Gamja Flower", cursive',
                        fontSize: "18px",
                        textAlign: "right",
                        color: item.paystate === 1 ? "green" : "red", // 결제 상태에 따른 색상 변경
                      }}
                  >
                      {item.paystate === 1 ? "결제 성공" : "결제 실패"}
                  </Typography>
              </Box>
          ))}
          {!hasMore && (
              <Typography
                  sx={{
                      textAlign: "center",
                      marginTop: "10px",
                      fontFamily: '"Gamja Flower", cursive',
                      fontSize: "22px",
                  }}
              >
                  모든 내역을 불러왔습니다.
              </Typography>
          )}
      </Box>
      <Footer />
    </Box>
  );
};

export default PaymentRecords;
