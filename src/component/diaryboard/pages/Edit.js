import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import RealHeader from '../../../component/RealHeader';
import Header from '../../../component/Header';
import Footer from '../../../component/Footer';

function Edit() {
    const navigate = useNavigate();
    const [param, setParam] = useState({
        user_no: 3, // 임시
    });
    const [file, setFile] = useState([]); //파일

    // 상세 조회
    const [params, setParams] = useSearchParams();
    const no = params.get('no');
    const getView = () => {
        axios
            .get('http://localhost:8090/api/diaryboard/view?no=' + no)
            .then((res) => {
                setParam(res.data);
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
        // const formData = new FormData();
        // // 파일 데이터 저장
        // file.map((f) => {
        //   formData.append("file", f);
        // });
        // //formData.append("data", JSON.stringify(param));
        // for (let k in param) {
        //   formData.append(k, param[k]);
        // }
        // console.log(Array.from(formData));

        axios
            .post('http://localhost:8090/api/diaryboard/update', param)
            .then((res) => {
                console.log(res);
                if (res.data.result === 'success') {
                    alert('정상적으로 저장되었습니다.');
                    navigate('/board/list');
                }
            });
    };

    const save = () => {
        if (window.confirm('글을 저장하시겠습니까?')) {
            getApi();
        }
    };

    return (
        <div>
            <div>
                <RealHeader />
                <Header title={'커뮤니티'} />
                <div className="body">
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
                                                        value={
                                                            param && param.title
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>내용</th>
                                                <td>
                                                    <textarea
                                                        name="content"
                                                        onChange={handleChange}
                                                        value={
                                                            param &&
                                                            param.content
                                                        }
                                                    ></textarea>
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
                </div>
            </div>
            <div className="footer">
                <Footer />
            </div>
        </div>
    );
}

export default Edit;
