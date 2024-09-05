import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Payresult.css'; // CSS 파일을 임포트
import backgroundImage from '../../assets/datie_highfive2_result.png';
import axios from 'axios';
import logo from '../../assets/datie_logo.png';
import styled from 'styled-components';
const apiUrl = process.env.REACT_APP_API_URL;

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
        Swal.fire(alerts[type]).then((result) => {
            setDarkOverlay(false);
            if (result.isConfirmed) {
                navigate('/');
            }
        });
    } else {
        console.warn('알림 타입이 잘못되었습니다.');
    }
};

const showloading = (setDarkOverlay) => {
    return new Promise((resolve) => {
        Swal.fire({
            title: '결제 처리중입니다',
            html: '좀만 기다려주세요!',
            timer: 2500,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
            },
            willClose: () => {
                setDarkOverlay(false);
                resolve();
            },
        });
    });
};

function Payresult() {
    const navigate = useNavigate();
    const location = useLocation();
    const { companyno, content, amount, peramount, bonus, cardno, key } =
        location.state || {};

    const [darkOverlay, setDarkOverlay] = useState(false);

    useEffect(() => {
        const checkKeyStatus = async () => {
            try {
                const keyResponse = await axios.get(`${apiUrl}/api/check-key`, {
                    params: { key: key },
                });
                console.log('Key:', key); // 디버깅용 로그

                if (keyResponse.data === 0) {
                    await Swal.fire({
                        title: '결제가 이미 처리되었습니다!',
                        icon: 'warning',
                        confirmButtonText: '메인메뉴로 이동',
                    });
                    navigate('/');
                } else {
                    // Key 상태가 유효할 때만 결제 처리
                    await processPayment();
                }
            } catch (error) {
                console.error('Key status check failed:', error);
            }
        };

        const processPayment = async () => {
            await showloading(setDarkOverlay); // 로딩 표시
            axios
                .post(`${apiUrl}/api/payresult?key=${key}`, {
                    cardno,
                    companyno,
                    content,
                    amount,
                    peramount,
                    bonus,
                })
                .then((response) => {
                    console.log(response.data);

                    if (response.status === 200) {
                        showAlert('success', setDarkOverlay, navigate);
                    } else if (response.status === 400) {
                        showAlert('error', setDarkOverlay, navigate);
                    } else {
                        showAlert('warning', setDarkOverlay, navigate);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching payment data', error);
                    showAlert('error', setDarkOverlay, navigate);
                });
        };

        if (key) {
            checkKeyStatus();
        }
    }, [cardno, companyno, amount, peramount, bonus, key, navigate]);

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
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: darkOverlay
                        ? 'rgba(0, 0, 0, 0.6)'
                        : 'transparent',
                    zIndex: 1,
                    transition: 'background-color 0.3s',
                }}
            />
            <div
                style={{
                    position: 'relative',
                    zIndex: 2,
                    padding: '20px',
                    borderRadius: '8px',
                    backgroundColor: darkOverlay
                        ? 'rgba(255, 255, 255, 0.8)'
                        : 'transparent',
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
