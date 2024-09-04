import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import CommentTr from '../components/CommentTr.js';
import RealHeader from '../../../component/RealHeader';
import Header from '../../../component/Header';
import Footer from '../../../component/Footer';
import './View.css';
import DiaryDetail from '../components/DiaryDetail.js';
import Avatar from '@mui/material/Avatar';
import { jwtDecode } from 'jwt-decode'; // import from 'jwt-decode', not { jwtDecode }
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { colors } from '@mui/material';

function View(props) {
    const navigate = useNavigate();
    console.log(props);
    const apiUrl = process.env.REACT_APP_API_URL;

    let token;

    const [userNo, setUserNo] = useState(0);
    const [userId, setUserId] = useState('user');
    const [params, setParams] = useSearchParams();
    const [data, setData] = useState(null);
    const no = params.get('no');
    console.log(no);

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
    }, []);

    useEffect(() => {
        if (userNo && params.get('no')) {
            setParam((prevParam) => ({
                ...prevParam,
                user_no: Number(userNo),
                parent_no: Number(params.get('no')),
            }));
        }
    }, [userNo, params]);

    console.log(userNo);
    console.log(userId);

    const getView = () => {
        axios.get(`${apiUrl}/api/diaryboard/view?no=` + no).then((res) => {
            setData(res.data);
        });
    };

    // 댓글관련
    const [totalElements, setTotalElements] = useState(0); // 총개수
    const [totalPages, setTotalPages] = useState(0); // 총페이지
    const [currentPage, setCurrentPage] = useState(1); // 현재페이지
    const [comment, setComment] = useState(null);
    const [param, setParam] = useState({
        page: 1,
        user_no: Number(userNo),
        parent_no: Number(no),
    });

    const getCommentList = () => {
        axios
            .get(`${apiUrl}/api/comment/list`, { params: param })
            .then((res) => {
                setComment(res.data.result.content);
                setTotalElements(res.data.result.totalElements);
                setTotalPages(res.data.result.totalPages);
                setCurrentPage(res.data.result.number + 1);
            });
    };

    useEffect(() => {
        getCommentList();
        getView();
        console.log(data);
    }, [no, param.page]);

    //작성자프로필
    const [profileImageUrl, setProfileImageUrl] = useState(
        '/static/images/avatar/2.jpg',
    ); // 기본 아바타 이미지 URL

    useEffect(() => {
        if (data && data.user && data.user.userno) {
            axios
                .get(`${apiUrl}/api/profileImage/${data.user.userno}`, {
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
                });
        }
    }, [data]);

    const handleChange = (e) => {
        setParam({
            ...param,
            [e.target.name]: e.target.value,
        });
    };

    const handlePageChange = (event, value) => {
        setParam({
            ...param,
            page: value,
        });
    };

    const saveComment = () => {
        console.log(param);

        axios.post(`${apiUrl}/api/comment/regist`, param).then((res) => {
            console.log(res);
            if (res.data.result === 'success') {
                alert('정상적으로 저장되었습니다.');
                setParam({
                    ...param,
                    content: '',
                });
                getCommentList();
            }
        });
    };

    const save = () => {
        if (window.confirm('글을 등록하시겠습니까?')) {
            saveComment();
        }
    };

    const delComment = (no) => {
        let url = `${apiUrl}/api/comment/delete?no=` + no;
        console.log('commentno: ' + no);
        if (window.confirm('댓글을 삭제하시겠습니까?')) {
            axios.get(url).then((res) => {
                if (res.data.result === 'success') {
                    alert('정상적으로 삭제되었습니다.');
                    getCommentList();
                }
            });
        }
    };

    const goEdit = (e) => {
        e.preventDefault();
        navigate('/board/edit?no=' + no);
    };
    const goReply = (e) => {
        e.preventDefault();
        navigate('/board/reply?no=' + no);
    };
    const goDelete = (e) => {
        e.preventDefault();
        if (window.confirm('삭제하시겠습니까?')) {
            axios
                .post(`${apiUrl}/api/diaryboard/delete`, {
                    no: Number(no),
                })
                .then((res) => {
                    if (res.data.result === 'success') {
                        alert('정상적으로 삭제되었습니다.');
                        navigate('/board/list');
                    }
                });
        } else {
            e.preventDefault();
        }
    };
    const [isLiked, setIsLiked] = useState(false);
    const handleIconClick = () => {
        setIsLiked((prevState) => !prevState);
    };
    console.log(data);

    return (
        <div>
            <div>
                <RealHeader />
                <Header title={'커뮤니티'} />

                <div className="view">
                    <div className="user_info">
                        <Avatar alt="Profile Image" src={profileImageUrl} />
                        {data ? data.user.id : ''}
                        <div className="btn">
                            {data && data.user.userno == userNo && (
                                <EditIcon
                                    onClick={goEdit}
                                    style={{ cursor: 'pointer' }}
                                />
                            )}
                            {data && data.user.userno != userNo && (
                                <div
                                    onClick={handleIconClick}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {isLiked ? (
                                        <ThumbUpAltIcon />
                                    ) : (
                                        <ThumbUpOffAltIcon />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="title">{data && data.title}</div>
                    <div className="contents">
                        <p
                            dangerouslySetInnerHTML={{
                                __html: data && data.content,
                            }}
                        ></p>
                    </div>
                    <Divider />
                    <div className="diary">
                        {data && data.diarydate ? (
                            <DiaryDetail date={data.diarydate} />
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>
                    <Divider />
                </div>

                <div className="board_write">
                    <TextField
                        id="filled-multiline-static"
                        label="댓글"
                        multiline
                        rows={2}
                        name="content"
                        value={param.content}
                        onChange={handleChange}
                        sx={{
                            width: '100%',
                            marginBottom: '5px',
                        }}
                        InputProps={{
                            sx: {
                                fontFamily: 'Gamja Flower',
                            },
                        }}
                        InputLabelProps={{
                            sx: {
                                fontFamily: 'Gamja Flower',
                            },
                        }}
                    />
                    <div className="btn">
                        <Button
                            variant="text"
                            onClick={save}
                            sx={{
                                fontFamily: 'Gamja Flower',
                                fontSize: '16px',
                                color: 'blue',
                                borderColor: 'blue',
                            }}
                        >
                            댓글 등록하기
                        </Button>
                    </div>

                    <p>
                        <span>
                            <strong>총 {totalElements}개</strong> |{' '}
                            {currentPage}/{totalPages}
                        </span>
                    </p>
                    <div className="comment">
                        {comment ? (
                            comment.map((row, i) => (
                                <CommentTr
                                    row={row}
                                    key={i}
                                    delComment={delComment}
                                />
                            ))
                        ) : (
                            <tr>
                                <td className="first" colSpan="4">
                                    등록된 댓글이 없습니다.
                                </td>
                            </tr>
                        )}
                    </div>

                    <Stack
                        spacing={2}
                        sx={{
                            marginTop: '20px',
                            alignItems: 'center',
                            marginBottom: '40px',
                        }}
                    >
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                            sx={{
                                '& .MuiPaginationItem-root': {
                                    fontSize: '18px', // 글꼴 크기
                                    padding: '10px', // 크기 조정
                                    fontFamily: 'Gamja Flower', // 글꼴 스타일
                                },
                            }}
                        />
                    </Stack>
                </div>
            </div>

            <div className="footer">
                <Footer />
            </div>
        </div>
    );
}

export default View;
