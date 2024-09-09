import './DiaryList.css';
import Button from './Button';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DiaryItem from './DiaryItem';

const DiaryList = ({ data, date }) => {
    return (
        <div>
            {/* <div className="menu_wrapper">{date.format('YYYY년 M월 D일')}</div> */}

            <div className="list_wrapper">
                {data.map((item) => (
                    <DiaryItem
                        diaryNo={item.diaryNo}
                        companyName={item.companyName}
                        rate={item.rate}
                        review={item.review}
                        uploadOrg={item.uploadOrg}
                        uploadReal={item.uploadReal}
                    />
                ))}
            </div>
        </div>
    );
};
export default DiaryList;
