import './DiaryList.css';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DiaryItem from '../components/DiaryItem';

const DiaryList = ({ data, date }) => {
    return (
        <div>
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
