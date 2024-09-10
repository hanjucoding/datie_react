import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

import RealHeader from '../../../component/RealHeader';
import Header from '../../../component/Header';
import Footer from '../../../component/Footer';
import KakaoMap from '../../diary/components/KakaoMap';
import DiaryList from '../components/DiaryList';
import './DiaryDetail.css';

function DiaryDetail({ date }) {
    const apiUrl = process.env.REACT_APP_API_URL;
    const formattedDate = moment(date, 'YYYY-MM-DD');
    const [locations, setLocations] = useState([]);
    const [data, setData] = useState([]);
    const [isListVisible, setIsListVisible] = useState(false);
    let token;
    let userNo = 0;

    useEffect(() => {
        const storedToken = localStorage.getItem('jwt');
        if (storedToken) {
            token = storedToken;
        }
        if (token) {
            const decoded = jwtDecode(token);
            console.log(decoded);
            userNo = decoded.userno;
        }
        console.log(userNo);

        const fetchDiaryDetail = async () => {
            try {
                const response = await axios.get(
                    `${apiUrl}/api/diary/detail?userNo=${userNo}&confirmDate=${formattedDate.format(
                        'YYYY-MM-DD',
                    )}`,
                );
                // 응답이 배열인지 확인
                const responseData = Array.isArray(response.data)
                    ? response.data
                    : [];
                setData(responseData);
            } catch (error) {
                console.error('Error fetching diary details:', error);
                setData([]); // 에러 발생 시 빈 배열로 설정
            }
        };

        fetchDiaryDetail();
    }, []);

    useEffect(() => {
        const geocoder = new window.kakao.maps.services.Geocoder();

        const convertAddressToCoords = async (companyAddress) => {
            return new Promise((resolve, reject) => {
                geocoder.addressSearch(
                    companyAddress,
                    function (result, status) {
                        if (status === window.kakao.maps.services.Status.OK) {
                            const coords = {
                                lat: parseFloat(result[0].y),
                                lng: parseFloat(result[0].x),
                            };
                            resolve(coords);
                        } else {
                            reject(
                                new Error(
                                    'Failed to convert address to coordinates',
                                ),
                            );
                        }
                    },
                );
            });
        };

        const fetchLocations = async () => {
            const promises = data.map(async (item) => {
                const coords = await convertAddressToCoords(
                    item.companyAddress,
                );
                return { ...item, location: coords };
            });

            const updatedData = await Promise.all(promises);
            setLocations(updatedData.map((item) => item.location));
        };

        if (data.length > 0) {
            fetchLocations();
        }
    }, [data]);

    const diaryData = data.map(
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

    return (
        <div className="diary-detail-container">
            <KakaoMap
                locations={locations}
                placeNames={diaryData.map((item) => item.companyName)}
                categorys={diaryData.map((item) => item.category)}
            />

            <div className="diary-section">
                {/* 버튼 추가 */}
                <button
                    onClick={() => setIsListVisible(!isListVisible)}
                    className="toggle-button"
                >
                    {isListVisible ? '▼' : '▲'}
                </button>

                {/* DiaryList가 버튼 바로 위에서 아래에서 위로 올라오는 애니메이션 */}
                <div
                    className={`diary-list-container ${
                        isListVisible ? 'visible' : ''
                    }`}
                >
                    <DiaryList data={diaryData} date={formattedDate} />
                </div>
            </div>
        </div>
    );
}

export default DiaryDetail;
