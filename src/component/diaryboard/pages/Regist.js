import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import RealHeader from '../../../component/RealHeader';
import Header from '../../../component/Header';
import Footer from '../../../component/Footer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { format } from 'date-fns';

function Regist() {
    const navigate = useNavigate();
    const [param, setParam] = useState({
        user_no: 63, // 임시
    });
    const [file, setFile] = useState([]); // 파일
    const [openEditorModal, setOpenEditorModal] = useState(false);
    const [dates, setDates] = useState([]); // API로부터 받은 날짜 리스트
    const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜
    const [diaryData, setDiaryData] = useState([]); // 선택된 날짜의 다이어리 데이터

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
                params: { userno: param.user_no },
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
                    userNo: param.user_no,
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
    };

    return (
        <div>
            <div>
                <RealHeader />
                <Header title={'커뮤니티'} />
                <div className="body">
                    <div className="sub">
                        <div className="size">
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
                                    등록할 일기를 선택해주세요 <MenuBookIcon />
                                </Button>
                            </div>
                            <Divider />

                            <div className="bbs">
                                <form
                                    method="post"
                                    name="frm"
                                    id="frm"
                                    encType="multipart/form-data"
                                >
                                    <table className="board_write">
                                        <tbody>
                                            <tr>
                                                <th>제목</th>
                                                <td>
                                                    <input
                                                        type="text"
                                                        name="title"
                                                        onChange={handleChange}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>내용</th>
                                                <td>
                                                    <textarea
                                                        name="content"
                                                        onChange={handleChange}
                                                    ></textarea>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div
                                        className="btnSet"
                                        style={{ textAlign: 'right' }}
                                    >
                                        <Link className="btn" onClick={save}>
                                            저장
                                        </Link>
                                    </div>
                                </form>
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
                    <h1>user님의 데이트 기록</h1>
                    <ul>
                        {dates.length > 0 ? (
                            dates.map((date, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleDateClick(date)}
                                    style={{ cursor: 'pointer' }}
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
                                Diary Details for{' '}
                                {new Date(selectedDate).toLocaleDateString()}
                            </h2>
                            {diaryData.length > 0 ? (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Diary No</th>
                                            <th>Company Name</th>
                                            <th>Rate</th>
                                            <th>Review</th>
                                            <th>Upload Org</th>
                                            <th>Upload Real</th>
                                            <th>Category</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {diaryData.map((diary, index) => (
                                            <tr key={index}>
                                                <td>{diary.diaryNo}</td>
                                                <td>{diary.companyName}</td>
                                                <td>{diary.rate}</td>
                                                <td>{diary.review}</td>
                                                <td>{diary.uploadOrg}</td>
                                                <td>{diary.uploadReal}</td>
                                                <td>{diary.category}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No diary data available for this date.</p>
                            )}
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
