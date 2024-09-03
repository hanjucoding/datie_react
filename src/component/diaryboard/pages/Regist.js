import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import RealHeader from '../../../component/RealHeader';
import Header from '../../../component/Header';
import Footer from '../../../component/Footer';
import DiaryDetail from '../components/DiaryDetail';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { format } from 'date-fns';
import { Rating } from '@mui/material';
import TextField from '@mui/material/TextField';
import { jwtDecode } from 'jwt-decode';

function Regist() {
    let token;
    const [userNo, setUserNo] = useState(0);
    const [userId, setUserId] = useState('user');
    const [param, setParam] = useState({
        user_no: 0,
        user_id: 'user',
    });

    useEffect(() => {
        const storedToken = localStorage.getItem('jwt');
        if (storedToken) {
            token = storedToken;
        }
        if (token) {
            const decoded = jwtDecode(token);
            console.log(decoded.userno);
            setUserNo(decoded.userno);
            setUserId(decoded.id);

            // param 업데이트
            setParam({
                user_no: decoded.userno,
                user_id: decoded.id,
            });
        }
        console.log(userNo);
        console.log(userId);
    }, []);

    console.log(param);

    const navigate = useNavigate();

    const [file, setFile] = useState([]); // 파일
    const [openEditorModal, setOpenEditorModal] = useState(false);
    const [dates, setDates] = useState([]); // API로부터 받은 날짜 리스트
    const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜
    const [diaryData, setDiaryData] = useState([]); // 선택된 날짜의 다이어리 데이터
    const [showDiaryDetail, setShowDiaryDetail] = useState(false); // 다이어리 상세 정보 표시 여부

    const handleOpenEditorModal = () => {
        fetchDates(); // 모달을 열기 전에 날짜를 가져옴
        setOpenEditorModal(true);
    };

    const handleCloseEditorModal = () => setOpenEditorModal(false);

    const handleChange = (e) => {
        setParam({
            ...param,
            [e.target.name]: e.target.value,
        });
    };

    const getApi = () => {
        const formData = new FormData();
        // 파일 데이터 저장
        file.forEach((f) => {
            formData.append('file', f);
        });
        for (let k in param) {
            formData.append(k, param[k]);
        }

        // selectedDate 추가
        if (selectedDate) {
            formData.append('selectedDate', selectedDate);
        }

        axios
            .post('http://localhost:8090/api/diaryboard/regist', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    charset: 'utf-8',
                },
            })
            .then((res) => {
                if (res.data.result === 'success') {
                    alert('정상적으로 저장되었습니다.');
                    navigate('/board/list');
                }
            });
    };

    const save = () => {
        if (window.confirm('글을 등록하시겠습니까?')) {
            getApi();
        }
    };

    const fetchDates = () => {
        axios
            .get('http://localhost:8090/api/diary/confirmdate', {
                params: { userno: userNo },
            })
            .then((res) => {
                // Remove duplicate dates
                const uniqueDates = Array.from(
                    new Set(
                        res.data.map(
                            (date) =>
                                new Date(date).toISOString().split('T')[0],
                        ),
                    ),
                );
                setDates(uniqueDates);
            })
            .catch((err) => {
                console.error('Failed to fetch dates:', err);
            });
    };

    const fetchDiaryDetails = (date) => {
        const formattedDate = format(new Date(date), 'yyyy-MM-dd');
        axios
            .get('http://localhost:8090/api/diary/detail', {
                params: {
                    userNo: userNo,
                    confirmDate: formattedDate,
                },
            })
            .then((res) => {
                const diaryData = res.data.map(
                    ({
                        diaryNo,
                        companyName,
                        rate,
                        review,
                        uploadOrg,
                        uploadReal,
                        category,
                    }) => ({
                        diaryNo,
                        companyName,
                        rate,
                        review,
                        uploadOrg,
                        uploadReal,
                        category,
                    }),
                );
                setDiaryData(diaryData);
            })
            .catch((err) => {
                console.error('Failed to fetch diary details:', err);
            });
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
        fetchDiaryDetails(date);
        console.log(date);
    };

    const handleCompleteSelection = () => {
        setShowDiaryDetail(true); // 선택 완료 시 다이어리 상세 정보를 표시
        handleCloseEditorModal(); // 모달 창 닫기
    };

    return (
        <div>
            <div>
                <RealHeader />
                <Header title={'커뮤니티'} />
                <div className="body">
                    <div className="sub">
                        <div className="size">
                            <div className="bbs">
                                <form
                                    method="post"
                                    name="frm"
                                    id="frm"
                                    encType="multipart/form-data"
                                >
                                    <div className="board_write">
                                        <TextField
                                            id="standard-basic"
                                            label="글 제목을 입력해주세요"
                                            variant="standard"
                                            name="title"
                                            onChange={handleChange}
                                            sx={{
                                                marginBottom: '16px',
                                            }} // 간격 추가
                                            InputProps={{
                                                sx: {
                                                    fontFamily: 'Gamja Flower', // 입력 텍스트의 폰트 변경
                                                },
                                            }}
                                            InputLabelProps={{
                                                sx: {
                                                    fontFamily: 'Gamja Flower', // 레이블의 폰트 변경
                                                },
                                            }}
                                        />

                                        <TextField
                                            id="filled-multiline-static"
                                            label="공유하고 싶은 내용을 작성해주세요"
                                            multiline
                                            rows={4}
                                            name="content"
                                            onChange={handleChange}
                                            sx={{
                                                marginBottom: '16px', // 간격 추가
                                            }}
                                            InputProps={{
                                                sx: {
                                                    fontFamily: 'Gamja Flower', // 입력 텍스트의 폰트 변경
                                                },
                                            }}
                                            InputLabelProps={{
                                                sx: {
                                                    fontFamily: 'Gamja Flower', // 레이블의 폰트 변경
                                                },
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <Button
                                            variant="text"
                                            sx={{
                                                fontSize: '16px', // 글꼴 크기
                                                padding: '3px 16px', // 버튼 크기 조정
                                                fontFamily: 'Gamja Flower',
                                                color: 'blue', // 글자색 파란색 설정
                                                fontWeight: 'bold', // 글자 두께를 두껍게 설정
                                                marginBottom: '10px',
                                            }}
                                            onClick={handleOpenEditorModal}
                                        >
                                            +등록할 일기를 선택해주세요{' '}
                                            <MenuBookIcon />
                                        </Button>
                                    </div>
                                    <Divider />
                                </form>
                            </div>
                            {/* 선택된 날짜의 다이어리 상세 정보 표시 */}
                            {showDiaryDetail && (
                                <DiaryDetail
                                    key={selectedDate}
                                    date={selectedDate}
                                />
                            )}
                            <div
                                className="btnSet"
                                style={{
                                    textAlign: 'right',
                                    marginTop: '20px',
                                    marginBottom: '20px',
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    onClick={save}
                                    sx={{
                                        fontFamily: 'Gamja Flower', // 폰트를 Gamja Flower로 설정
                                        fontSize: '16px', // 글자 크기 설정
                                        padding: '8px 16px', // 패딩 설정
                                        color: 'blue', // 글자색 파란색 설정
                                        borderColor: 'blue', // 테두리 색상을 파란색으로 설정
                                    }}
                                >
                                    등록하기
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Editor Modal 컴포넌트 */}
            <Modal
                open={openEditorModal}
                onClose={handleCloseEditorModal}
                aria-labelledby="editor-modal-title"
                aria-describedby="editor-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 600,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        maxHeight: '80vh', // 모달의 최대 높이를 설정하여 오버플로우 방지
                        overflowY: 'auto', // 스크롤 가능하게 설정
                    }}
                >
                    <h1>{userId}님의 데이트 기록</h1>
                    <ul
                        style={{
                            maxHeight: '150px', // 최대 높이를 설정하여 스크롤 가능하게 설정
                            overflowY: 'auto', // 스크롤 가능하게 설정
                            padding: 0,
                            margin: 0,
                            listStyleType: 'none', // 불릿 제거
                        }}
                    >
                        {dates.length > 0 ? (
                            dates.map((date, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleDateClick(date)}
                                    style={{
                                        cursor: 'pointer',
                                        padding: '8px 0', // 리스트 간격을 조금 추가
                                    }}
                                >
                                    {new Date(date).toLocaleDateString()}
                                </li>
                            ))
                        ) : (
                            <li>등록된 날짜가 없습니다.</li>
                        )}
                    </ul>
                    {selectedDate && (
                        <div>
                            <h2>
                                {new Date(selectedDate).toLocaleDateString()}{' '}
                                일기
                            </h2>
                            {diaryData.length > 0 ? (
                                <table
                                    style={{
                                        width: '100%',
                                        borderSpacing: '0 10px', // 열 간격을 추가
                                    }}
                                >
                                    <tbody>
                                        {diaryData.map((diary, index) => (
                                            <tr key={index}>
                                                <td
                                                    style={{
                                                        paddingRight: '5px',
                                                    }}
                                                >
                                                    <Rating
                                                        name={
                                                            diary.rate
                                                                ? 'conditional-read-only'
                                                                : 'no-value'
                                                        }
                                                        value={
                                                            diary.rate || null
                                                        }
                                                        size="small"
                                                        readOnly={true}
                                                    />
                                                </td>
                                                <td
                                                    style={{
                                                        paddingRight: '5px',
                                                    }}
                                                >
                                                    {diary.companyName}
                                                </td>
                                                <td>{diary.review}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No diary data available for this date.</p>
                            )}
                            <Button
                                variant="contained"
                                sx={{
                                    marginTop: '20px',
                                    backgroundColor: 'blue',
                                    color: 'white',
                                }}
                                onClick={handleCompleteSelection}
                            >
                                선택 완료
                            </Button>
                        </div>
                    )}
                </Box>
            </Modal>

            <div className="footer">
                <Footer />
            </div>
        </div>
    );
}

export default Regist;
