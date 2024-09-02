import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import CommentTr from '../components/CommentTr.js';
import RealHeader from '../../../component/RealHeader';
import Header from '../../../component/Header';
import Footer from '../../../component/Footer';
import './View.css';
import DiaryDetail from '../components/DiaryDetail.js';
import Avatar from '@mui/material/Avatar';

function View(props) {
    const navigate = useNavigate();
    const [profileImageUrl, setProfileImageUrl] = useState(
        '/static/images/avatar/2.jpg',
    ); // 기본 아바타 이미지 URL
    const [params, setParams] = useSearchParams();
    const [data, setData] = useState(null);
    const no = params.get('no');
    console.log(no);
    const getView = () => {
        axios
            .get('http://localhost:8090/api/diaryboard/view?no=' + no)
            .then((res) => {
                setData(res.data);
            });
    };
    useEffect(() => {
        getView();
    }, []);

    // 댓글관련
    // 목록
    const [totalElements, setTotalElements] = useState(0); // 총개수
    const [totalPages, setTotalPages] = useState(0); // 총페이지
    const [currentPage, setCurrentPage] = useState(0); // 현재페이지
    const [pageList, setPageList] = useState([]);
    const [prevPage, setPrevPage] = useState({});
    const [nextPage, setNextPage] = useState({});
    const [comment, setComment] = useState(null);
    const [param, setParam] = useState({
        page: 1,
        user_no: 65, // 임의의 값
        parent_no: Number(no),
    });
    const getCommentList = () => {
        axios
            .get('http://localhost:8090/api/comment/list', { params: param })
            .then((res) => {
                setComment(res.data.result.content);
                setTotalElements(res.data.result.totalElements);
                setTotalPages(res.data.result.totalPages);
                setCurrentPage(res.data.result.number + 1);
                setPageList(res.data.pageList);
                setPrevPage(res.data.prevPage);
                setNextPage(res.data.nextPage);
            });
    };
    useEffect(() => {
        getCommentList();
        getView();
        console.log(data);
    }, [no]);

    useEffect(() => {
        if (data) {
            console.log(data.diarydate); // data가 업데이트된 후에 로그 출력
        }
    }, [data]);

    // 댓글 등록
    const handleChange = (e) => {
        setParam({
            ...param,
            [e.target.name]: e.target.value,
        });
    };

    const saveComment = () => {
        console.log(param);

        axios
            .post('http://localhost:8090/api/comment/regist', param)
            .then((res) => {
                console.log(res);
                if (res.data.result === 'success') {
                    alert('정상적으로 저장되었습니다.');
                    setParam({
                        ...param,
                        content: '',
                    });
                    getCommentList();
                }
            });
    };

    const save = () => {
        if (window.confirm('글을 등록하시겠습니까?')) {
            saveComment();
        }
    };

    const delComment = (no) => {
        let url = 'http://localhost:8090/api/comment/delete?no=' + no;
        console.log('commentno: ' + no);
        if (window.confirm('댓글을 삭제하시겠습니까?')) {
            axios.get(url).then((res) => {
                if (res.data.result === 'success') {
                    alert('정상적으로 삭제되었습니다.');
                    getCommentList();
                }
            });
        }
    };

    const goEdit = (e) => {
        e.preventDefault();
        navigate('/board/edit?no=' + no);
    };
    const goReply = (e) => {
        e.preventDefault();
        navigate('/board/reply?no=' + no);
    };
    const goDelete = (e) => {
        e.preventDefault();
        if (window.confirm('삭제하시겠습니까?')) {
            axios
                .post('http://localhost:8090/api/diaryboard/delete', {
                    no: Number(no),
                })
                .then((res) => {
                    if (res.data.result === 'success') {
                        alert('정상적으로 삭제되었습니다.');
                        navigate('/board/list');
                    }
                });
        } else {
            e.preventDefault();
        }
    };
    return (
        <div>
            <div>
                <RealHeader />
                <Header title={'커뮤니티'} />

                <div className="view">
                    <div className="title">{data && data.title}</div>
                    <div className="cont">
                        <p
                            dangerouslySetInnerHTML={{
                                __html: data && data.content,
                            }}
                        ></p>
                    </div>
                    <div className="diary">
                        {data && data.diarydate ? (
                            <DiaryDetail date={data.diarydate} />
                        ) : (
                            <p>Loading...</p> // 또는 다른 로딩 상태를 표시
                        )}
                    </div>

                    <div className="btnSet clear">
                        <div className="fl_l">
                            <Link to="/board/list" className="btn">
                                목록
                            </Link>
                            <Link onClick={goReply} className="btn">
                                답변
                            </Link>
                            <Link onClick={goEdit} className="btn">
                                수정
                            </Link>
                            <Link onClick={goDelete} className="btn">
                                삭제
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="board_write">
                    <textarea
                        name="content"
                        style={{
                            height: '50px',
                            maxWidth: '500px',
                        }}
                        onChange={handleChange}
                        value={param.content}
                    ></textarea>

                    <td>
                        <div
                            className="btnSet"
                            style={{
                                textAlign: 'right',
                            }}
                        >
                            <a className="btn" href="#;" onClick={save}>
                                저장
                            </a>
                        </div>
                    </td>

                    <p>
                        <span>
                            <strong>총 {totalElements}개</strong> |{' '}
                            {currentPage}/{totalPages}
                        </span>
                    </p>
                    <table className="list">
                        <colgroup>
                            <col width="80px" />
                            <col width="*" />
                            <col width="100px" />
                            <col width="100px" />
                        </colgroup>
                        <tbody>
                            {comment ? (
                                comment.map((row, i) => (
                                    <CommentTr
                                        row={row}
                                        key={i}
                                        delComment={delComment}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td className="first" colSpan="4">
                                        등록된 댓글이 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="pagenate clear">
                        <ul className="paging">
                            {prevPage !== null ? (
                                <li>
                                    <Link
                                        onClick={() =>
                                            setParam({
                                                ...param,
                                                page: prevPage.pageNumber + 1,
                                            })
                                        }
                                    >
                                        &lt;
                                    </Link>
                                </li>
                            ) : null}

                            {pageList
                                ? pageList.map((e, i) => (
                                      <li key={i}>
                                          <Link
                                              className={
                                                  e.pageNumber ===
                                                  currentPage - 1
                                                      ? 'current'
                                                      : ''
                                              }
                                              onClick={() =>
                                                  setParam({
                                                      ...param,
                                                      page: e.pageNumber + 1,
                                                  })
                                              }
                                          >
                                              {e.pageNumber + 1}
                                          </Link>
                                      </li>
                                  ))
                                : ''}
                            {nextPage !== null ? (
                                <li>
                                    <Link
                                        onClick={() =>
                                            setParam({
                                                ...param,
                                                page: nextPage.pageNumber + 1,
                                            })
                                        }
                                    >
                                        &gt;
                                    </Link>
                                </li>
                            ) : null}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="footer">
                <Footer />
            </div>
        </div>
    );
}

export default View;
