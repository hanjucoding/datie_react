import React from 'react';
import styled from 'styled-components';

const InputField = ({
    placeholder,
    error,
    buttonText,
    type = 'text',
    onButtonClick,
    onChange,
}) => {
    return (
        <InputWrapper>
            <InputContainer>
                <Input
                    type={type}
                    placeholder={placeholder}
                    onChange={onChange}
                />
                {buttonText && (
                    <Button onClick={onButtonClick}>{buttonText}</Button>
                )}
            </InputContainer>
            {error && <ErrorMessage>{error}</ErrorMessage>}
        </InputWrapper>
    );
};

const InputWrapper = styled.div`
    width: 100%;
`;

const InputContainer = styled.div`
    display: flex;
    align-items: center; // 수직 중앙 정렬
    gap: 20px;
`;

const Input = styled.input`
    border-radius: 3px;
    background-color: #fff;
    width: 100%;
    font-size: 10px;
    color: #757373;
    padding: 11px 13px;
    border: 1px solid #c0bdbd;
`;

const Button = styled.button`
    border-radius: 3px;
    background-color: #94a0e3;
    color: #fffcfc;
    font-size: 10px;
    white-space: nowrap;
    padding: 8px 12px;
    border: none;
    cursor: pointer;
`;

const ErrorMessage = styled.p`
    color: #dc1414;
    font-size: 10px;
    margin-top: 4px;
`;

export default InputField;
