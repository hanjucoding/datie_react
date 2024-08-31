import Calendar from 'react-calendar';
import styled from 'styled-components';
import 'react-calendar/dist/Calendar.css';

export const StyledCalendarWrapper = styled.div`
    width: 100%;
    height: 600px;
    display: flex;
    justify-content: center;
    position: relative;
    .react-calendar {
        width: 100%;
        height: 100%;
        border: none;
        border-radius: 0.5rem;
        padding: 3% 5%;
        background-color: white;
        font-family: 'Gamja Flower', cursive; /* Apply the font family */
    }

    /* 전체 폰트 컬러 */
    .react-calendar__month-view {
        abbr {
            color: black;
            font-family: 'Gamja Flower', cursive;
            font-size: 20px;
        }
    }

    /* 네비게이션 가운데 정렬 */
    .react-calendar__navigation {
        justify-content: center;
        margin-bottom: 40px;
    }

    /* 네비게이션 폰트 설정 */
    .react-calendar__navigation button {
        font-weight: 500;
        font-family: 'Gamja Flower', cursive;
        font-size: 30px;
    }

    /* 네비게이션 버튼 컬러 */
    .react-calendar__navigation button:focus {
        background-color: white;
    }

    /* 네비게이션 비활성화 됐을때 스타일 */
    .react-calendar__navigation button:disabled {
        background-color: white;
        color: ${(props) => props.theme.darkBlack};
    }

    /* 년/월 상단 네비게이션 칸 크기 줄이기 */
    .react-calendar__navigation__label {
        flex-grow: 0 !important;
    }

    /* 요일 밑줄 제거 */
    .react-calendar__month-view__weekdays abbr {
        text-decoration: none;
        font-weight: 800;
    }

    /* 일요일에만 빨간 폰트 */
    .react-calendar__month-view__weekdays__weekday--weekend
        abbr[title='일요일'] {
        color: red;
    }

    .react-calendar__month-view__weekdays__weekday--weekend
        abbr[title='토요일'] {
        color: blue;
    }

    /* 오늘 날짜 폰트 컬러 */
    .react-calendar__tile--now {
        background: none;
        abbr {
            color: purple;
        }
    }

    /* 네비게이션 월 스타일 적용 */
    .react-calendar__year-view__months__month {
        border-radius: 0.8rem;
        background-color: white;
        padding: 0;
    }

    /* 네비게이션 현재 월 스타일 적용 */
    .react-calendar__tile--hasActive {
        abbr {
            color: black;
        }
    }

    /* 일 날짜 간격 */
    .react-calendar__tile {
        padding: 20px 10px 60px;
        position: relative;
    }

    /* 네비게이션 월 스타일 적용 */
    .react-calendar__year-view__months__month {
        flex: 0 0 calc(33.3333% - 10px) !important;
        margin-inline-start: 5px !important;
        margin-inline-end: 5px !important;
        margin-block-end: 10px;
        padding: 20px 6.6667px;
        font-size: 0.9rem;
        font-weight: 600;
        color: ${(props) => props.theme.gray_1};
    }

    /* 선택한 날짜 스타일 적용 */
    .react-calendar__tile:enabled:hover,
    .react-calendar__tile:enabled:focus,
    .react-calendar__tile--active {
        background-color: ${(props) => props.theme.yellow_2};
        border-radius: 0.3rem;
    }
`;

export const StyledCalendar = styled(Calendar)``;

/* 오늘 버튼 스타일 */
export const StyledDate = styled.div`
    position: absolute;
    right: 7%;
    top: 6%;
    background-color: ${(props) => props.theme.primary_3};
    color: ${(props) => props.theme.yellow_2};
    width: 18%;
    min-width: fit-content;
    height: 1.5rem;
    text-align: center;
    margin: 0 auto;
    line-height: 1.6rem;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 800;
`;

/* 오늘 날짜에 텍스트 삽입 스타일 */
export const StyledToday = styled.div`
    font-size: x-small;
    color: ${(props) => props.theme.br_2};
    font-weight: 600;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%);
`;

export const StyledHeart = styled.div`
    color: red;
    position: absolute;
    top: 60%;
    left: 50%;
    transform: translateX(-50%);
    font-size: 1rem; /* 하트의 크기 조정 */
    line-height: 1;
`;
