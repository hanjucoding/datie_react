import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
// import './PayInfo.css'; // CSS 파일을 import 합니다.z
import backgroundImage from '../../assets/datie_highfive2.png';
import styled from 'styled-components';
import { TextField as MuiTextField, Button as MuiButton } from '@mui/material';
function PayInfo() {
    const navigate = useNavigate();
    const location = useLocation();

    // 상태 변수 선언
    const [companyName, setCompanyName] = useState('');
    const [peramount, setPerAmount] = useState(0);
    const [bonus, setBonus] = useState(0);
    const [userno, setUserNo] = useState(null); // userno 상태 변수 추가

    const { id, companyno, amount } = location.state || {};
    console.log('Received from location.state:', id, companyno, amount);

    useEffect(() => {
        if (companyno && amount) {
            // 회사 이름 가져오기
            axios
                .get(`http://localhost:8090/api/company?companyno=${companyno}`)
                .then((response) => {
                    setCompanyName(response.data.companyname);
                })
                .catch((error) => {
                    console.error('Error fetching company data', error);
                });

            axios
                .get(`http://localhost:8090/api/id?id=${id}`)
                .then((response) => {
                    setUserNo(response.data.userno);
                })
                .catch((error) => {
                    console.error('userno찾기에러', error);
                });

            // amount의 1의 자리 구하기
            const lastDigit = amount % 10;

            // 보너스: amount의 1의 자리
            const bonus = lastDigit;

            // 나머지 금액을 절반으로 나누기
            const remainingAmount = amount - lastDigit;
            const peramount = remainingAmount / 2;

            setPerAmount(peramount);
            setBonus(bonus);

            // 보너스 알림
            if (bonus > 0) {
                Swal.fire({
                    html: `
                        <div style="font-size: 24px;">
                            ${bonus}원은 데이티가 쏘니까<br>
                            걱정 말라구!
                        </div>
                    `,
                    width: 900,
                    padding: '3em',
                    color: '#716add',
                    backdrop: `
                        rgba(0,0,123,0.4)
                        left top
                        no-repeat
                    `,
                });
            }
            console.log(
                'After calculation:',
                companyno,
                companyName,
                amount,
                peramount,
                bonus,
                userno,
            );
        }
    }, [companyno, amount, id, userno]);

    const handlePayment = async () => {
        navigate('/pay/Paypassword', {
            state: {
                companyno,
                content: companyName,
                amount,
                peramount,
                bonus,
                userno, // userno를 함께 전달
            },
        });
    };

    const formatNumberWithCommas = (number) => {
        return new Intl.NumberFormat().format(number);
    };

    return (
        <main
            className="pay-design"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '100%',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <div>
                <h1 className="title">결제정보</h1>
                <div className="text-container">
                    <input
                        className="styled-text-field read-only"
                        id="companyname"
                        type="text"
                        value={companyName}
                        readOnly
                    />
                    <div className="styled-label" htmlFor="amount">
                        총 금액
                    </div>
                    <input
                        className="styled-text-field no-border"
                        id="amount"
                        type="text"
                        value={`${formatNumberWithCommas(amount)}원`}
                        readOnly
                    />
                    <div className="amount-container">
                        <input
                            className="styled-text-field custom-bg-color-1"
                            id="peramount1"
                            type="text"
                            value={`${formatNumberWithCommas(peramount)}원`}
                            readOnly
                        />
                        <input
                            className="styled-text-field custom-bg-color-2"
                            id="peramount2"
                            type="text"
                            value={`${formatNumberWithCommas(peramount)}원`}
                            readOnly
                        />
                    </div>
                </div>
            </div>
            <div className="button-container">
                <button
                    className="styled-button styled-button-primary"
                    onClick={handlePayment}
                >
                    결제하기
                </button>
            </div>
        </main>
    );
}
const PayDesign = styled.main`
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between; /* 상단과 하단의 공간을 최대로 늘리기 */
    align-items: center;
    padding: 16px;
    text-align: center;
`;

const Title = styled.h1`
    font-size: 40px;
    color: black;
    margin-bottom: 30px;
`;

const TextContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`;

const AmountContainer = styled.div`
    display: flex;
    gap: 90px; /* 텍스트 필드 사이의 간격 설정 */
    width: 95%; /* 가로 폭을 100%로 설정 */
    justify-content: center; /* 수평 중앙 정렬 */
    margin-top: 80px; /* 여백 추가 */
`;

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: column; /* 버튼을 세로로 정렬 */
    gap: 16px; /* 버튼 사이의 간격 */
    margin-bottom: 70px; /* 하단 여백 */
`;

const StyledButton = styled(MuiButton)`
    width: 350px;
    height: 50px;
    font-family: 'Gamja Flower', cursive;
    font-size: 18px;

    &.MuiButton-containedPrimary {
        background-color: rgb(148, 160, 227);
        &:hover {
            background-color: rgb(120, 140, 200);
        }
    }

    &.MuiButton-containedSecondary {
        background-color: #46484b;
        &:hover {
            background-color: #3a3d40;
        }
    }
`;

const StyledTextField = styled(MuiTextField)`
    margin-bottom: 40px !important;
    width: 45%; /* 조정된 폭, 가로로 정렬하기 위해 여유 공간 확보 */

    .MuiInputBase-input {
        font-family: 'Gamja Flower', cursive;
        font-size: 32px;
        color: black; /* 텍스트 색상을 검은색으로 변경 */
        background-color: ${(props) =>
            props.customBgColor || 'white'}; /* 박스 내부 색상 설정 */
        padding: 12px 14px; /* 텍스트가 박스의 중앙에 오도록 패딩 조정 */
        height: 1.5em; /* 텍스트 높이를 조정 */
        line-height: 1.5em; /* 수직 중앙 정렬을 위해 line-height 설정 */
        text-align: center; /* 텍스트를 수평 중앙 정렬 */
        box-sizing: border-box; /* 패딩을 포함한 박스 크기 계산 */
        border-radius: 20px; /* 입력 박스의 테두리를 둥글게 설정 */
    }

    .MuiFormLabel-root {
        font-family: 'Gamja Flower', cursive; /* 동일한 글씨체 설정 */
        font-size: 32px; /* 동일한 글씨 크기 설정 */
        color: black; /* 레이블 색상을 검은색으로 변경 */
    }

    .MuiOutlinedInput-root {
        &.Mui-focused .MuiOutlinedInput-notchedOutline,
        &:hover .MuiOutlinedInput-notchedOutline,
        &.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
            border-color: white; /* 포커스 및 호버 상태에서 테두리 색상을 유지 */
        }
    }

    .MuiOutlinedInput-notchedOutline {
        border-color: white; /* 테두리 색상을 흰색으로 설정 */
        border-radius: 20px; /* 테두리를 둥글게 설정 */
    }
`;
export default PayInfo;
