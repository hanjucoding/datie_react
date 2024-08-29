import React, { useState } from 'react';
import styled from 'styled-components';

function TermsAgreement({ isChecked, setIsChecked }) {
    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    return (
        <>
            <TermsContent>
                <p>
                    시행일자 : 2024년 08월 07일
                    <br />
                    <br />
                    제 1조 목적
                    <br />
                    1.
                    <br />
                    <br />
                    <br />제 2조 약관의 게시와 효력,
                    가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사
                    가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사가나다라마바사
                </p>
            </TermsContent>

            <CheckboxContainer>
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                />
                <AgreeText>동의합니다</AgreeText>
            </CheckboxContainer>
        </>
    );
}

const TermsContent = styled.div`
    color: #000;
    margin-top: 16px;
    display: flex;
    width: 550px; /* 부모 요소의 너비에 맞추기 */
    height: 200px; /* 고정된 높이 */
    overflow-y: auto; /* 스크롤 가능 */
    border: 1px solid #c0bdbd; /* 테두리 추가 */
    border-radius: 2px; /* 모서리 둥글게 */
    padding: 10px; /* 패딩 추가 */
    box-sizing: border-box; /* 패딩과 테두리를 포함한 전체 너비 계산 */
`;

const CheckboxContainer = styled.div`
    display: flex;
    justify-content: flex-end; /* 체크박스와 텍스트를 오른쪽 정렬 */
    align-items: center; /* 체크박스와 텍스트 수직 정렬 */
    margin-top: 10px; /* 약간의 여백 추가 */
`;

const AgreeText = styled.span`
    margin-right: 20px; /* 체크박스와 텍스트 사이의 간격 */
    font-size: 20px; /* 텍스트 크기 조정 */
`;

export default TermsAgreement;
