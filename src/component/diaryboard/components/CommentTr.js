import { Link } from 'react-router-dom';
import './CommentTr.css';
import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import Avatar from '@mui/material/Avatar';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { jwtDecode } from 'jwt-decode';

function CommentTr(props) {
    let token;
    const [userNo, setUserNo] = useState(0);
    const [userId, setUserId] = useState('user');

    useEffect(() => {
        const storedToken = localStorage.getItem('jwt');
        if (storedToken) {
            token = storedToken;
        }
        if (token) {
            const decoded = jwtDecode(token);
            console.log(decoded);
            setUserNo(decoded.userno);
            setUserId(decoded.id);
        }
        console.log(userNo);
        console.log(userId);
    }, [props]);

    //작성자프로필
    const [profileImageUrl, setProfileImageUrl] = useState(
        '/static/images/avatar/2.jpg',
    ); // 기본 아바타 이미지 URL

    useEffect(() => {
        if (props) {
            // 프로필 이미지 URL 가져오기
            axios
                .get(
                    `http://localhost:8090/api/profileImage/${props.row.user.userno}`,
                    {
                        responseType: 'blob',
                    },
                )
                .then((response) => {
                    setProfileImageUrl(URL.createObjectURL(response.data)); // 받은 URL로 프로필 이미지 설정
                })
                .catch((error) => {
                    console.error(
                        '프로필 이미지를 가져오는 중 오류가 발생했습니다:',
                        error,
                    );
                    // 오류 발생 시 기본 이미지로 유지
                });
        }
    }, [props]); // data가 변경될 때마다 실행

    console.log(props.row.user.userno);
    console.log(userNo);
    return (
        <div className="commentlist">
            <div className="user_info">
                <Avatar
                    alt="Profile Image"
                    src={profileImageUrl}
                    sx={{ width: 30, height: 30 }}
                />
                {props.row.user ? props.row.user.id : ''}
            </div>
            <div className="txt_l">
                {props.row.content} &nbsp;&nbsp;&nbsp;
                {props.row.user.userno == userNo && (
                    <DeleteForeverIcon
                        className="delBtn"
                        sx={{
                            cursor: 'pointer',
                            color: 'gray',
                            fontSize: 20,
                        }}
                        onClick={() => props.delComment(props.row.commentno)}
                    />
                )}
            </div>

            <div className="date">{props.row.writedate.substring(0, 10)}</div>
        </div>
    );
}

export default CommentTr;
