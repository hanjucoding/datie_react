import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'; // axios를 사용하여 API 호출

function PasswordInput() {
    //비밀번호 입력 로직
    const [password, setPassword] = useState(['', '', '', '']);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [errorCount, setErrorCount] = useState(0);
    const [message, setMessage] = useState('비밀번호를 입력해주세요');
    const navigate = useNavigate();

    // 카드정보
    const [cardno, setCardno] = useState('');
    const [cardpw, setCardpw] = useState('0000'); // 기본값으로 설정되어 있으나, API에서 받아옴

    //PayInfo로부터 받은 결제정보
    const location = useLocation();
    const { companyno, content, amount, peramount, bonus, userno } =
        location.state || {};

    useEffect(() => {
        // 컴포넌트가 처음 렌더링될 때 API 호출
        axios
            .post('http://localhost:8090/api/cardpassword', { userno })
            .then((response) => {
                // 서버로부터 받은 카드 번호와 비밀번호를 설정
                const { cardpw, cardno } = response.data;
                setCardpw(cardpw.toString()); // 비밀번호는 문자열로 설정
                setCardno(cardno.toString()); // 카드 번호도 문자열로 설정
            })
            .catch((error) => {
                console.error('Error fetching card data', error);
                setMessage('카드 정보를 가져오는 데 실패했습니다.');
            });
    }, [userno]);

    // 비밀번호가 변경될 때마다 검사
    useEffect(() => {
        if (currentIndex === 4) {
            // 비밀번호가 모두 입력된 경우
            const enteredPassword = password.join('');
            if (enteredPassword === cardpw) {
                navigate('/pay/Payresult', {
                    state: {
                        companyno,
                        content,
                        amount,
                        peramount,
                        bonus,
                        cardno,
                    },
                });
                // 비밀번호가 맞으면 /pay/Payresult 페이지로 이동
            } else {
                // 비밀번호가 틀리면 초기화 및 오류 메시지 설정
                setPassword(['', '', '', '']);
                setCurrentIndex(0);
                setErrorCount((prevCount) => prevCount + 1); // 틀린 횟수 증가
                setMessage(`비밀번호가 틀렸습니다 (${errorCount + 1}/5)`); // 오류 메시지 업데이트
            }
        }
    }, [currentIndex, navigate, password, cardpw, errorCount]);

    const handleKeypadClick = (number) => {
        if (currentIndex < 4 && typeof number === 'number') {
            const newPass = [...password];
            newPass[currentIndex] = number;
            setPassword(newPass);
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleDelete = () => {
        if (currentIndex > 0) {
            const newPass = [...password];
            newPass[currentIndex - 1] = '';
            setPassword(newPass);
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '92vh',
                textAlign: 'center',
                paddingTop: '60px',
                backgroundColor: '#f0f0f0',
            }}
        >
            <div
                style={{
                    marginBottom: '20px',
                    textAlign: 'center',
                }}
            >
                <h1
                    style={{
                        fontSize: '50px',
                        color: '#696E77',
                        margin: '0',
                    }}
                >
                    Datie
                </h1>
                <p
                    style={{
                        fontSize: '30px',
                        color: errorCount > 0 ? 'red' : '#696E77',
                        margin: '0',
                        padding: '15px',
                    }}
                >
                    {message}
                </p>
            </div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '20px',
                }}
            >
                {password.map((_, index) => (
                    <input
                        key={index}
                        type="text"
                        value={password[index] ? '●' : '○'}
                        readOnly
                        style={{
                            width: '70px',
                            height: '70px',
                            fontSize: '100px',
                            color: '#C3FBFF',
                            textAlign: 'center',
                            marginRight: index < 3 ? '10px' : '0',
                            marginBottom: '55px',
                            border: 'none',
                            background: 'transparent',
                            textShadow: `0 0 2px #000, 0 0 3px #000, 0 0 4px #000`,
                        }}
                    />
                ))}
            </div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    width: '600px',
                    margin: '0 auto',
                }}
            >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, ' ', 0, '←'].map(
                    (number, index) => (
                        <button
                            key={index}
                            onClick={() =>
                                number === '←'
                                    ? handleDelete()
                                    : handleKeypadClick(number)
                            }
                            style={{
                                width: '200px',
                                height: '140px',
                                fontSize: '38px',
                                margin: '0px',
                                cursor: number !== '' ? 'pointer' : 'default',
                                backgroundColor:
                                    number === '' ? 'transparent' : '#46484B',
                                color: 'white',
                                border: 'none',
                            }}
                            disabled={number === ''}
                        >
                            {number}
                        </button>
                    ),
                )}
            </div>
        </div>
    );
}

export default PasswordInput;
