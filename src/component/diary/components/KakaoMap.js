import React, { useEffect, useRef, useState } from 'react';
import './KakaoMap.css';

const apiUrl = process.env.REACT_APP_API_URL;

const KakaoMap = ({ locations = [], placeNames = [], categorys = [] }) => {
    console.log(placeNames);
    console.log(categorys);

    const markersRef = useRef([]);
    const infoWindowsRef = useRef([]);

    // 인포윈도우 열림 상태를 저장하는 배열 상태
    const [infoWindowOpen, setInfoWindowOpen] = useState([]);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=0f55f3f4dc76f68cac78d6f8bbbabb17`;
        script.async = true;
        script.onload = () => {
            const mapContainer = document.getElementById('map');
            const mapOption = {
                center: new window.kakao.maps.LatLng(33.450701, 126.570667),
                level: 3,
            };

            const map = new window.kakao.maps.Map(mapContainer, mapOption);

            const points = Array.isArray(locations)
                ? locations
                      .map((location) => {
                          if (
                              location &&
                              typeof location.lat === 'number' &&
                              typeof location.lng === 'number'
                          ) {
                              return new window.kakao.maps.LatLng(
                                  location.lat,
                                  location.lng,
                              );
                          }
                          return null;
                      })
                      .filter((point) => point !== null)
                : [];

            const bounds = new window.kakao.maps.LatLngBounds();

            points.forEach((point, index) => {
                let imageUrl = `${apiUrl}/api/diary/image/etc.png`;

                switch (categorys[index]) {
                    case '식료품':
                        imageUrl = `${apiUrl}/api/diary/image/mart.png`;
                        break;
                    case '외식':
                        imageUrl = `${apiUrl}/api/diary/image/restaurant.png`;
                        break;
                    case '교통비':
                        imageUrl = `${apiUrl}/api/diary/image/transportation.png`;
                        break;
                    case '의료비':
                        imageUrl = `${apiUrl}/api/diary/image/hospital.png`;
                        break;
                    case '쇼핑':
                        imageUrl = `${apiUrl}/api/diary/image/mart.png`;
                        break;
                    case '문화/여가':
                        imageUrl = `${apiUrl}/api/diary/image/culture.png`;
                        break;
                    default:
                        imageUrl = `${apiUrl}/api/diary/image/etc.png`;
                        break;
                }

                const markerImage = new window.kakao.maps.MarkerImage(
                    imageUrl,
                    new window.kakao.maps.Size(50, 50),
                    {
                        offset: new window.kakao.maps.Point(27, 69),
                    },
                );

                const marker = new window.kakao.maps.Marker({
                    position: point,
                    image: markerImage,
                });
                marker.setMap(map);
                markersRef.current[index] = marker;

                const infowindow = new window.kakao.maps.InfoWindow({
                    content: `
                        <div class="info-window">
                            <h3>${placeNames[index]}</h3><br>
                            <a href="https://search.naver.com/search.naver?query=${encodeURIComponent(
                                placeNames[index],
                            )}" target="_blank">→네이버에서 검색</a>
                        </div>
                    `,
                });
                infoWindowsRef.current[index] = infowindow;
                let isInfoWindowOpen = false;

                window.kakao.maps.event.addListener(marker, 'click', () => {
                    if (isInfoWindowOpen) {
                        infowindow.close();
                        map.setBounds(bounds);
                    } else {
                        infowindow.open(map, marker);
                        map.panTo(marker.getPosition());
                    }
                    isInfoWindowOpen = !isInfoWindowOpen;
                });

                bounds.extend(point);
            });

            map.setBounds(bounds);
            // 처음에 모든 인포윈도우가 닫힌 상태로 초기화
            setInfoWindowOpen(Array(placeNames.length).fill(false));
        };

        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, [locations, placeNames, categorys]);

    // place-name-item 클릭 시 해당 인덱스의 인포윈도우 열거나 닫기
    const handlePlaceNameClick = (index) => {
        const marker = markersRef.current[index];
        const infowindow = infoWindowsRef.current[index];

        if (marker && infowindow) {
            const isOpen = infoWindowOpen[index];

            // 모든 인포윈도우 닫기
            infoWindowsRef.current.forEach((info) => info.close());

            if (isOpen) {
                // 이미 열려 있으면 닫기
                infowindow.close();
            } else {
                // 닫혀 있으면 열기
                infowindow.open(marker.getMap(), marker);
            }

            // 해당 인덱스의 상태를 반대로 토글
            const updatedInfoWindowOpen = infoWindowOpen.map((state, i) =>
                i === index ? !state : false,
            );
            setInfoWindowOpen(updatedInfoWindowOpen);
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            {/* placeNames를 보여주는 목록 추가 */}
            <div className="place-names">
                {placeNames.map((name, index) => (
                    <div
                        key={index}
                        className="place-name-item"
                        onClick={() => handlePlaceNameClick(index)}
                    >
                        # {name}
                    </div>
                ))}
            </div>

            {/* 지도 */}
            <div
                className="map"
                id="map"
                style={{ width: '100%', height: '800px', borderRadius: '5px' }}
            ></div>

            <style>
                {`
                    .place-names {
                        position: absolute;
                        left: 50%;
                        transform: translateX(-50%);
                        z-index: 2;
                        border-radius: 5px;
                        display: flex;
                        flex-direction: row;
                        gap: 10px;
                        width: 95%; /* 제한된 너비로 가로 스크롤 */
                        overflow-x: auto; /* 가로 스크롤 활성화 */
                        white-space: nowrap;
                        padding: 10px;
                    }

                    .place-names::-webkit-scrollbar {
                        height: 8px;
                    }

                    .place-names::-webkit-scrollbar-thumb {
                        background-color: rgba(0, 0, 0, 0.2);
                        border-radius: 10px;
                    }

                    .place-name-item {
                        padding: 5px;
                        background-color: white;
                        border: 1px solid #ffcccc;
                        border-radius: 5px;
                        text-align: center;
                        font-size: 16px;
                        font-weight: bold;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        flex: 0 0 auto;
                        min-width: 50px; /* 각 항목의 최소 너비 설정 */
                        cursor: pointer;
                    }
                    .info-window {
                        padding: 10px;
                        width: 200px;
                        background-color: #fff;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
                        font-size: 14px;
                        color: #333;
                    }
                    .info-window h3 {
                        margin: 0;
                        font-size: 20px;
                        color: black;
                    }
                    .info-window p {
                        margin: 5px 0;
                    }
                    .search-link-container {
                        text-align: right;
                    }
                    .info-window a {
                        color: #007aff;
                        text-decoration: none;
                        font-weight: bold;
                    }
                    .info-window a:hover {
                        text-decoration: underline;
                    }
                `}
            </style>
        </div>
    );
};

export default KakaoMap;
