import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    StyledCalendarWrapper,
    StyledCalendar,
    StyledToday,
    StyledHeart, // 새로 생성한 StyledHeart 임포트
} from './styles';
import moment from 'moment';
import { jwtDecode } from 'jwt-decode';

const apiUrl = process.env.REACT_APP_API_URL;

const DogInfo = () => {
    let token;
    const navigate = useNavigate();
    const today = new Date();
    const [date, setDate] = useState(today);
    const [activeStartDate, setActiveStartDate] = useState(today);
    const [attendDay, setAttendDay] = useState([]); // State to store the attendance dates
    let userNo = 0;

    // useEffect(() => {
    //     // 로컬 스토리지에서 토큰 가져오기
    //     const storedToken = localStorage.getItem('jwt'); // 'token'은 실제 저장한 키로 변경할 수 있습니다.
    //     if (storedToken) {
    //         setToken(storedToken);
    //     }
    // }, []);

    useEffect(() => {
        // 로컬 스토리지에서 토큰 가져오기
        const storedToken = localStorage.getItem('jwt'); // 'token'은 실제 저장한 키로 변경할 수 있습니다.
        if (storedToken) {
            token = storedToken;
        }
        if (token) {
            const decoded = jwtDecode(token); // 수정된 호출
            console.log(decoded); // 디코딩된 정보 출력
            userNo = decoded.userno;
        }
        console.log(userNo);

        // Fetch attendance dates from the API
        const fetchAttendanceDates = async () => {
            try {
                const response = await axios.get(
                    `${apiUrl}/api/diary/confirmdate`,
                    {
                        params: {
                            userno: userNo, // Replace '62' with the actual userno if needed
                        },
                    },
                );
                console.log('Fetched Dates:', response.data);
                setAttendDay(
                    response.data.map((ts) => moment(ts).format('YYYY-MM-DD')),
                ); // Store the fetched dates in the attendDay state
            } catch (error) {
                console.error('Error fetching attendance dates:', error);
            }
        };

        fetchAttendanceDates();
    }, []);

    const handleDateChange = (newDate) => {
        setDate(newDate);
    };

    const handleTodayClick = () => {
        const today = new Date();
        setActiveStartDate(today);
        setDate(today);
    };

    const handleDateClick = (date) => {
        const formattedDate = moment(date).format('YYYY-MM-DD');
        if (attendDay.includes(formattedDate)) {
            // 클릭 가능한 날짜인지 확인
            navigate(`/diary/detail/${formattedDate}`);
        }
    };

    return (
        <StyledCalendarWrapper>
            <StyledCalendar
                value={date}
                onClickDay={handleDateClick}
                onChange={handleDateChange}
                formatDay={(locale, date) => moment(date).format('D')}
                formatYear={(locale, date) => moment(date).format('YYYY')}
                formatMonthYear={(locale, date) =>
                    moment(date).format('YYYY. MM')
                }
                calendarType="gregory"
                showNeighboringMonth={false}
                next2Label={null}
                prev2Label={null}
                minDetail="year"
                activeStartDate={activeStartDate}
                onActiveStartDateChange={({ activeStartDate }) =>
                    setActiveStartDate(activeStartDate)
                }
                tileContent={({ date, view }) => {
                    let html = [];
                    const formattedDate = moment(date).format('YYYY-MM-DD');
                    if (
                        view === 'month' &&
                        date.getMonth() === today.getMonth() &&
                        date.getDate() === today.getDate()
                    ) {
                        html.push(<StyledToday key="today"></StyledToday>);
                    }
                    if (attendDay.includes(formattedDate)) {
                        html.push(
                            <StyledHeart key={formattedDate}>♡</StyledHeart>, // 하트를 표시
                        );
                    }
                    return <>{html}</>;
                }}
            />
        </StyledCalendarWrapper>
    );
};

export default DogInfo;
