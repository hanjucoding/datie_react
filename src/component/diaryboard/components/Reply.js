import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

function Reply() {
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;

    // 상세 조회
    const [params, setParams] = useSearchParams();
    const no = params.get('no');

    const [param, setParam] = useState({
        gno: no,
        user_no: 3, // 임시
    });
    const [file, setFile] = useState([]); //파일

    const getView = () => {
        axios.get(`${apiUrl}/api/reply/view?no=` + no).then((res) => {
            setParam({ ...param, ...res.data });
        });
    };
    useEffect(() => {
        getView();
    }, []);

    const handleChange = (e) => {
        setParam({
            ...param,
            [e.target.name]: e.target.value,
        });
    };
    const handleChangeFile = (e) => {
        setFile(Array.from(e.target.files));
    };

    const getApi = () => {
        console.log(param);
        const formData = new FormData();
        // 파일 데이터 저장
        file.map((f) => {
            formData.append('file', f);
        });
        //formData.append("data", JSON.stringify(param));
        for (let k in param) {
            formData.append(k, param[k]);
        }
        console.log(Array.from(formData));

        axios
            .post(`${apiUrl}/api/reply/reply`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    charset: 'utf-8',
                },
            })
            .then((res) => {
                console.log(res);
                if (res.data.result === 'success') {
                    // alert('정상적으로 저장되었습니다.');
                    // 알림 표시
                    Swal.fire({
                        icon: 'success',
                        title: '정상적으로 저장되었습니다',
                        confirmButtonText: '확인',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // navigate를 사용하여 페이지를 새로 고침
                            navigate('/board/list');
                        }
                    });
                }
            });
    };

    const save = () => {
        if (window.confirm('글을 등록하시겠습니까?')) {
            getApi();
        }
    };

    return (
        <>
            <div className="sub">
                <div className="size">
                    <h3 className="sub_title">게시판</h3>

                    <div className="bbs">
                        <form
                            method="post"
                            name="frm"
                            id="frm"
                            action=""
                            encType="multipart/form-data"
                        >
                            <table className="board_write">
                                <tbody>
                                    <tr>
                                        <th>제목</th>
                                        <td>
                                            <input
                                                type="text"
                                                name="title"
                                                onChange={handleChange}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>내용</th>
                                        <td>
                                            <textarea
                                                name="content"
                                                onChange={handleChange}
                                            ></textarea>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>파일</th>
                                        <td>
                                            <input
                                                type="file"
                                                id="file"
                                                onChange={handleChangeFile}
                                            ></input>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div
                                className="btnSet"
                                style={{ textAlign: 'right' }}
                            >
                                <Link className="btn" onClick={save}>
                                    저장
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Reply;
