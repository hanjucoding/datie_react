import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { TextField as MuiTextField, Button as MuiButton } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2'; // Swal import
import backgroundImage from '../../assets/datie_highfive2.png';

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
        <PayDesign
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
                <Title>결제정보</Title>
                <TextContainer>
                    <StyledTextField
                        id="companyname"
                        variant="outlined"
                        value={companyName}
                        InputProps={{ readOnly: true }}
                        wide
                        borderWidth="4px" /* 테두리 두께 설정 */
                        borderColor="rgb(148, 160, 227)" /* 테두리 색상 설정 */
                    />
                    <StyledLabel htmlFor="amount">총 금액</StyledLabel>
                    <StyledTextField
                        id="amount"
                        variant="outlined"
                        value={`${formatNumberWithCommas(amount)}원`}
                        InputProps={{ readOnly: true }}
                        wide
                        borderWidth="0px" /* 테두리 숨기기 */
                        fontSize="48px" /* 글씨 크기 설정 */
                    />
                    <AmountContainer>
                        <StyledTextField
                            id="peramount1"
                            variant="outlined"
                            value={
                                '나도 ' +
                                `${formatNumberWithCommas(peramount)}원`
                            }
                            InputProps={{ readOnly: true }}
                            customBgColor="#C3FBFF"
                        />
                        <StyledTextField
                            id="peramount2"
                            variant="outlined"
                            value={
                                '너도 ' +
                                `${formatNumberWithCommas(peramount)}원`
                            }
                            InputProps={{ readOnly: true }}
                            customBgColor="#FFCEF6"
                        />
                    </AmountContainer>
                </TextContainer>
            </div>
            <ButtonContainer>
                <StyledButton
                    variant="contained"
                    color="primary"
                    onClick={handlePayment}
                >
                    결제하기
                </StyledButton>
            </ButtonContainer>
        </PayDesign>
    );
}
const PayDesign = styled.main`
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    text-align: center;
`;

const Title = styled.h1`
    font-size: 40px;
    color: black;
    margin-bottom: 30px;
`;

const AmountContainer = styled.div`
    display: flex;
    gap: 90px;
    width: 95%;
    justify-content: center;
    margin-top: 80px;
`;

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 70px;
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
const TextContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center; /* 중앙 정렬 */
    justify-content: center; /* 중앙 정렬 */
    width: 100%;
`;

const StyledLabel = styled.div`
    font-family: 'Gamja Flower', cursive;
    font-size: 24px;
    color: black;
    margin-bottom: -20px;
    text-align: center;
    position: relative;
    top: 0; /* 필요 시 조정 */
    transform: translateX(0); /* 가운데 정렬을 위한 transform 제거 */
    z-index: 1;
    width: 100%; /* 라벨이 중앙에 위치하도록 전체 너비를 설정 */
    display: flex;
    justify-content: center; /* 라벨 텍스트를 중앙에 정렬 */
`;

const StyledTextField = styled(MuiTextField)`
    margin-bottom: 40px !important;
    width: ${(props) => (props.wide ? '70%' : '45%')};
    max-width: ${(props) => (props.wide ? '600px' : 'none')};
    min-width: ${(props) => (props.wide ? '300px' : 'none')};

    .MuiOutlinedInput-notchedOutline {
        border-color: ${(props) => props.borderColor || 'white'};
        border-width: ${(props) => props.borderWidth || '2px'};
        border-radius: 20px;
    }

    .MuiInputBase-input {
        font-family: 'Gamja Flower', cursive;
        font-size: ${(props) => props.fontSize || '32px'};
        color: black;
        background-color: ${(props) => props.customBgColor || 'white'};
        padding: 12px 14px;
        height: 1.5em;
        line-height: 1.5em;
        text-align: center;
        box-sizing: border-box;
        border-radius: 20px;
    }
`;

export default PayInfo;
