import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button as MuiButton } from '@mui/material'; // Material-UI Button 임포트

import ResponsiveAppBar from '../RealHeader';
import Footer from '../Footer';
import Header from '../Header';
import InitialInput from './InitialInput';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'; // UTC 플러그인
import timezone from 'dayjs/plugin/timezone'; // 타임존 플러그인
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
function CardInfoInput() {
    // 플러그인 사용
    dayjs.extend(utc);
    dayjs.extend(timezone);

    // 서울 시간대 설정
    dayjs.tz.setDefault('Asia/Seoul');

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const userno1 = queryParams.get('userno1');
    const userno2 = queryParams.get('userno2');
    const userno1Type = queryParams.get('userno1Type');
    const userno2Type = queryParams.get('userno2Type');

    const [param, setParam] = useState({
        userno1: userno1,
        userno2: userno2,
    });
    const [names, setNames] = useState([
        { id: 1, name: '카리나' },
        { id: 2, name: '전한주' },
    ]);
    useEffect(() => {
        getApi();
    }, []);
    const getApi = () => {
        axios
            .get('http://localhost:8090/api/userInfoByNo', { params: param })
            .then((res) => {
                console.log(res);
                setNames(res.data);
                // setData(res.data.result.content);
                // setTotalElements(res.data.result.totalElements);
                // setTotalPages(res.data.result.totalPages);
                // setCurrentPage(res.data.result.number + 1);
                // setPageList(res.data.pageList);
                // setPrevPage(res.data.prevPage);
                // setNextPage(res.data.nextPage);
            });
    };
    const [password1, setPassword1] = useState('');
    const [confirmPassword1, setConfirmPassword1] = useState('');
    const [isMatch1, setIsMatch1] = useState(false);
    const [password2, setPassword2] = useState('');
    const [confirmPassword2, setConfirmPassword2] = useState('');
    const [isMatch2, setIsMatch2] = useState(false);

    const [dateValue, setDateValue] = React.useState(
        dayjs.tz('2000-01-01', 'Asia/Seoul'),
    );

    const handlePasswordChange1 = (e) => {
        setPassword1(e.target.value);
        checkPasswordMatch1(e.target.value, confirmPassword1);
    };

    const handleConfirmPasswordChange1 = (e) => {
        setConfirmPassword1(e.target.value);
        checkPasswordMatch1(password1, e.target.value);
    };

    const checkPasswordMatch1 = (password1, confirmPassword1) => {
        setIsMatch1(password1 === confirmPassword1 && password1.length === 4);
    };

    const handlePasswordChange2 = (e) => {
        setPassword2(e.target.value);
        checkPasswordMatch2(e.target.value, confirmPassword2);
    };

    const handleConfirmPasswordChange2 = (e) => {
        setConfirmPassword2(e.target.value);
        checkPasswordMatch2(password2, e.target.value);
    };

    const checkPasswordMatch2 = (password2, confirmPassword2) => {
        setIsMatch2(password2 === confirmPassword2 && password2.length === 4);
    };

    const [selectedNameId, setSelectedNameId] = useState(0); // 기본 선택된 이름 ID
    const [initial, setInitial] = useState('');

    const handleNameSelect = (id) => {
        setSelectedNameId(id); // 선택된 이름 ID 업데이트
    };

    const handleSave = (initialValue) => {
        if (!isMatch1) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
    };

    const handlePreview = () => {
        alert('미리보기 기능이 아직 구현되지 않았습니다.');
    };
    const navigate = useNavigate();

    const handleSubmit = () => {
        // user1에 대한 데이터 준비
        let user1Data = {};
        user1Data.cardpw = password1;
        user1Data.userno = userno1;
        user1Data.usernoLover = userno2;
        user1Data.cstatus = 1;
        user1Data.cardtypeno = userno1Type;
        user1Data.titleHolder = selectedNameId;
        user1Data.initial = initial;
        user1Data.initialDate = dateValue
            .add(9, 'hour')
            .format('YYYY-MM-DD HH:mm:ss');

        // user2에 대한 데이터 준비
        let user2Data = {};
        user2Data.cardpw = password2;
        user2Data.userno = userno2;
        user2Data.usernoLover = userno1;
        user2Data.cstatus = 1;
        user2Data.cardtypeno = userno2Type;
        user2Data.titleHolder = selectedNameId;
        user2Data.initial = initial;
        user2Data.initialDate = dateValue
            .add(9, 'hour')
            .format('YYYY-MM-DD HH:mm:ss');
        let param = [user1Data, user2Data];

        console.log(dateValue.add(9, 'hour').format('YYYY-MM-DD HH:mm:ss'));
        //POST 요청
        axios
            .post('http://localhost:8090/api/creationCard', param)
            .then((response) => {
                console.log('User1 data sent successfully:', response.data);
                // 추가적인 처리 (예: 성공 알림 등)
                alert('성공적으로 카드생성 하였습니다.');
                navigate('/');
            })
            .catch((error) => {
                console.error('Error sending user1 data:', error);
                // 에러 처리
            });
    };

    return (
        <div>
            <ResponsiveAppBar />
            <Header title={'카드 정보입력'} />
            <CardInfoContainer>
                <MidContent>
                    <section>
                        <PasswordTitle>
                            {names[0].name} 비밀번호 설정
                        </PasswordTitle>
                        <PasswordInput
                            type="password"
                            placeholder="숫자 4글자를 입력해 주세요."
                            value={password1}
                            onChange={handlePasswordChange1}
                            maxLength={4} // 4자리로 제한
                        />
                        <PasswordConfirmTitle>
                            {names[0].name} 비밀번호 확인
                        </PasswordConfirmTitle>
                        <PasswordConfirmInput
                            type="password"
                            value={confirmPassword1}
                            placeholder="숫자 4글자를 다시 입력해 주세요."
                            onChange={handleConfirmPasswordChange1}
                            maxLength={4} // 4자리로 제한
                        />
                        <PasswordMatchStatus>
                            {isMatch1 ? (
                                <>
                                    <StatusIcon
                                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/402fe68a2831d654198b5fc7d809cd8d5ceeb46a91bc4dc4ab77a71692e84708?placeholderIfAbsent=true&apiKey=d9ab0808f42f485d9f1f9f59597e6744"
                                        alt="Password match status"
                                    />
                                    <StatusText>
                                        비밀번호가 일치합니다
                                    </StatusText>
                                </>
                            ) : (
                                confirmPassword1.length > 0 && (
                                    <StatusText style={{ color: '#e74c3c' }}>
                                        비밀번호가 일치하지 않습니다
                                    </StatusText>
                                )
                            )}
                        </PasswordMatchStatus>
                    </section>
                    <section>
                        <PasswordTitle>
                            {names[1].name} 비밀번호 설정
                        </PasswordTitle>
                        <PasswordInput
                            type="password"
                            placeholder="숫자 4글자를 입력해 주세요."
                            value={password2}
                            onChange={handlePasswordChange2}
                            maxLength={4} // 4자리로 제한
                        />
                        <PasswordConfirmTitle>
                            {names[1].name} 비밀번호 확인
                        </PasswordConfirmTitle>
                        <PasswordConfirmInput
                            type="password"
                            value={confirmPassword2}
                            placeholder="숫자 4글자를 다시 입력해 주세요."
                            onChange={handleConfirmPasswordChange2}
                            maxLength={4} // 4자리로 제한
                        />
                        <PasswordMatchStatus>
                            {isMatch2 ? (
                                <>
                                    <StatusIcon
                                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/402fe68a2831d654198b5fc7d809cd8d5ceeb46a91bc4dc4ab77a71692e84708?placeholderIfAbsent=true&apiKey=d9ab0808f42f485d9f1f9f59597e6744"
                                        alt="Password match status"
                                    />
                                    <StatusText>
                                        비밀번호가 일치합니다
                                    </StatusText>
                                </>
                            ) : (
                                confirmPassword2.length > 0 && (
                                    <StatusText style={{ color: '#e74c3c' }}>
                                        비밀번호가 일치하지 않습니다
                                    </StatusText>
                                )
                            )}
                        </PasswordMatchStatus>
                    </section>
                    <section>
                        <NameSelectionTitle>명의자 선택</NameSelectionTitle>
                        <NameList>
                            {names.map((item) => (
                                <NameItem
                                    key={item.userno}
                                    onClick={() =>
                                        handleNameSelect(item.userno)
                                    }
                                >
                                    <RadioButton
                                        selected={
                                            selectedNameId === item.userno
                                        }
                                    >
                                        {selectedNameId === item.userno && (
                                            <RadioButtonInner />
                                        )}
                                    </RadioButton>
                                    <NameText>{item.name}</NameText>
                                </NameItem>
                            ))}
                        </NameList>
                    </section>
                    <section>
                        <NameSelectionTitle>연애 시작 날짜</NameSelectionTitle>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker
                                    label="연애 시작 날짜"
                                    value={dateValue}
                                    onChange={(newValue) => {
                                        setDateValue(newValue);
                                    }}
                                    sx={{ width: '90%' }} // 너비를 80%로 줄임
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </section>
                    <InitialInput setInitialOut={setInitial} />{' '}
                    {/* onSave prop 전달 */}
                </MidContent>

                <ButtonContainer>
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
                        onClick={function () {
                            if (
                                selectedNameId != 0 &&
                                isMatch1 &&
                                isMatch2 &&
                                initial != ''
                            ) {
                                handleSubmit();
                            } else {
                                alert('정보를 모두 입력해 주세요');
                            }
                        }}
                    >
                        선택하기
                    </MuiButton>
                </ButtonContainer>
            </CardInfoContainer>
            <div className="footer">
                <Footer />
            </div>
        </div>
    );
}

