import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button as MuiButton, TextField } from '@mui/material';
import DaumPostcode from 'react-daum-postcode';

const AddressInput = ({ setAddress, setDetailAddress }) => {
    const [detailAddress, setLocalDetailAddress] = useState('');
    const [isOpenPost, setIsOpenPost] = useState('');
    const [extraAddress, setExtraAddress] = useState('');
    const [address, setLocalAddress] = useState('');
    useEffect(() => {
        const script = document.createElement('script');
        script.src =
            'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            console.log('Daum Postcode script loaded');
        };

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    const handleAddressSearch = () => {
        if (window.daum && window.daum.Postcode) {
            new window.daum.Postcode({
                oncomplete: (data) => {
                    let addr = '';
                    let extraAddr = '';

                    if (data.userSelectedType === 'R') {
                        addr = data.roadAddress;
                    } else {
                        addr = data.jibunAddress;
                    }

                    if (data.userSelectedType === 'R') {
                        if (
                            data.bname !== '' &&
                            /[동|로|가]$/g.test(data.bname)
                        ) {
                            extraAddr += data.bname;
                        }
                        if (
                            data.buildingName !== '' &&
                            data.apartment === 'Y'
                        ) {
                            extraAddr +=
                                extraAddr !== ''
                                    ? ', ' + data.buildingName
                                    : data.buildingName;
                        }
                        if (extraAddr !== '') {
                            extraAddr = ' (' + extraAddr + ')';
                        }
                    }

                    setLocalAddress(addr);
                    setExtraAddress(extraAddr);
                    setAddress(addr + extraAddr);
                    document.getElementById('detailedAddress').focus(); // 포커스 설정
                },
            }).open();
        } else {
            console.error('Daum Postcode script is not loaded.');
        }
    };

    const handleDetailAddressChange = (e) => {
        setLocalDetailAddress(e.target.value);
        setDetailAddress(e.target.value); // 부모 컴포넌트로 상세주소 전달
    };

    return (
        <StyledAddressWrapper>
            <StyledMiddiv>
                <TextField
                    id="address"
                    label=""
                    variant="standard"
                    value={address}
                    // onChange={handleAddressChange}
                    sx={{ width: '80%' }}
                />
                <MuiButton
                    variant="contained"
                    sx={{
                        ml: 2,
                        backgroundColor: 'rgb(148, 160, 227)',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'rgb(120, 140, 200)',
                        },
                        width: '100px',
                    }}
                    onClick={handleAddressSearch}
                >
                    주소찾기
                </MuiButton>
            </StyledMiddiv>
            <StyledDetailInput
                id="detailedAddress"
                value={detailAddress}
                onChange={handleDetailAddressChange}
                placeholder="상세 주소를 입력해주세요"
                aria-label="상세 주소"
            />
        </StyledAddressWrapper>
    );
};

const StyledMiddiv = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    gap: 12px;
`;

const StyledAddressWrapper = styled.div`
    margin-bottom: 10px;
`;

const StyledAddressInputField = styled.input`
    border-radius: 3px;
    width: 100%;
    background-color: #fff;
    font-size: 10px;
    color: #757373;
    padding: 12px 13px;
    border: 1px solid #c0bdbd;
`;

const StyledDetailInput = styled.input`
    border-radius: 3px;
    width: 95%;
    background-color: #fff;
    font-size: 10px;
    color: #757373;
    padding: 12px 13px;
    border: 1px solid #c0bdbd;
    margin-top: 8px;
`;

export default AddressInput;
