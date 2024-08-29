import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { TextField } from '@mui/material';
import { Button as MuiButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import picture from '../../assets/datie_highfive2-cutout.png';
import axios from 'axios';

const PayLoginForm = () => {
    const navigate = useNavigate();
    const location = useLocation(); // useLocation 훅 사용
    const [id, setId] = useState(localStorage.getItem('savedId') || '');
    const [pw, setPw] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    // URL 파라미터로부터 값 받기
    const [companyno, setCompanyno] = useState(0);
    const [amount, setAmount] = useState(0);

    useEffect(() => {}, [location.search]); // location.search가 변경될 때마다 실행

    const handlesignupclick = () => {
        navigate('/verify');
    };

    const handleLoginClick = async () => {
        // location.search를 파싱하여 URLSearchParams 객체 생성
        const params = new URLSearchParams(location.search);

        // URL 파라미터 추출
        const companynoFromUrl = parseInt(params.get('companyno'), 10) || 0;
        const amountFromUrl = parseInt(params.get('amount'), 10) || 0;

        // 상태 업데이트
        setCompanyno(companynoFromUrl);
        setAmount(amountFromUrl);

        // 콘솔 로그 출력
        console.log('wtf', companynoFromUrl, amountFromUrl);

        try {
            const response = await axios.post(
                'http://localhost:8090/login',
                JSON.stringify({
                    id: id,
                    pw: pw,
                }),
                { headers: { 'Content-Type': 'application/json' } },
            );

            if (response.status === 200) {
                const token = response.headers.authorization;
                localStorage.setItem('jwt', token);

                if (rememberMe) {
                    localStorage.setItem('savedId', id);
                } else {
                    localStorage.removeItem('savedId');
                }

                navigate('/pay/Payinfo', {
                    state: {
                        id: id, // 전달할 id
                        companyno: companynoFromUrl, // 전달할 companyno
                        amount: amountFromUrl, // 전달할 amount
                    },
                });
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert('아이디 / 비밀번호가 틀렸습니다.');
            }
        }
    };

    return (
        <section className="login-form-container">
            <CompletionImage src={picture} />
            <form className="login-form">
                <div className="input-group">
                    <TextField
                        id="id"
                        label="아이디"
                        variant="outlined"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        sx={{
                            mb: 2,
                            width: '80%',
                        }}
                    />
                </div>
                <div className="input-group">
                    <TextField
                        id="pw"
                        label="비밀번호"
                        type="password"
                        variant="outlined"
                        value={pw}
                        onChange={(e) => setPw(e.target.value)}
                        sx={{
                            mb: 2,
                            width: '80%',
                            fontFamily: '"Gamja Flower", cursive',
                        }}
                    />
                </div>
                <div className="remember-id">
                    <input
                        type="checkbox"
                        id="remember"
                        className="remember-checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label htmlFor="remember">아이디 저장</label>
                </div>
                <MuiButton
                    variant="contained"
                    onClick={handleLoginClick}
                    sx={{
                        mt: 2,
                        backgroundColor: 'rgb(148, 160, 227)',
                        '&:hover': {
                            backgroundColor: 'rgb(120, 140, 200)',
                        },
                        width: '80%',
                        height: '50px',
                        fontFamily: '"Gamja Flower", cursive',
                        fontSize: '22px',
                    }}
                >
                    로그인
                </MuiButton>

                <SignUpText onClick={handlesignupclick}>회원가입</SignUpText>
            </form>
        </section>
    );
};

const CompletionImage = styled.img`
    aspect-ratio: 1;
    object-fit: contain;
    width: 100%;
    max-width: 300px;
    margin-top: 20px;
`;

const SignUpText = styled.p`
    margin-top: 15px;
    cursor: pointer;
    color: grey;
`;

export default PayLoginForm;
