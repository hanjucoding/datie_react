// ViewProfile.js
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import React, { useState, useLayoutEffect, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import './AdminStatistics.css';
import RealHeader from '../RealHeader';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { colors } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import Stack from '@mui/material/Stack';
import { Gauge } from '@mui/x-charts/Gauge';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;
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
            } else {
                navigate('/');
            }
        } else {
            navigate('/');
        }
    }, [navigate, shouldNavigate]);

    const [today, setToday] = useState('50');
    const [category, setCategory] = useState([]); // id value label
    const [time, setTime] = useState([]);
    /*bar charts*/
    const [dataset, setDataset] = useState([
        {
            age: '10대',
            외식: 50,
            미용패션: 45,
            문화여가: 78,
            기타: 30,
            식료품: 10,
        },
        {
            age: '20대',
            외식: 40,
            미용패션: 50,
            문화여가: 60,
            기타: 20,
            식료품: 4,
        },
        {
            age: '30대',
            외식: 70,
            미용패션: 55,
            문화여가: 90,
            기타: 40,
            식료품: 5,
        },
        {
            age: '기타',
            외식: 70,
            미용패션: 55,
            문화여가: 90,
            기타: 40,
            식료품: 2,
        },
    ]);
    const chartSetting = {
        yAxis: [
            {
                label: '결제내역 수',
            },
        ],
        width: 500,
        height: 300,
        sx: {
            [`.${axisClasses.left} .${axisClasses.label}`]: {
                transform: 'translate(-20px, 0)',
            },
        },
    };
    const valueFormatter = (value) => `${value}개`;
    /*bar charts*/
    useEffect(() => {
        axios.get(`${apiUrl}/api/admin/today`, {}).then((res) => {
            console.log(res);
            setToday(res.data);
            // setData(res.data.result.content);
            // setTotalElements(res.data.result.totalElements);
            // setTotalPages(res.data.result.totalPages);
            // setCurrentPage(res.data.result.number + 1);
            // setPageList(res.data.pageList);
            // setPrevPage(res.data.prevPage);
            // setNextPage(res.data.nextPage);
        });

        axios.get(`${apiUrl}/api/admin/category`, {}).then((res) => {
            console.log(res);
            setCategory(res.data);
            // setData(res.data.result.content);
            // setTotalElements(res.data.result.totalElements);
            // setTotalPages(res.data.result.totalPages);
            // setCurrentPage(res.data.result.number + 1);
            // setPageList(res.data.pageList);
            // setPrevPage(res.data.prevPage);
            // setNextPage(res.data.nextPage);
        });
        axios.get(`${apiUrl}/api/admin/age`, {}).then((res) => {
            console.log(res);
            setDataset(res.data);
            // setData(res.data.result.content);
            // setTotalElements(res.data.result.totalElements);
            // setTotalPages(res.data.result.totalPages);
            // setCurrentPage(res.data.result.number + 1);
            // setPageList(res.data.pageList);
            // setPrevPage(res.data.prevPage);
            // setNextPage(res.data.nextPage);
        });
        axios.get(`${apiUrl}/api/admin/time`, {}).then((res) => {
            console.log(res);
            setTime(res.data);
            // setDataset(res.data);
            // setData(res.data.result.content);
            // setTotalElements(res.data.result.totalElements);
            // setTotalPages(res.data.result.totalPages);
            // setCurrentPage(res.data.result.number + 1);
            // setPageList(res.data.pageList);
            // setPrevPage(res.data.prevPage);
            // setNextPage(res.data.nextPage);
        });
    }, []);
    return (
        <>
            <RealHeader className="adminHeader" />

            <Button
                variant="contained"
                sx={{
                    ml: 30,
                    mt: 2,
                    backgroundColor: 'rgb(148, 160, 227)', // 버튼 배경 색상
                    color: 'white', // 버튼 글씨 색상
                    '&:hover': {
                        backgroundColor: 'rgb(120, 140, 200)', // 버튼 호버 시 배경 색상
                    },
                    width: '100px',
                }}
                onClick={function () {
                    navigate('/admin/member');
                }}
            >
                멤버 관리
            </Button>
            <div className="adminStatistics">
                <div className="adminStatistics_container">
                    <Typography margin={3} variant="h5">
                        오늘 결제내역 수
                    </Typography>
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        spacing={{ xs: 1, md: 3 }}
                    >
                        <Gauge
                            width={100}
                            height={100}
                            value={today}
                            startAngle={-90}
                            endAngle={90}
                        />
                    </Stack>

                    <Typography margin={3} variant="h5">
                        이번달 분야별 결제 수
                    </Typography>
                    <PieChart
                        series={[
                            {
                                data: category,
                            },
                        ]}
                        width={400}
                        height={200}
                    />
                    <Typography margin={3} variant="h5">
                        이번달 나이대별 결제 수
                    </Typography>
                    <BarChart
                        dataset={dataset}
                        xAxis={[{ scaleType: 'band', dataKey: 'ageGroup' }]}
                        series={[
                            {
                                dataKey: '외식',
                                label: '외식',
                                valueFormatter,
                            },
                            {
                                dataKey: '미용패션',
                                label: '미용패션',
                                valueFormatter,
                            },
                            {
                                dataKey: '문화여가',
                                label: '문화여가',
                                valueFormatter,
                            },
                            {
                                dataKey: '식료품',
                                label: '식료품',
                                valueFormatter,
                            },
                            {
                                dataKey: '기타',
                                label: '기타',
                                valueFormatter,
                            },
                        ]}
                        {...chartSetting}
                    />
                    <Typography margin={3} variant="h5">
                        시간별 지출 내역
                    </Typography>
                    <LineChart
                        xAxis={[
                            {
                                data: [
                                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
                                    14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
                                ],
                            },
                        ]}
                        series={[
                            {
                                data: time,
                            },
                        ]}
                        width={500}
                        height={300}
                    />
                </div>
            </div>
        </>
    );
};

export default Admin;
