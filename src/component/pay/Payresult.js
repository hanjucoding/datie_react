import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Payresult.css'; // CSS 파일을 임포트
import backgroundImage from '../../assets/datie_highfive2_result.png';
import axios from 'axios';
import logo from '../../assets/datie_logo.png';
import styled from 'styled-components';
// Alert 설정
const alerts = {
    success: {
        title: '결제가 완료되었습니다!!',
        icon: 'success',
        confirmButtonText: '메인메뉴로 이동',
    },
    error: {
        title: '결제 오류!',
        text: '잔액이 부족합니다.',
        icon: 'error',
        confirmButtonText: '확인',
    },
    warning: {
        title: '유효하지 않은 카드입니다!',
        icon: 'warning',
        confirmButtonText: '확인',
    },
    info: {
        title: '정보!',
        text: '여기에 중요한 정보를 표시합니다.',
        icon: 'info',
        confirmButtonText: '확인',
    },
};

const showAlert = (type, setDarkOverlay, navigate) => {
    if (alerts[type]) {
        // setDarkOverlay(true); // 특정 div를 어둡게 설정
        Swal.fire(alerts[type]).then((result) => {
            setDarkOverlay(false); // 알림 후 특정 div를 원래대로 복원
            if (result.isConfirmed) {
                // 확인 버튼 클릭 시
                navigate('/');
            }
        });
    } else {
        console.warn('알림 타입이 잘못되었습니다.');
    }
};

const showloading = (setDarkOverlay) => {
    return new Promise((resolve) => {
        // setDarkOverlay(true);
        Swal.fire({
            title: '결제 처리중입니다',
            html: '좀만 기다려주세요!',
            timer: 2500,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading(); // 로딩 스피너 표시
            },
            willClose: () => {
                setDarkOverlay(false);
                resolve(); // 로딩이 끝나면 resolve 호출
            },
        });
    });
};

function Payresult() {
    const navigate = useNavigate();
    const location = useLocation();
    const { companyno, content, amount, peramount, bonus, cardno } =
        location.state || {};

    const [darkOverlay, setDarkOverlay] = useState(false);

    useEffect(() => {
        console.log(cardno, companyno, content, amount, peramount, bonus);

        const processPayment = async () => {
            await showloading(setDarkOverlay); // 로딩 표시
            axios
                .post('http://localhost:8090/api/payresult', {
                    cardno,
                    companyno,
                    content,
                    amount,
                    peramount,
                    bonus,
                })
                .then((response) => {
                    console.log(response.data);

                    // 서버 응답에 따른 알림 표시
                    if (response.status === 200) {
                        // 결제 성공
                        showAlert('success', setDarkOverlay, navigate);
                    } else if (response.status === 400) {
                        // 잔액 부족
                        showAlert('error', setDarkOverlay, navigate);
                    } else {
                        // 카드 유효하지 않음
                        showAlert('warning', setDarkOverlay, navigate);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching payment data', error);
                    showAlert('error', setDarkOverlay, navigate);
                });
        };

        processPayment();
    }, [cardno, companyno, amount, peramount, bonus, navigate]);

    return (
        <div
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '100%',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <CompletionImage src={logo} />
            {/* 어두운 오버레이를 위한 div */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: darkOverlay
                        ? 'rgba(0, 0, 0, 0.6)'
                        : 'transparent', // 어두운 반투명 배경
                    zIndex: 1, // 알림 창 위에 위치하도록 설정
                    transition: 'background-color 0.3s', // 배경 색상 전환 애니메이션
                }}
            />
            <div
                style={{
                    position: 'relative',
                    zIndex: 2, // 알림 창 아래에 위치하도록 설정
                    padding: '20px', // 적당한 여백 추가
                    borderRadius: '8px', // 모서리 둥글게
                    backgroundColor: darkOverlay
                        ? 'rgba(255, 255, 255, 0.8)'
                        : 'transparent', // 어두운 오버레이에 따른 내용 영역 배경색
                }}
            >
                {/* 필요에 따라 추가적인 내용 */}
            </div>
        </div>
    );
}

const CompletionImage = styled.img`
    aspect-ratio: 1;
    object-fit: contain;
    width: 100%;
    max-width: 300px;
    margin-top: -650px;
`;

export default Payresult;
