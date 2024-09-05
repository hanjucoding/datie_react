// ViewProfile.js
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import './AdminMember.css';
import RealHeader from '../RealHeader';
import { useState, useEffect, useLayoutEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Height } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
const apiUrl = process.env.REACT_APP_API_URL;
const columns = [
    { field: 'id', headerName: '번호', width: 50 },
    { field: 'userId', headerName: '아이디', width: 130 },
    { field: 'name', headerName: '이름', width: 130 },
    {
        field: 'status',
        headerName: '멤버상태',
        width: 130,
        valueGetter: (params) => {
            // 상태 값을 문자열로 변환
            const statusMap = {
                0: '탈퇴',
                1: '이용중',
                2: '관리자',
            };

            return statusMap[params] || '알 수 없음';
        },
    },

    {
        field: 'cstatus',
        headerName: '카드상태',
        width: 130,
        valueGetter: (params) => {
            // 상태 값을 문자열로 변환
            const statusMap = {
                0: '미사용',
                1: '사용중',
                2: '정지',
                3: '해지',
                4: '정지신청',
            };

            return statusMap[params] || '알 수 없음';
        },
    },
    { field: 'moddate', headerName: '가입일', width: 130 },
];

const Admin = () => {
    let navigate = useNavigate();
    const [shouldNavigate, setShouldNavigate] = useState(false);
    const [token, setToken] = useState('');
    useLayoutEffect(() => {
        if (!shouldNavigate) {
            setShouldNavigate(true);
        }

        // 로컬 스토리지에서 토큰 가져오기
        const storedToken = localStorage.getItem('jwt'); // 'token'은 실제 저장한 키로 변경할 수 있습니다.
        if (storedToken) {
            const decoded = jwtDecode(storedToken); // 수정된 호출
            console.log(decoded); // 디코딩된 정보 출력
            if (decoded.role == 'admin') {
                setToken(decoded);
            } else {
                navigate('/');
            }
        } else {
            navigate('/');
        }
    }, [navigate, shouldNavigate]);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchType = queryParams.get('searchType');
    const searchWord = queryParams.get('searchWord');

    const [param, setParam] = useState({
        searchType: searchType,
        searchWord: searchWord,
    });

    const [selectedRows, setSelectedRows] = useState([]);

    useEffect(() => {
        getApi();
    }, [param]);
    const [data, setData] = useState({});
    const getApi = () => {
        console.log(apiUrl);
        console.log(apiUrl);
        console.log(apiUrl);
        console.log(apiUrl);
        console.log(apiUrl);
        axios.get(`${apiUrl}/api/admin/list`, { params: param }).then((res) => {
            console.log(res);
            setData(res.data);

            // setData(res.data.result.content);
            // setTotalElements(res.data.result.totalElements);
            // setTotalPages(res.data.result.totalPages);
            // setCurrentPage(res.data.result.number + 1);
            // setPageList(res.data.pageList);
            // setPrevPage(res.data.prevPage);
            // setNextPage(res.data.nextPage);
        });
    };

    const [searchTypeState, setSearchTypeState] = React.useState('all');
    const [searchWordState, setSearchWordState] = React.useState('');

    return (
        <>
            <RealHeader className="adminHeader" />

            <div className="admin">
                <div className="admin_container">
                    <Button
                        variant="contained"
                        sx={{
                            ml: 2,
                            mt: 2,
                            backgroundColor: 'rgb(148, 160, 227)', // 버튼 배경 색상
                            color: 'white', // 버튼 글씨 색상
                            '&:hover': {
                                backgroundColor: 'rgb(120, 140, 200)', // 버튼 호버 시 배경 색상
                            },
                            width: '100px',
                        }}
                        onClick={function () {
                            // 선택된 행이 없을 경우 경고 메시지 표시
                            if (selectedRows.length === 0) {
                                alert('선택된 행이 없습니다.');
                                return;
                            }

                            // axios를 사용하여 POST 요청 보내기
                            axios
                                .post(`${apiUrl}/api/admin/list`, {
                                    selectedRows: selectedRows, // selectedRows를 JSON 형식으로 전송
                                    flag: 'hold',
                                })
                                .then((res) => {
                                    console.log(res);
                                    alert('일괄 정지가 완료되었습니다.');
                                    setParam({
                                        searchType: searchTypeState,
                                        searchWord: searchWordState,
                                    });
                                })
                                .catch((error) => {
                                    console.error('에러 발생:', error);
                                });
                        }}
                    >
                        일괄 정지
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            ml: 2,
                            mt: 2,
                            backgroundColor: 'rgb(148, 160, 227)', // 버튼 배경 색상
                            color: 'white', // 버튼 글씨 색상
                            '&:hover': {
                                backgroundColor: 'rgb(120, 140, 200)', // 버튼 호버 시 배경 색상
                            },
                            width: '100px',
                        }}
                        onClick={function () {
                            // 선택된 행이 없을 경우 경고 메시지 표시
                            if (selectedRows.length === 0) {
                                alert('선택된 행이 없습니다.');
                                return;
                            }

                            // axios를 사용하여 POST 요청 보내기
                            axios
                                .post(`${apiUrl}/api/admin/list`, {
                                    selectedRows: selectedRows, // selectedRows를 JSON 형식으로 전송
                                    flag: 'deactive',
                                })
                                .then((res) => {
                                    console.log(res);
                                    alert('일괄 해지가 완료되었습니다.');
                                    setParam({
                                        searchType: searchTypeState,
                                        searchWord: searchWordState,
                                    });
                                })
                                .catch((error) => {
                                    console.error('에러 발생:', error);
                                });
                        }}
                    >
                        일괄 해지
                    </Button>
                    <FormControl sx={{ m: 1, minWidth: 80 }}>
                        <InputLabel id="sort">검색</InputLabel>
                        <Select
                            labelId="demo-simple-select-autowidth-label"
                            id="demo-simple-select-autowidth"
                            value={searchTypeState}
                            onChange={(e) => setSearchTypeState(e.target.value)}
                            autoWidth
                            label="검색"
                        >
                            <MenuItem value={'all'}>모두</MenuItem>
                            <MenuItem value={'num'}>번호</MenuItem>
                            <MenuItem value={'id'}>아이디</MenuItem>
                            <MenuItem value={'name'}>이름</MenuItem>
                            <MenuItem value={'ms'}>멤버상태</MenuItem>
                            <MenuItem value={'cs'}>카드상태</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        sx={{ margin: '7px', width: '150px' }}
                        id="outlined-basic"
                        label="검색어"
                        variant="outlined"
                        value={searchWordState}
                        onChange={(e) => setSearchWordState(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        sx={{
                            mt: 2,
                            backgroundColor: 'rgb(148, 160, 227)', // 버튼 배경 색상
                            color: 'white', // 버튼 글씨 색상
                            '&:hover': {
                                backgroundColor: 'rgb(120, 140, 200)', // 버튼 호버 시 배경 색상
                            },
                            width: '50px',
                        }}
                        onClick={() => {
                            // 검색어와 검색 타입을 가져오기
                            console.log('검색어:', searchWordState);
                            console.log('검색 타입:', searchTypeState);

                            // API 호출 등 추가 로직을 여기에 작성
                            setParam({
                                searchType: searchTypeState,
                                searchWord: searchWordState,
                            });
                        }}
                    >
                        검색
                    </Button>
                    <div style={{ height: 800 }}>
                        <DataGrid
                            rows={data}
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: { page: 0, pageSize: 15 },
                                },
                            }}
                            pageSizeOptions={[5, 10, 15]}
                            checkboxSelection
                            onRowSelectionModelChange={(newSelection) => {
                                setSelectedRows(newSelection);
                                console.log('선택된 행 ID:', newSelection);
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Admin;
