import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'; // axios를 사용하여 API 호출
import Swal from 'sweetalert2';
const apiUrl = process.env.REACT_APP_API_URL;

function PasswordInput() {
    const [password, setPassword] = useState(['', '', '', '']);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [errorCount, setErrorCount] = useState(0);
    const [message, setMessage] = useState('비밀번호를 입력해주세요');
    const [shuffledKeypad, setShuffledKeypad] = useState([]);
    const navigate = useNavigate();

    const [cardno, setCardno] = useState('');
    const [cardpw, setCardpw] = useState('0000');

    const location = useLocation();
    const { companyno, content, amount, peramount, bonus, userno, key } =
        location.state || {};

    useEffect(() => {
        axios
            .post(`${apiUrl}/api/cardpassword`, { userno })
            .then((response) => {
                const { cardpw, cardno } = response.data;
                setCardpw(cardpw.toString());
                setCardno(cardno.toString());
            })
            .catch((error) => {
                console.error('Error fetching card data', error);
                setMessage('카드 정보를 가져오는 데 실패했습니다.');
            });
    }, [userno]);

    useEffect(() => {
        const checkKeyStatus = async () => {
            try {
                const keyResponse = await axios.get(`${apiUrl}/api/check-key`, {
                    params: { key: key },
                });
                console.log('Key:', key);

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

        if (key) {
            checkKeyStatus();
        }

        if (currentIndex === 4) {
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
                        key,
                    },
                });
            } else {
                setPassword(['', '', '', '']);
                setCurrentIndex(0);
                setErrorCount((prevCount) => prevCount + 1);
                setMessage(`비밀번호가 틀렸습니다 (${errorCount + 1}/5)`);
                shuffleKeypad(); // 비밀번호가 틀렸을 때 키패드 섞기
            }
        }
    }, [currentIndex, navigate, password, cardpw, errorCount]);

    useEffect(() => {
        shuffleKeypad(); // 페이지 로딩 시 키패드 섞기
    }, []);

    // 배열을 섞는 함수
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    // 키패드를 섞는 함수 (' '와 '←' 제외)
    const shuffleKeypad = () => {
        const keypadNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
        shuffleArray(keypadNumbers); // 숫자 부분만 섞기
        const newKeypad = [
            ...keypadNumbers.slice(0, 9),
            ' ',
            keypadNumbers[9],
            '←',
        ];
        setShuffledKeypad(newKeypad);
    };

    const handleKeypadClick = (number) => {
        if (currentIndex < 4 && typeof number === 'number') {
            const newPass = [...password];
            newPass[currentIndex] = number.toString();
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
                {shuffledKeypad.map((number, index) => (
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
                ))}
            </div>
        </div>
    );
}

export default PasswordInput;