const MidContent = styled.div`
    width: 100%;
    align-items: center;
    margin-left: 15px;
`;

const CardInfoContainer = styled.main`
    background-color: #fff;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 21px 15px 37px;
    @media (max-width: 640px) {
        margin: 0 auto;
    }
`;

const PasswordTitle = styled.h2`
    color: #000;
    margin-top: 30px;
    margin-left: 20px;
    text-align: left; /* 왼쪽 정렬 */
`;

const InputStyle = `
  border-radius: 5px;
  background-color: #f4f4f4;
  align-self: center;
  width: 90%;
  height: 20px;
  border: none;
  padding: 16px 12px; /* 동일한 패딩 값 */
  color: #bfbfbf;
`;

const PasswordInput = styled.input`
    ${InputStyle}
`;

const PasswordConfirmTitle = styled.h2`
    margin-left: 20px;
    color: #000;
    margin-top: 20px;
    text-align: left; /* 왼쪽 정렬 */
`;

const PasswordConfirmInput = styled.input`
    ${InputStyle}
`;

const PasswordMatchStatus = styled.div`
    display: flex;
    margin-top: 8px;
    gap: 2px; /* 간격을 줄임 */
    color: #35cd2a;
`;

const StatusIcon = styled.img`
    aspect-ratio: 1;
    object-fit: contain;
    margin-left: 10px;
    object-position: center; /* 이미지 위치 조정 */
    width: 25px;
`;

const StatusText = styled.span`
    margin-left: 15px; /* 간격을 줄임 */
    flex-basis: auto;
`;

const NameSelectionTitle = styled.h2`
    color: #000;
    margin-top: 45px;
    margin-left: 18px;
    text-align: left; /* 왼쪽 정렬 */
`;

const NameList = styled.div`
    display: flex;
    gap: 40px 46px;
    margin: 30px 0 0 23px;
`;

const NameItem = styled.label`
    font-size: 22px;
    display: flex;
    gap: 9px;
    align-items: center;
    cursor: pointer;
`;

const RadioButton = styled.div`
    background-color: #fff;
    border-radius: 50%;
    display: flex;
    width: 15px;
    height: 15px;
    border: 3px solid #afafaf;
    align-items: center;
    justify-content: center;
`;

const RadioButtonInner = styled.div`
    background-color: #03d63b;
    border-radius: 50%;
    width: 10px;
    height: 10px;
`;

const NameText = styled.span`
    color: #000;
`;

const ButtonContainer = styled.div`
    align-self: center;
    display: flex;
    margin-top: 46px;
    width: 189px;
    max-width: 100%;
    gap: 11px;
`;

export default CardInfoInput;
