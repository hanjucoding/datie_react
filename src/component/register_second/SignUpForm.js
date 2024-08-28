import React, { useState } from 'react';
import styled from 'styled-components';
import InputField from './InputField';
import AddressInput from './AddressInput';
import ResponsiveAppBar from '../RealHeader';
import Footer from '../Footer';
import Header from '../Header';
import { Button as MuiButton, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUpForm = () => {
    const navigate = useNavigate();
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    // const [idnumber, setIdnumber] = useState('');
    const [hp, setHp] = useState('');
    const [accountno, setAccountno] = useState(''); // 계좌 인증 받는 4자리 숫자변수
    const [accountcheck, setAccountcheck] = useState('');
    const [accountMessage, setAccountMessage] = useState(''); // 계좌 인증 메시지 상태 추가
    const [sex, setSex] = useState('');
    const [age, setAge] = useState('');
    const [address, setAddress] = useState('');
    const [detailAddress, setDetailAddress] = useState('');
    const [selectedBank, setSelectedBank] = React.useState('');

    const [idCheckMessage, setIdCheckMessage] = useState(''); //아이디 중복상태저장용
    const [idCheckColor, setIdCheckColor] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); // 기본 제출 동작 방지
        console.log('주소:', address);
        console.log('상세주소:', detailAddress);

        try {
            console.log(accountno);
            const response = await axios.post('http://localhost:8090/signup', {
                id,
                pw,
                name,
                // idnumber,
                email,

                sex,
                age,
                hp,
                addr1: address,
                addr2: detailAddress,
                accountno,
                bank: selectedBank,
            });

            // 성공적으로 가입된 경우
            if (response.data.success) {
                alert('회원가입이 완료되었습니다!');
                navigate('/login');
            } else {
                alert(
                    '회원가입에 실패하였습니다: ' +
                        (response.data.message || '알 수 없는 오류'),
                );
            }
        } catch (error) {
            alert('모든 입력창에 입력을 해주십시오.');
        }
    };

    const handleAccountCheck = async () => {
        if (
            accountcheck.trim() === '' ||
            accountcheck.length !== 4 ||
            isNaN(accountcheck)
        ) {
            alert('인증번호 4자리를 입력해주세요.');
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:8090/check-fourdigit',
                {
                    accountno, // 계좌번호
                    accountcheck, // 전송된 4자리 숫자
                },
            );

            if (response.data.success) {
                setAccountMessage(
                    <span style={{ color: 'blue' }}>
                        인증이 완료되었습니다.
                    </span>,
                );
            } else {
                setAccountMessage(
                    <span style={{ color: 'red' }}>인증에 실패했습니다.</span>,
                );
            }
        } catch (error) {
            console.error('계좌 인증 중 오류 발생:', error);
            alert('계좌 인증 중 오류가 발생하였습니다.');
        }
    };

    const handleIdCheck = async () => {
        if (id.trim() === '') {
            alert('아이디를 입력해주세요.');
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:8090/check-id',
                { id },
            );
            setIdCheckMessage(response.data.message); // 상태 변수에 메시지 저장
            // 추가: 메시지에 따라 색상 설정
            setIdCheckColor(response.data.exists ? 'red' : 'blue'); // 색상 상태 추가
        } catch (error) {
            console.error('아이디 중복 확인 중 오류 발생:', error);
            alert('아이디 중복 확인 중 오류가 발생하였습니다.');
        }
    };

    const handleAccountno = async () => {
        if (accountno.trim() === '') {
            alert('계좌를 입력해주세요.');
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:8090/check-account',
                { accountno },
            );

            if (response.data.exists) {
                alert('계좌에 전송된 계좌주 끝 4자리를 입력하세요.');
            } else {
                alert('존재하지 않는 계좌입니다.');
            }
        } catch (error) {
            console.error('계좌 확인 중 오류 발생:', error);
            alert('계좌 확인 중 오류가 발생하였습니다.');
        }
    };

    const validatePasswords = (pass1, pass2) => {
        if (pass1 && pass2) {
            if (pass1 === pass2) {
                setPasswordMessage('비밀번호가 일치합니다.');
            } else {
                setPasswordMessage('비밀번호가 일치하지 않습니다.');
            }
        } else {
            setPasswordMessage(''); // 비밀번호가 입력되지 않은 경우 메시지 초기화
        }
    };

    const handlePasswordChange = (e) => {
        const password = e.target.value;
        setPw(password);
        validatePasswords(password, confirmPassword);
    };

    const handleConfirmPasswordChange = (e) => {
        const confirmPasswordValue = e.target.value;
        setConfirmPassword(confirmPasswordValue);
        validatePasswords(pw, confirmPasswordValue);
    };
    const handleBankChange = (event) => {
        setSelectedBank(event.target.value); // 은행 선택 시 상태 업데이트
    };

    return (
        <div>
            <ResponsiveAppBar />
            <Header title={'회원가입'} />
            <FormContainer onSubmit={handleSubmit}>
                <FormSection>
                    <MemberInfo>②회원정보 입력</MemberInfo>
                    <Component>아이디</Component>
                    <Middiv>
                        <InputField
                            placeholder="아이디 입력(6~20자)"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                        />
                        <MuiButton
                            variant="contained"
                            sx={{
                                backgroundColor: 'rgb(148, 160, 227)',
                                '&:hover': {
                                    backgroundColor: 'rgb(120, 140, 200)',
                                },
                                width: '100px',
                                fontFamily: '"Gamja Flower", cursive',
                            }}
                            onClick={handleIdCheck}
                        >
                            중복확인
                        </MuiButton>
                    </Middiv>
                    {idCheckMessage && (
                        <Component style={{ color: idCheckColor }}>
                            {idCheckMessage}
                        </Component>
                    )}
                    <Component>비밀번호</Component>
                    <InputField
                        placeholder="비밀번호 입력(문자, 숫자, 특수문자 포함 8~20자)"
                        type="pw"
                        onChange={handlePasswordChange}
                    />
                    <Component>비밀번호 확인</Component>
                    <InputField
                        placeholder="비밀번호 재입력"
                        type="pw"
                        onChange={handleConfirmPasswordChange}
                        style={{
                            color: pw === confirmPassword ? 'blue' : 'red',
                        }}
                    />
                    {passwordMessage && (
                        <div
                            style={{
                                color:
                                    passwordMessage === '비밀번호가 일치합니다.'
                                        ? 'blue'
                                        : 'red',
                            }}
                        >
                            {passwordMessage}
                        </div>
                    )}
                    <Component>이름</Component>
                    <InputField
                        placeholder="이름을 입력해주세요"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {/* <Component>주민등록번호</Component>
                    <InputField
                        placeholder="-를제외한 주민등록번호 13자리를 기입해주세요"
                        value={idnumber}
                        type="idnumber"
                        onChange={(e) => setIdnumber(e.target.value)}
                    /> */}
                    <GenderContainer>
                        <label>성별 : </label>
                        <label>
                            <input
                                type="radio"
                                value="남"
                                checked={sex === '남'}
                                onChange={(e) => setSex(e.target.value)}
                            />
                            남
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="여"
                                checked={sex === '여'}
                                onChange={(e) => setSex(e.target.value)}
                            />
                            여
                        </label>

                        <label style={{ marginLeft: '15px' }}>나이 :</label>
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            style={{ marginLeft: '10px' }} // 입력창과 레이블 사이 간격
                        />
                    </GenderContainer>
                    <Component>계좌</Component>
                    <Middiv style={{ marginTop: '10px' }}>
                        <BankContainer>
                            <Select
                                value={selectedBank}
                                onChange={handleBankChange}
                                displayEmpty
                                sx={{
                                    width: '100%',
                                    height: '35px',
                                }} // 스타일 추가
                            >
                                <MenuItem value="" disabled>
                                    은행 선택
                                </MenuItem>
                                <MenuItem value="신한">신한</MenuItem>
                                <MenuItem value="국민">국민</MenuItem>
                                <MenuItem value="기업">기업</MenuItem>
                                <MenuItem value="우리">우리</MenuItem>
                                {/* 추가 은행 항목을 여기에 추가 */}
                            </Select>
                        </BankContainer>

                        <Middiv>
                            <InputField
                                placeholder="(-)를 제외한 계좌번호를 입력해주세요"
                                value={accountno} // 계좌
                                onChange={(e) => setAccountno(e.target.value)}
                            />
                            <MuiButton
                                variant="contained"
                                sx={{
                                    backgroundColor: 'rgb(148, 160, 227)',
                                    '&:hover': {
                                        backgroundColor: 'rgb(120, 140, 200)',
                                    },
                                    width: '100px',
                                    fontFamily: '"Gamja Flower", cursive',
                                }}
                                onClick={handleAccountno} // 여기에 메서드 추가
                            >
                                인증요청
                            </MuiButton>
                        </Middiv>
                    </Middiv>
                    <Middiv style={{ marginTop: '10px' }}>
                        <InputField
                            placeholder="전송된 숫자 4자리를 입력해주세요"
                            value={accountcheck}
                            maxLength="4" // 최대 입력 길이를 4로 설정
                            onChange={(e) => {
                                const value = e.target.value;

                                // 숫자만 입력되도록 필터링하고 길이 체크
                                if (/^\d{0,4}$/.test(value)) {
                                    setAccountcheck(value); // 계좌 상태 업데이트
                                }
                            }}
                        />
                        <MuiButton
                            variant="contained"
                            sx={{
                                backgroundColor: 'rgb(148, 160, 227)',
                                '&:hover': {
                                    backgroundColor: 'rgb(120, 140, 200)',
                                },
                                width: '100px',
                                fontFamily: '"Gamja Flower", cursive',
                            }}
                            onClick={handleAccountCheck} // 계좌 인증 버튼 클릭 시 인증 로직 실행
                        >
                            계좌인증
                        </MuiButton>
                    </Middiv>
                    {/* 계좌 인증 메시지 표시 */}
                    {accountMessage && (
                        <AccountMessage>{accountMessage}</AccountMessage>
                    )}
                    <Component>전화번호</Component>
                    <InputField
                        placeholder="휴대폰 번호 입력('-'제외 11자리 입력)"
                        value={hp}
                        onChange={(e) => setHp(e.target.value)}
                    />
                    <Component>이메일주소</Component>
                    <InputField
                        placeholder="이메일을 기입해주세요"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {/* <EmailInput /> */}
                    <Component>주소</Component>
                    <AddressInput
                        setAddress={setAddress}
                        setDetailAddress={setDetailAddress}
                    />
                </FormSection>

                <ButtonGroup>
                    <MuiButton
                        variant="contained"
                        sx={{
                            mt: 1,
                            backgroundColor: 'rgb(148, 160, 227)',
                            '&:hover': {
                                backgroundColor: 'rgb(120, 140, 200)',
                            },
                            width: '100px',
                            fontFamily: '"Gamja Flower", cursive',
                        }}
                        type="submit"
                    >
                        가입하기
                    </MuiButton>
                    <MuiButton
                        variant="contained"
                        sx={{
                            mt: 1,
                            backgroundColor: 'rgb(148, 160, 227)',
                            '&:hover': {
                                backgroundColor: 'rgb(120, 140, 200)',
                            },
                            width: '100px',
                            fontFamily: '"Gamja Flower", cursive',
                        }}
                        onClick={() => navigate('/')}
                    >
                        취소
                    </MuiButton>
                </ButtonGroup>
            </FormContainer>
            <div className="footer">
                <Footer />
            </div>
        </div>
    );
};

// 스타일 컴포넌트
const AccountMessage = styled.div`
    margin-top: 10px;
    color: ${(props) => (props.isSuccess ? 'blue' : 'red')};
`;

// 스타일 컴포넌트
const FormContainer = styled.form`
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-weight: 700;
    padding: 12px 8px 0;
`;

const MemberInfo = styled.div`
    text-align: left;
    margin-bottom: 20px;
    font-size: 25px;
`;

const FormSection = styled.section`
    width: 80%;
`;

const ButtonGroup = styled.div`
    display: flex;
    margin-top: 12px;
    width: 190px;
    max-width: 100%;
    gap: 12px;
`;

const Component = styled.div`
    margin-top: 15px;
    text-align: left;
    font-size: 16px;
`;

const Middiv = styled.div`
    display: flex; // Flex를 사용하여 가로로 배치
    align-items: center; // 세로 정렬
    width: 100%;
    gap: 12px; // 요소 간 간격
`;

const GenderContainer = styled.div`
    margin-top: 15px;
    font-size: 16px;
`;

const BankContainer = styled.div``;

export default SignUpForm;
