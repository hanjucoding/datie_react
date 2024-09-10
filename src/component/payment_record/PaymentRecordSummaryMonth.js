import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import axios from 'axios';

// 아이콘 이미지 임포트
import martIcon from '../../assets/mart.png';
import foodIcon from '../../assets/food.png';
import hospitalIcon from '../../assets/hospital.png';
import hobbyIcon from '../../assets/hobby.png';
import questionMarkIcon from '../../assets/question-mark.png';

const apiUrl = process.env.REACT_APP_API_URL;

const categories = ['식료품', '외식', '의료비', '문화/여가', '기타'];

const PaymentRecordSummaryMonth = ({ cardno }) => {
    const [currentMonthCategoryTotals, setCurrentMonthCategoryTotals] =
        useState({});
    const [previousMonthCategoryTotals, setPreviousMonthCategoryTotals] =
        useState({});

    useEffect(() => {
        if (cardno) {
            const currentDate = new Date();
            const previousDate = new Date();
            previousDate.setMonth(previousDate.getMonth() - 1);

            // 이번 달 데이터 가져오기
            fetchMonthlyData(
                currentDate.getFullYear(),
                currentDate.getMonth() + 1,
                setCurrentMonthCategoryTotals,
            );


      // 저번 달 데이터 가져오기
      fetchMonthlyData(
        previousDate.getFullYear(),
        previousDate.getMonth() + 1,
        setPreviousMonthCategoryTotals
      );
    }
  }, [cardno]);
  

  const fetchMonthlyData = (year, month, setCategoryTotals) => {
    axios
      .post(`${apiUrl}/api/card/${cardno}/payment-records-month?year=${year}&month=${month}`)
      .then((response) => {
        const records = response.data.filter((record) => record.paystate === 1);

                const categoryTotals = records.reduce((totals, record) => {
                    const category = record.category || '기타';
                    totals[category] = (totals[category] || 0) + record.amount;
                    return totals;
                }, {});
                setCategoryTotals(categoryTotals);
            })
            .catch((error) => {
                console.error('Error fetching monthly payment records:', error);
            });
    };

    const getComparisonMessage = () => {
        const currentMonthTotal = Object.values(
            currentMonthCategoryTotals,
        ).reduce((a, b) => a + b, 0);
        const previousMonthTotal = Object.values(
            previousMonthCategoryTotals,
        ).reduce((a, b) => a + b, 0);
        const difference = currentMonthTotal - previousMonthTotal;

        if (difference > 0) {
            return (
                <>
                    지난 달에 비해{' '}
                    <span style={{ color: 'green' }}>
                        {difference.toLocaleString()} 원
                    </span>
                    을 더 쓰셨어요.
                </>
            );
        } else if (difference < 0) {
            return (
                <>
                    지난 달에 비해{' '}
                    <span style={{ color: 'red' }}>
                        {Math.abs(difference).toLocaleString()} 원
                    </span>
                    을 덜 쓰셨어요.
                </>
            );
        } else {
            return '결제내역이 존재하지 않습니다.';

        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case '식료품':
                return martIcon;
            case '외식':
                return foodIcon;
            case '의료비':
                return hospitalIcon;
            case '문화/여가':
                return hobbyIcon;
            default:
                return questionMarkIcon;
        }
    };

    const sortedCategories = categories
        .filter(
            (category) =>
                (currentMonthCategoryTotals[category] || 0) > 0 ||
                (previousMonthCategoryTotals[category] || 0) > 0,
        )
        .sort(
            (a, b) =>
                (currentMonthCategoryTotals[b] || 0) -
                (currentMonthCategoryTotals[a] || 0),
        );

    return (
        <Box
            sx={{
                padding: '10px',
                paddingBottom: '0px',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                marginBottom: '0px',
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    fontFamily: '"Gamja Flower", cursive',
                    fontSize: '25px',
                    fontWeight: 'bold',
                    marginBottom: '10px',
                }}
            >
                {getComparisonMessage()}
            </Typography>
            <Box sx={{ marginTop: '20px' }}>
                {sortedCategories.map((category) => {
                    const currentTotal =
                        currentMonthCategoryTotals[category] || 0;
                    const previousTotal =
                        previousMonthCategoryTotals[category] || 0;
                    const difference = currentTotal - previousTotal;
                    const differenceSign =
                        difference > 0 ? '+' : difference < 0 ? '-' : '';

                    return (
                        <Box
                            key={category}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: '10px',
                                borderBottom: '1px solid #e0e0e0',
                                paddingBottom: '10px',
                            }}
                        >
                            <Box
                                component="img"
                                src={getCategoryIcon(category)}
                                alt={category}
                                sx={{
                                    width: 40,
                                    height: 40,
                                    marginRight: '15px',
                                }}
                            />
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontFamily: '"Gamja Flower", cursive',
                                        fontSize: '20px',
                                    }}
                                >
                                    {category}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontFamily: '"Gamja Flower", cursive',
                                        fontSize: '18px',
                                    }}
                                >
                                    이번 달: {currentTotal.toLocaleString()} 원
                                </Typography>
                            </Box>
                            <Typography
                                variant="body1"
                                sx={{
                                    fontFamily: '"Gamja Flower", cursive',
                                    fontSize: '18px',
                                    color: difference > 0 ? 'red' : 'green',
                                }}
                            >
                                {differenceSign}{' '}
                                {Math.abs(difference).toLocaleString()} 원
                            </Typography>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};

export default PaymentRecordSummaryMonth;
