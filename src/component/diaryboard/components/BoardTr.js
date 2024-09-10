import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './BoardTr.css';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // jwtDecode를 잘못된 방식으로 사용하고 있어, 수정했습니다.
import Avatar from '@mui/material/Avatar';

const apiUrl = process.env.REACT_APP_API_URL;

function BoardTr(props) {
    const [companyNames, setCompanyNames] = useState([]);
    const [profileImageUrl, setProfileImageUrl] = useState(
        '/static/images/avatar/2.jpg',
    ); // 기본 아바타 이미지 URL
    let url = '/board/view?no=' + props.row.boardno;
    let nested = '';

    useEffect(() => {
        // 프로필 이미지 URL 가져오기
        axios
            .get(`${apiUrl}/api/profileImage/${props.row.user.userno}`, {
                responseType: 'blob',
            })
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
    }, []);

    useEffect(() => {
        async function fetchCompanyData() {
            try {
                const response = await axios.get(
                    `${apiUrl}/api/diaryboard/getcompany?no=${props.row.boardno}`,
                );
                const companies = response.data;
                // Extract company names from the response
                const names = companies.map((company) => company.companyName);
                setCompanyNames(names);
            } catch (error) {
                console.error('Error fetching company data:', error);
            }
        }

        fetchCompanyData();
    }, [props.row.boardno]);

    return (
        <div className="BoardItem">
            <div className="info_section">
                <div className="user_info">
                    <Avatar alt="Profile Image" src={profileImageUrl} />
                    {props.row.user ? props.row.user.id : ''}
                </div>
                <div className="title_wrapper">
                    <Link to={url}>{props.row.title}</Link>
                </div>
                <div className="content_wrapper">
                    {companyNames.map((name, index) => (
                        <div key={index} className="company-box">
                            #{name}
                        </div>
                    ))}
                </div>
                <div className="info_row">
                    <span>작성일: {props.row.writedate.substring(0, 10)}</span>
                    <span className="comment-count">
                        <RemoveRedEyeIcon className="icon" />
                        {props.row.viewcnt}
                        <ModeCommentIcon className="icon" />
                        {props.row.comment.length}
                        <FavoriteIcon className="icon" />
                        {props.row.likecnt}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default BoardTr;
