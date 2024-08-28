import React, { useState } from 'react';
import styled from 'styled-components';
import TermsAgreement from './TermsAgreement';
import ActionButtons from './ActionButton';
import ResponsiveAppBar from '../RealHeader';
import Footer from '../Footer';
import Header from '../Header';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

function SignUpComponent() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [idNumber1, setIdNumber1] = useState('');
    const [idNumber2, setIdNumber2] = useState('');
    const [isChecked, setIsChecked] = useState(false);

    const [error, setError] = useState('');
    const handleNext = async (e) => {
        e.preventDefault();

        if (!isChecked) {
            alert('약관에 동의해야 합니다.'); // 메시지 수정
            return; // 체크되지 않으면 다음 단계로 넘어가지 않음
        } else {
            setError(''); // 에러 메시지를 초기화
            navigate('/signup'); // 체크되면 다음 페이지로 이동
        }
    };

    return (
        <div>
            <ResponsiveAppBar />
            <Header title={'실명확인'} />
            <StyledContainer>
                <SignUpHeader>
                    {/* <Comtext>①약관동의 / 실명확인</Comtext> */}
                </SignUpHeader>
                <TermsAgreement
                    isChecked={isChecked}
                    setIsChecked={setIsChecked}
                />
                {error && <div className="error-message">{error}</div>}{' '}
                {/* 에러 메시지 표시 */}
                <VerificationSection>
                    <h2 className="section-title">
                        실명확인(주민등록번호 / 외국인등록번호)
                    </h2>
                    <VerificationForm>
                        <div className="form-row">
                            <label htmlFor="name">이름</label>
                            <input
                                type="text"
                                id="name"
                                className="input-field"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        {/* <div className="form-row">
                            <label htmlFor="id-number">
                                주민등록번호
                                <br />
                                [외국인등록번호]
                            </label>
                            <div className="id-number-inputs">
                                <input
                                    type="text"
                                    id="id-number-1"
                                    className="input-field"
                                    pattern="\d{6}"
                                    maxLength="6"
                                    value={idNumber1}
                                    onChange={(e) =>
                                        setIdNumber1(e.target.value)
                                    }
                                    required
                                />
                                <span className="separator">-</span>
                                <input
                                    type="password"
                                    id="id-number-2"
                                    className="input-field"
                                    pattern="\d{7}"
                                    maxLength="7"
                                    value={idNumber2}
                                    onChange={(e) =>
                                        setIdNumber2(e.target.value)
                                    }
                                    required
                                />
                            </div>
                        </div> */}
                    </VerificationForm>
                </VerificationSection>
                <ActionButtons handleNext={handleNext} />
                <div className="footer">
                    <Footer />
                </div>
            </StyledContainer>
        </div>
    );
}

const StyledContainer = styled.div`
    padding-left: 20px;
    padding-right: 20px;
`;

const SignUpHeader = styled.header`
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    padding: 0 8px;

    .title {
        color: #000;
    }

    .divider {
        margin-top: 16px;
        width: 100%;
        height: 1px;
        border: none;
        background-color: #000;
    }
`;

const VerificationSection = styled.section`
    display: flex;
    margin-top: 33px;
    width: 100%;
    flex-direction: column;
    padding: 0 8px;

    .section-title {
        color: #050505;
        align-self: flex-start;
    }
`;

const VerificationForm = styled.form`
    border-radius: 2px;
    background-color: #fff;
    margin-top: 11px;
    width: 500px;
    padding: 34px 24px;
    border: 1px solid #c0bdbd;

    .form-row {
        display: flex;
        align-items: center;
        margin-bottom: 9px;
        gap: 10px;
        width: 100%;
    }

    label {
        color: #050505;
        text-align: center;
        white-space: nowrap;
        flex: 0 0 120px;
    }

    .input-field {
        background-color: #fff;
        flex: 1;
        height: 24px;
        border: 1px solid #c0bdbd;
    }

    .id-number-inputs {
        display: flex;
        gap: 4px;
        flex: 1;
    }

    .separator {
        align-self: center;
    }

    @media (max-width: 640px) {
        .input-field {
            margin-left: 18px;
            padding-right: 23px;
        }
    }
`;

export default SignUpComponent;
