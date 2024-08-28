import React, { useEffect, useState } from "react";
import { Box, Typography, Card } from "@mui/material";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // 잘못된 import 형태도 수정 (jwtDecode는 함수)

import ResponsiveAppBar from "../RealHeader";

// 이미지 import
import type1Front from "../../assets/type1-front.png";
import type2Front from "../../assets/type2-front.png";
import type3Front from "../../assets/type3-front.png";
import type1Back from "../../assets/type1-back.png";
import type2Back from "../../assets/type2-back.png";
import type3Back from "../../assets/type3-back.png";

function LoginMain() {
  const [cardInfo, setCardInfo] = useState(null);
  const [paymentRecords, setPaymentRecords] = useState([]);
  const [ownerName, setOwnerName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [userno, setUserno] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
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
      // 카드 정보 가져오기
      console.log(cardno);
      axios
        .post(`http://localhost:8090/api/card/${cardno}`)
        .then((response) => {
          setCardInfo(response.data);

          // 첫 번째 유저 이름 가져오기
          if (response.data.userno) {
            console.log(response.data.userno);
            axios
              .get(`http://localhost:8090/api/profile?userno=${response.data.userno}`)
              .then((res) => {
                setOwnerName(res.data.name);
                console.log(res.data.name);
              })
              .catch((error) => {
                console.error("Error fetching owner name:", error);
              });
          }

          // 두 번째 유저 이름 가져오기
          if (response.data.userno2) {
            console.log(response.data.userno2);
            axios
              .get(`http://localhost:8090/api/profile?userno=${response.data.userno2}`)
              .then((res) => {
                setPartnerName(res.data.name);
              })
              .catch((error) => {
                console.error("Error fetching partner name:", error);
              });
          }
        })
        .catch((error) => {
          console.error("Error fetching card info:", error);
        });

      // 결제 기록 가져오기
      axios
        .post(`http://localhost:8090/api/card/${cardno}/payment-records`)
        .then((response) => {
          setPaymentRecords(response.data);
        })
        .catch((error) => {
          console.error("Error fetching payment records:", error);
        });
    }
  }, [cardno]);

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

  const formatDateTimeCard = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString("ko-KR", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    });
    return `${formattedDate}`;
  };

  const getFrontBackgroundImage = () => {
    switch (cardInfo?.cardtypeno) {
      case 1:
        return type1Front;
      case 2:
        return type2Front;
      case 3:
        return type3Front;
      default:
        return null;
    }
  };

  const getBackBackgroundImage = () => {
    switch (cardInfo?.cardtypeno) {
      case 1:
        return type1Back;
      case 2:
        return type2Back;
      case 3:
        return type3Back;
      default:
        return null;
    }
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        maxWidth: "1024px",
        width: "100%",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#f0f0f0",
        borderRadius: "8px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ResponsiveAppBar />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          width: "600px",
          height: "400px",
          perspective: "1000px",
        }}
        onClick={handleCardClick}
      >
        {cardInfo && (
          <>
            <Card
              sx={{
                maxWidth: "450px",
                width: "100%",
                color: "white",
                borderRadius: "12px",
                position: "absolute",
                top: "10%",
                left: "10%",
                backgroundImage: `url(${getFrontBackgroundImage()})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                aspectRatio: "16/9",
                backfaceVisibility: "hidden",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                transition: "transform 1.5s",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-end",
                padding: "20px",
              }}
            >
              <Typography
                variant="h4"
                component="div"
                sx={{
                  color: "white",
                  fontFamily: '"Gamja Flower", cursive',
                  fontSize: "22px",
                }}
              >
                {cardInfo.initials}
              </Typography>
            </Card>
            <Card
              sx={{
                maxWidth: "450px",
                width: "100%",
                color: "white",
                borderRadius: "12px",
                position: "absolute",
                top: "10%",
                left: "10%",
                backgroundImage: `url(${getBackBackgroundImage()})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                aspectRatio: "16/9",
                backfaceVisibility: "hidden",
                transform: isFlipped ? "rotateY(0deg)" : "rotateY(180deg)",
                transition: "transform 1.5s",
                transformStyle: "preserve-3d",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
              }}
            >
              <Typography
                variant="body2"
                component="div"
                sx={{
                  marginBottom: "10px",
                  marginTop: "100px",
                  fontFamily: '"Gamja Flower", cursive',
                  fontSize: "22px",
                }}
              >
                {ownerName}님과 {partnerName}님의 데이티카드
              </Typography>
              <Typography
                variant="body2"
                component="div"
                sx={{
                  marginBottom: "10px",
                  fontFamily: '"Gamja Flower", cursive',
                  fontSize: "22px",
                }}
              >
                유효 기간: {formatDateTimeCard(cardInfo.date)}
              </Typography>
              <Typography variant="body2" component="div">
                CVC: {cardInfo.cvc}
              </Typography>
            </Card>
          </>
        )}
      </Box>
      <Box
        sx={{
          flex: "2",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          padding: "20px",
          width: "600px",
          margin: "0px 10px",
          overflowY: "auto",
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
          카드 내역
        </Typography>
        {paymentRecords.length > 0 ? (
          paymentRecords.map((item, index) => (
            <Box
              key={index}
              sx={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "10px",
                maxWidth: "400px",
                margin: "20px auto",
                textAlign: "center",
              }}
            >
              <Typography
                variant="body1"
                sx={{
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
                  marginBottom: "5px",
                  fontFamily: '"Gamja Flower", cursive',
                  fontSize: "22px",
                }}
              >
                {item.content ? item.content : "Unknown"}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: "bold",
                  fontFamily: '"Gamja Flower", cursive',
                  fontSize: "22px",
                }}
              >
                {item.amount.toLocaleString()} 원
              </Typography>
            </Box>
          ))
        ) : (
          <Typography>Loading payment records...</Typography>
        )}
      </Box>
    </Box>
  );
}

export default LoginMain;
