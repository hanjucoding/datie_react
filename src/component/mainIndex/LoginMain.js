import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, Card } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import ResponsiveAppBar from "../RealHeader";

// 이미지 import
import type1Front from "../../assets/type1-front.png";
import type2Front from "../../assets/type2-front.png";
import type3Front from "../../assets/type3-front.png";
import type1Back from "../../assets/type1-back.png";
import type2Back from "../../assets/type2-back.png";
import type3Back from "../../assets/type3-back.png";
import nocard from "../../assets/nocard.png"; // 카드가 없을 때 사용할 이미지

import icon_record from "../../assets/Icon-record.png";
import icon_summary from "../../assets/Icon-summary.png";
import icon_diary from "../../assets/Icon-diary.png";

function LoginMain() {
  const [cardInfo, setCardInfo] = useState(null);
  const [paymentRecords, setPaymentRecords] = useState([]);
  const [ownerName, setOwnerName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [userno, setUserno] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardno, setCardno] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();
  const navigate = useNavigate(); // useNavigate 훅 사용
  const token = localStorage.getItem("jwt"); // JWT 토큰을 가져오는 부분

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
    } else {
      setCardInfo(null); // 카드가 없는 경우 cardInfo를 null로 설정
    }
  }, [cardno, page]);

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
    if (!cardInfo) {
      return nocard;
    }
    switch (cardInfo.cardtypeno) {
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
    if (cardInfo) {
      setIsFlipped(!isFlipped);
    } else {
      navigate("/search_lover"); // 카드가 없으면 카드 등록 페이지로 이동
    }
  };

  const handleIconClick = (path) => {
    navigate(path);
  };

  return (
    <div
      style={{
        maxWidth: "600px",
      }}
    >
      <ResponsiveAppBar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          maxWidth: "600px",
          width: "100%",
          margin: "0 auto",
          backgroundColor: "#f0f0f0",
          borderRadius: "8px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
          {cardInfo ? (
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
                    fontSize: "34px",
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
              </Card>
            </>
          ) : (
            <Card
              sx={{
                maxWidth: "450px",
                width: "100%",
                color: "white",
                borderRadius: "12px",
                position: "absolute",
                top: "10%",
                left: "10%",
                backgroundImage: `url(${nocard})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                aspectRatio: "16/9",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
              }}
            >
              <Typography
                variant="h6"
                component="div"
                sx={{
                  color: "white",
                  fontFamily: '"Gamja Flower", cursive',
                  fontSize: "22px",
                  textAlign: "center",
                }}
              >
              </Typography>
            </Card>
          )}
        </Box>
        <Box
          sx={{
            flex: "2",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            width: "600px",
            margin: "0px 10px",
            paddingBottom: "20px", // 밑 공간을 추가
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
            데이티 서비스
          </Typography>
            {/* 아이콘 섹션 */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              padding: "10px",
            }}
          >
            <Box
              component="img"
              src={icon_record}
              alt="결제 기록"
              sx={{ width: 140, height: 100, cursor: "pointer" }}
              onClick={() => handleIconClick("/paymentRecords")}
            />
            <Box
              component="img"
              src={icon_summary}
              alt="요약"
              sx={{ width: 140, height: 100, cursor: "pointer" }}
              onClick={() => handleIconClick("/paymentRecordSummary")}
            />
            <Box
              component="img"
              src={icon_diary}
              alt="일기"
              sx={{ width: 140, height: 100, cursor: "pointer" }}
              onClick={() => handleIconClick("/diary")}
            />
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default LoginMain;
