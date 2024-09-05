import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import BoardTr from '../components/BoardTr';
import RealHeader from '../../../component/RealHeader';
import Header from '../../../component/Header';
import Footer from '../../../component/Footer';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import SearchIcon from '@mui/icons-material/Search';
import CreateIcon from '@mui/icons-material/Create';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import Divider from '@mui/material/Divider';

function BoardList() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [data, setData] = useState(null);
    const [totalElements, setTotalElements] = useState(0); // 총개수
    const [totalPages, setTotalPages] = useState(0); // 총페이지
    const [currentPage, setCurrentPage] = useState(0); // 현재페이지
    const [param, setParam] = useState({
        page: 1,
        searchType: 'all',
        searchWord: '',
    });
    const searchTypeRef = useRef(null); // 검색타입
    const searchWordRef = useRef(null); // 검색어
    const getApi = () => {
        axios
            .get(`${apiUrl}/api/diaryboard/list`, { params: param })
            .then((res) => {
                setData(res.data.result.content);
                setTotalElements(res.data.result.totalElements);
                setTotalPages(res.data.result.totalPages);
                setCurrentPage(res.data.result.number + 1);
            });
    };
    useEffect(() => {
        getApi();
    }, [param]);

    const search = (e) => {
        e.preventDefault();
        setParam({
            ...param,
            searchType: searchTypeRef.current.value,
            searchWord: searchWordRef.current.value,
        });
    };

    const handlePageChange = (event, value) => {
        setParam({
            ...param,
            page: value,
        });
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
                                <p
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <span>
                                        <strong>총 {totalElements}개</strong> |{' '}
                                        {currentPage}/{totalPages}
                                        페이지
                                    </span>
                                    <span className="btnSet">
                                        <Link to="/board/regist">
                                            <Button
                                                variant="text"
                                                sx={{
                                                    fontSize: '16px', // 글꼴 크기
                                                    padding: '3px 16px', // 버튼 크기 조정
                                                    fontFamily: 'Gamja Flower',
                                                    color: 'black', // 글자색 파란색 설정
                                                    fontWeight: 'bold', // 글자 두께를 두껍게 설정
                                                }}
                                            >
                                                일기 공유하기
                                                <CreateIcon />
                                            </Button>
                                        </Link>
                                    </span>
                                </p>
                                <div
                                    className="bbsSearch"
                                    style={{
                                        marginTop: '20px',
                                        textAlign: 'center',
                                        marginBottom: '20px',
                                    }}
                                >
                                    <form
                                        method="get"
                                        name="searchForm"
                                        id="searchForm"
                                        onSubmit={search}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            gap: '10px',
                                        }}
                                    >
                                        <Select
                                            id="stype"
                                            name="stype"
                                            defaultValue="all"
                                            inputRef={searchTypeRef}
                                            variant="outlined"
                                            sx={{
                                                minWidth: 80,
                                                height: '40px', // 높이 설정
                                                fontFamily:
                                                    'Gamja Flower, cursive', // 폰트 설정
                                                fontSize: '16px', // 글꼴 크기
                                            }}
                                        >
                                            <MenuItem value="all">
                                                전체
                                            </MenuItem>
                                            <MenuItem value="title">
                                                제목
                                            </MenuItem>
                                            <MenuItem value="content">
                                                내용
                                            </MenuItem>
                                        </Select>
                                        <TextField
                                            id="sval"
                                            name="sval"
                                            label="검색어 입력"
                                            variant="outlined"
                                            inputRef={searchWordRef}
                                            sx={{
                                                width: '400px',
                                                height: '40px', // 높이 설정
                                                '& .MuiInputBase-root': {
                                                    height: '100%', // 내부 인풋 높이 맞춤
                                                    fontFamily:
                                                        'Gamja Flower, cursive', // 폰트 설정
                                                    fontSize: '16px', // 글꼴 크기
                                                },
                                                '& .MuiInputLabel-root': {
                                                    fontFamily:
                                                        'Gamja Flower, cursive', // 폰트 설정
                                                    fontSize: '16px', // 글꼴 크기
                                                    top: '-7px', // 레이블 위치 조정
                                                },
                                            }}
                                        />
                                        <Button
                                            variant="outlined"
                                            type="submit"
                                            sx={{
                                                minWidth: '50px', // 높이와 맞추기 위해 최소 너비 설정
                                                height: '40px', // 높이 설정
                                                fontFamily:
                                                    'Gamja Flower, cursive', // 폰트 설정
                                                fontSize: '16px',
                                                padding: 0, // 패딩 제거
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <SearchIcon />
                                        </Button>
                                    </form>
                                </div>
                                <div className="list">
                                    {data
                                        ? data.map((row, i) => (
                                              <BoardTr row={row} key={i} />
                                          ))
                                        : '등록된 글이 없습니다.'}
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
                                        shape="rounded"
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
                    </div>
                </div>
            </div>
            <div className="footer">
                <Footer />
            </div>
        </div>
    );
}

export default BoardList;
