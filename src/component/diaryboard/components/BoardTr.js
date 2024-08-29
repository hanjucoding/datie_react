import { Link } from 'react-router-dom';
import './BoardTr.css';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ModeCommentIcon from '@mui/icons-material/ModeComment';

function BoardTr(props) {
    let url = '/board/view?no=' + props.row.boardno;
    let nested = '';

    return (
        <div className="BoardItem">
            <div className="info_section">
                <div className="title_wrapper">
                    <Link to={url}>
                        <span
                            dangerouslySetInnerHTML={{ __html: nested }}
                        ></span>
                        {props.row.title}
                    </Link>
                </div>
                <div className="content_wrapper">방문장소 태그들</div>
                <div className="info_row">
                    <span>
                        {props.row.user ? props.row.user.name : ''} {'   '}
                        {props.row.writedate.substring(0, 10)}
                    </span>
                    <span className="comment-count">
                        <RemoveRedEyeIcon className="icon" />
                        {props.row.viewcnt}
                        <ModeCommentIcon className="icon" />
                        {props.row.comment.length}
                        <FavoriteIcon className="icon" />
                        {props.row.likecnt}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default BoardTr;
