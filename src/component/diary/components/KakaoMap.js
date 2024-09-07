import React, { useEffect } from 'react';
import './KakaoMap.css';

const apiUrl = process.env.REACT_APP_API_URL;

const KakaoMap = ({ locations = [], placeNames = [], categorys = [] }) => {
    console.log(placeNames);
    console.log(categorys);

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
                        imageUrl = `${apiUrl}/api/diary/image/food.png`;
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
                        imageUrl = `${apiUrl}/api/diary/image/shopping.png`;
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
                    new window.kakao.maps.Size(40, 40),
                    {
                        offset: new window.kakao.maps.Point(27, 69),
                    },
                );

                const marker = new window.kakao.maps.Marker({
                    position: point,
                    image: markerImage,
                });
                marker.setMap(map);

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
        };

        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, [locations, placeNames, categorys]);

    return (
        <div>
            <div
                className="map"
                id="map"
                style={{ width: '100%', height: '800px', borderRadius: '5px' }}
            ></div>

            <style>
                {`
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
