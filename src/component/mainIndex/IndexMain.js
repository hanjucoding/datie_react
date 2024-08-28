import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";  // react-router-dom 사용
import background from "../../assets/datie_background.webp";
import logo from "../../assets/datie_logo.png";
import { Button as MuiButton } from "@mui/material";

function IndexMain() {
  const [showButtons, setShowButtons] = useState(false);
  const buttonRef = useRef(null);
  const navigate = useNavigate();  // useNavigate 훅 사용

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShowButtons(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (buttonRef.current) {
      observer.observe(buttonRef.current);
    }

    return () => {
      if (buttonRef.current) {
        observer.unobserve(buttonRef.current);
      }
    };
  }, []);

  const handleLoginClick = () => {
    navigate("/login");  // 로그인 버튼 클릭 시 /loginMain 경로로 userno=1 파라미터와 함께 이동 (개발을 위해 그냥 로그인처리) TODO
  };

  const handleSignClick = () => {
    navigate("/signUp");  // 회원가입으로 이동
  };

  return (
    <div
      className="outer_wrapper"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div
        className="inner_wrapper"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "auto",
          backgroundPosition: "center",
          width: "600px",
          height: "100vh", 
          borderRadius: "8px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1,
            paddingTop: "20px",
          }}
        >
          <img src={logo} alt="Datie Logo" style={{ width: "400px", height: "200px" }} />
        </div>

        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "20%",
            transform: "translate(-20%, -20%)",
            width: "100%",
            marginLeft: "20px",
            marginRight: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0 60px",
            }}
          >
            <h1
              style={{
                color: "black",
                fontFamily: "'Black Han Sans', sans-serif",
                fontWeight: "400",
                fontSize: "64px",
                margin: "0",
                WebkitTextStroke: "1px white",
                animation: "fadeInLeft 1s ease-in-out",
              }}
            >
              당신의 데이트
            </h1>
            <h1
              style={{
                color: "white",
                fontFamily: "'Black Han Sans', sans-serif",
                fontWeight: "400",
                fontSize: "64px",
                margin: "0",
                WebkitTextStroke: "1px black",
                animation: "fadeInRight 1s ease-in-out",
              }}
            >
              편리한 가계부
            </h1>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0 60px",
              marginTop: "20px",
            }}
          >
            <h1
              style={{
                color: "black",
                fontFamily: "'Black Han Sans', sans-serif",
                fontWeight: "400",
                fontSize: "64px",
                margin: "0",
                WebkitTextStroke: "1px white",
                animation: "fadeInLeft 1.5s ease-in-out",
              }}
            >
              데이티와 함께하세요
            </h1>
            <h1
              style={{
                color: "white",
                fontFamily: "'Black Han Sans', sans-serif",
                fontWeight: "400",
                fontSize: "64px",
                margin: "0",
                WebkitTextStroke: "1px black",
                animation: "fadeInRight 1.5s ease-in-out",
              }}
            >
              데이트헬퍼
            </h1>
          </div>
        </div>

        <div
          ref={buttonRef}
          style={{
            position: "absolute",
            bottom: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: showButtons ? 1 : 0,
            transition: "opacity 1s ease-in-out",
          }}
        >
          <MuiButton
            variant="contained"
            sx={{
              mt: 1,
              backgroundColor: "rgb(148, 160, 227)",
              "&:hover": {
                backgroundColor: "rgb(120, 140, 200)",
              },
              width: "300px",
              height: "70px",
              fontSize: "20px",
              fontWeight: "bold",
            }}
            onClick={handleSignClick}  // 로그인 버튼 클릭 이벤트 핸들러 추가
          >
            가입하기
          </MuiButton>
          <MuiButton
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: "rgb(148, 160, 227)",
              "&:hover": {
                backgroundColor: "rgb(120, 140, 200)",
              },
              width: "300px",
              height: "70px",
              fontSize: "20px",
              fontWeight: "bold",
            }}
            onClick={handleLoginClick}  // 로그인 버튼 클릭 이벤트 핸들러 추가
          >
            로그인
          </MuiButton>
        </div>
      </div>
      <style>
        {`
          @keyframes fadeInLeft {
            0% {
              opacity: 0;
              transform: translateX(-100%);
            }
            100% {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes fadeInRight {
            0% {
              opacity: 0;
              transform: translateX(100%);
            }
            100% {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
      </style>
    </div>
  );
}

export default IndexMain;
