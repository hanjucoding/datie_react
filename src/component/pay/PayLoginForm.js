import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { TextField } from '@mui/material';
import { Button as MuiButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import picture from '../../assets/datie_highfive2-cutout.png';
import Swal from 'sweetalert2';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

const PayLoginForm = () => {
    const navigate = useNavigate();
    const location = useLocation(); // useLocation 훅 사용
    const [id, setId] = useState(localStorage.getItem('savedId') || '');
    const [pw, setPw] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    // URL 파라미터로부터 값 받기
    const [companyno, setCompanyno] = useState(0);
    const [amount, setAmount] = useState(0);
    const [key, setKey] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const companynoFromUrl = parseInt(params.get('companyno'), 10) || 0;
        const amountFromUrl = parseInt(params.get('amount'), 10) || 0;
        const keyFromUrl = params.get('key') || '';
        setCompanyno(companynoFromUrl);
        setAmount(amountFromUrl);
        setKey(keyFromUrl);

        // 페이지 로딩 시 Key 상태 확인 요청
        const checkKeyStatus = async () => {
            try {
                const keyResponse = await axios.get(`${apiUrl}/api/check-key`, {
                    params: { key: keyFromUrl },
                });
                console.log('Key:', keyFromUrl); // 디버깅용 로그

                if (keyResponse.data === 0) {
                    await Swal.fire({
                        title: '결제가 이미 처리되었습니다!',
                        icon: 'warning',
                        confirmButtonText: '메인메뉴로 이동',
                    });
                    navigate('/main');
                }
            } catch (error) {
                console.error('Key status check failed:', error);
            }
        };

        if (keyFromUrl) {
            checkKeyStatus();
        }
    }, [location.search, navigate]); // 의존성 배열 설정

    const handlesignupclick = () => {
        navigate('/verify');
    };

    const handleLoginClick = async () => {
        try {
            const response = await axios.post(
                `${apiUrl}/login`,
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
                        id: id,
                        companyno: companyno,
                        amount: amount,
                        key: key,
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
