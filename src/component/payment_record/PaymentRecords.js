import React from "react";
import { Box, Typography } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const PaymentRecords = () => {
  const [cardno, setCardno] = useState(null);
  const [paymentRecords, setPaymentRecords] = useState([]);
  const [userno, setUserno] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
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

  return (
      <Box
          sx={{
              flex: "2",
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              width: "600px",
              margin: "0px 10px",
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
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      padding: "10px",
                      marginBottom: "10px",
                      maxWidth: "400px",
                      margin: "20px auto",
                      textAlign: "center",
                      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
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
                          color: item.paystate === 1 ? "green" : "red", // 결제 상태에 따른 색상 변경
                      }}
                  >
                      {item.amount.toLocaleString()} 원
                  </Typography>
                  <Typography
                      variant="body2"
                      sx={{
                          marginTop: "5px",
                          fontFamily: '"Gamja Flower", cursive',
                          fontSize: "18px",
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
  );
};

export default PaymentRecords;