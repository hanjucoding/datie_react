// ViewProfile.js
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import React, { useState, useLayoutEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import './AdminStatistics.css';
import RealHeader from '../RealHeader';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { colors } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import Stack from '@mui/material/Stack';
import { Gauge } from '@mui/x-charts/Gauge';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
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
                        오늘 이용자 수
                    </Typography>
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        spacing={{ xs: 1, md: 3 }}
                    >
                        <Gauge
                            width={100}
                            height={100}
                            value={50}
                            startAngle={-90}
                            endAngle={90}
                        />
                    </Stack>

                    <Typography margin={3} variant="h5">
                        분야별 지출 상황
                    </Typography>
                    <PieChart
                        series={[
                            {
                                data: [
                                    { id: 0, value: 10, label: 'series A' },
                                    { id: 1, value: 15, label: 'series B' },
                                    { id: 2, value: 20, label: 'series C' },
                                ],
                            },
                        ]}
                        width={400}
                        height={200}
                    />
                    <Typography margin={3} variant="h5">
                        월별 지출내역
                    </Typography>
                    <BarChart
                        xAxis={[
                            {
                                scaleType: 'band',
                                data: ['group A', 'group B', 'group C'],
                            },
                        ]}
                        series={[
                            { data: [4, 3, 5] },
                            { data: [1, 6, 3] },
                            { data: [2, 5, 6] },
                        ]}
                        width={500}
                        height={300}
                    />
                    <Typography margin={3} variant="h5">
                        시간별 지출 내역
                    </Typography>
                    <LineChart
                        xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                        series={[
                            {
                                data: [2, 5.5, 2, 8.5, 1.5, 5],
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
