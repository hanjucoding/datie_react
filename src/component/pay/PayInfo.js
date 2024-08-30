import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { TextField as MuiTextField, Button as MuiButton } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import backgroundImage from '../../assets/datie_highfive2.png';

const backInDown1 = keyframes`
  0% {
    opacity: 0.5;
    transform: translate(150px, -200px);
  }
  80% {
    transform: translate(0px, 0px);
  }
  100% {
    opacity: 1;
    transform: translate(0px, 0px);
  }
`;

const backInDown2 = keyframes`
  0% {
    opacity: 0.5;
    transform: translate(-150px, -200px);
  }
  80% {
    transform: translate(0px, 0px);
  }
  100% {
    opacity: 1;
    transform: translate(0px, 0px);
  }
`;

const hasJongseong = (character) => {
    const baseCode = 0xac00;
    const charCode = character.charCodeAt(0);
    if (charCode < baseCode || charCode > 0xd7a3) {
        return false;
    }
    const jongseong = (charCode - baseCode) % 28;
    return jongseong !== 0;
};

const processName = (name) => {
    if (name.length <= 1) return name;
    const lastChar = name[name.length - 1];
    const processedName = name.slice(1);
    const suffix = hasJongseong(lastChar) ? '이' : '';
    return processedName + suffix;
};

function PayInfo() {
    const navigate = useNavigate();
    const location = useLocation();

    const [companyName, setCompanyName] = useState('');
    const [peramount, setPerAmount] = useState(0);
    const [bonus, setBonus] = useState(0);
    const [userno, setUserNo] = useState(null);
    const [isAnimationTriggered, setIsAnimationTriggered] = useState(false);
    const [names, setNames] = useState({ userno_name: '', userno2_name: '' });
    const [processedUsernoName, setProcessedUsernoName] = useState('');
    const [processedUserno2Name, setProcessedUserno2Name] = useState('');
    const { id, companyno, amount } = location.state || {};

    useEffect(() => {
        if (companyno && amount) {
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

            const lastDigit = amount % 10;
            const bonus = lastDigit;
            const remainingAmount = amount - lastDigit;
            const peramount = remainingAmount / 2;

            setPerAmount(peramount);
            setBonus(bonus);

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
                    confirmButtonText: '고마워',
                }).then((result) => {
                    setIsAnimationTriggered(true);
                });
            } else {
                setIsAnimationTriggered(true);
            }

            console.log(
                'After calculation1:',
                companyno,
                companyName,
                amount,
                peramount,
                bonus,
                userno,
                names.userno_name,
                names.userno2_name,
            );
        }
    }, [companyno, amount, id]);

    useEffect(() => {
        if (userno !== null) {
            axios
                .get(`http://localhost:8090/api/card?userno=${userno}`)
                .then((response) => {
                    setNames(response.data);
                })
                .catch((error) => {
                    console.error('userno찾기에러', error);
                });
        }
    }, [userno]);

    useEffect(() => {
        // names.userno_name과 names.userno2_name의 처리
        if (names.userno_name && names.userno2_name) {
            setProcessedUsernoName(processName(names.userno_name));
            setProcessedUserno2Name(processName(names.userno2_name));
        }
    }, [names]);

    const handlePayment = async () => {
        navigate('/pay/Paypassword', {
            state: {
                companyno,
                content: companyName,
                amount,
                peramount,
                bonus,
                userno,
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
                        borderWidth="4px"
                        borderColor="rgb(148, 160, 227)"
                    />
                    <StyledLabel htmlFor="amount">총 금액</StyledLabel>
                    <StyledTextField
                        id="amount"
                        variant="outlined"
                        value={`${formatNumberWithCommas(amount)}원`}
                        InputProps={{ readOnly: true }}
                        wide
                        borderWidth="0px"
                        fontSize="48px"
                    />
                    {isAnimationTriggered && (
                        <AmountContainer>
                            <AnimatedTextField1
                                id="peramount1"
                                variant="outlined"
                                value={
                                    `${processedUsernoName}` +
                                    '도 ' +
                                    `${formatNumberWithCommas(peramount)}원`
                                }
                                InputProps={{ readOnly: true }}
                                customBgColor="#C3FBFF"
                            />
                            <AnimatedTextField2
                                id="peramount2"
                                variant="outlined"
                                value={
                                    `${processedUserno2Name}` +
                                    '도 ' +
                                    `${formatNumberWithCommas(peramount)}원`
                                }
                                InputProps={{ readOnly: true }}
                                customBgColor="#FFCEF6"
                            />
                        </AmountContainer>
                    )}
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

// 스타일 컴포넌트 정의
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
    margin-bottom: 20px;
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
    align-items: center;
    justify-content: center;
    width: 100%;
`;

const StyledLabel = styled.div`
    font-family: 'Gamja Flower', cursive;
    font-size: 24px;
    color: black;
    margin-bottom: -20px;
    text-align: center;
    position: relative;
    top: 0;
    transform: translateX(0);
    z-index: 1;
    width: 100%;
    display: flex;
    justify-content: center;
`;

const StyledTextField = styled(MuiTextField)`
    margin-top: 20px;
    margin-bottom: 40px !important;
    width: ${(props) => (props.wide ? '80%' : '55%')};
    max-width: ${(props) => (props.wide ? '800px' : 'none')};
    min-width: ${(props) => (props.wide ? '400px' : 'none')};

    .MuiOutlinedInput-notchedOutline {
        border-color: ${(props) => props.borderColor || 'white'};
        border-width: ${(props) => props.borderWidth || '2px'};
        border-radius: 20px;
    }

    .MuiInputBase-input {
        font-family: 'Gamja Flower', cursive;
        font-size: ${(props) => props.fontSize || '30px'};
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

const AnimatedTextField1 = styled(StyledTextField)`
    animation: ${backInDown1} 2.5s ease both;
`;

const AnimatedTextField2 = styled(StyledTextField)`
    animation: ${backInDown2} 2.5s ease both;
`;

export default PayInfo;
