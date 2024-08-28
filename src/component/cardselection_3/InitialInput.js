import React, { useState } from 'react';
import styled from 'styled-components';

function InitialInput({ setInitialOut }) {
    const [initial, setInitial] = useState('');

    const handleInputChange = (event) => {
        setInitialOut(event.target.value);
        setInitial(event.target.value);
        validateAndSave(event.target.value);
    };

    // 입력값 검증 및 저장 호출
    const validateAndSave = (string) => {
        if (
            string.length >= 11 ||
            /[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ♡♥_-]/.test(string)
        ) {
            alert('이니셜은 최대 10자까지 특수문자 ♡ ♥ _ -만 입력 가능합니다.');
            setInitial('');
            setInitialOut('');
            return;
        }
    };

    return (
        <section>
            <InitialTitle>이니셜 작성하기</InitialTitle>
            <InitialInputField
                aria-label="이니셜 입력"
                value={initial}
                onChange={handleInputChange}
            />
            <InitialGuideline>
                (이니셜은 최대 10자까지 특수문자 ♡ ♥ _ -만 입력 가능합니다.)
            </InitialGuideline>
        </section>
    );
}

const InitialTitle = styled.h2`
    text-align: left;
    margin-left: 17px;
    color: #000;
    margin-top: 50px;
`;

const InitialInputField = styled.input`
    border-radius: 5px;
    background-color: #f4f4f4;
    align-self: center;
    width: 90%;
    height: 20px;
    border: none;
    padding: 16px 12px;
    color: #bfbfbf;
`;

const InitialGuideline = styled.p`
    color: #bfbfbf;
    align-self: center;
    margin-top: 5px;
`;

export default InitialInput;
