import React from 'react';
import logo from '../../assets/datie_logo.png'; // 이미지 경로를 상대 경로로 수정
import highfive from '../../assets/datie_highfive2-cutout.png'; // 이미지 경로를 상대 경로로 수정

const Notfound = () => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh', // 화면 전체 높이를 사용
                padding: '20px',
            }}
        >
            <img
                src={logo}
                alt="Datie Logo"
                style={{ width: '200px', margin: '10px' }}
            />
            <h1 style={{ margin: '10px' }}>없는 페이지입니다</h1>
            <img
                src={highfive}
                alt="High Five"
                style={{ width: '200px', margin: '10px' }}
            />
        </div>
    );
};

export default Notfound;
