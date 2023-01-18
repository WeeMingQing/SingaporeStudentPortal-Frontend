import {useState} from "react"
import { useAppDispatch } from "../../app/hooks"
import "./comment.css"
import { destroyCommentAsync, updateCommentAsync } from "./commentSlice"
import Moment from "react-moment"

type CommentProps = {
    username:string
    content: string
    commentId: number
    commentCreationDate: string
    commentUpdateDate: string
    toggleCommentId: (commentId:number) => void
    userId: number
    postId: number
}

export default function Comment({commentCreationDate, commentUpdateDate, commentId, username, content, toggleCommentId, userId, postId}: CommentProps) {
    const dispatch = useAppDispatch();
    const [submitButtonText, setSubmitButtonText] = useState<string>("Edit");
    const [editCommentContent, setEditCommentContent] = useState<string>(content);
    const [editCommentErrorMsg, setEditCommentErrorMsg] = useState<string>(content);
    const [editCommentErrorColor, setEditCommentErrorColor] = useState<string>("");
    function handleEditComment() {
        if (submitButtonText == "Edit") {
            setSubmitButtonText("Delete");
            toggleCommentId(commentId);
        } else {
            setSubmitButtonText("Edit");
            toggleCommentId(-1);
        }
    }

    function handleDeleteComment() {
        const CommentData = {
            comment: {
                id: commentId
            }
        }

        dispatch(destroyCommentAsync(CommentData))
        .then(() => {
            toggleCommentId(-1);
        })


    }

    function submitEditComment() {
        if (editCommentContent == "") {
            setEditCommentErrorMsg("Comment cannot be empty!");
            setEditCommentErrorColor("editCommentError");
        } else {
        const CommentData = {
            comment: {
                id: commentId,
                username: username,
                user_id: userId,
                content: editCommentContent,
                post_id: postId
            }
        }

        dispatch(updateCommentAsync(CommentData))
        .then(() => {
            handleEditComment();
        })
    }
    }
    return (
        <div className="Comment_display_container">
            <div className="Authentication_style">
                <div className="Authentication_display">
                    <img src= "./NavBarMenuPics/ProfileSettings.png"/>
                    <h6>{username+"  ~"}</h6>
                    <h5 className="comment_create_date">
                        <Moment fromNow>{commentCreationDate}</Moment>
                    </h5>
                    {(commentCreationDate != commentUpdateDate) && 
                        <>
                            <h5 className="comment_double_wall">||</h5>
                            <h5 className="moment_divider">{"edited "}
                                <Moment fromNow>{commentUpdateDate}</Moment>
                            </h5>
                        </>
                    }
                </div>
                {(commentId != -1) && 

                ((submitButtonText == "Edit") ? 
                <button className={`${submitButtonText}_comment_btn`}
                onClick={() => {toggleCommentId(commentId);handleEditComment()}}
                >
                    {submitButtonText}
                </button>

                :
                <div className="Edit_component_btns">
                    <button className="Done_comment_btn"
                    onClick={submitEditComment}>Done</button>
                    <button className={`${submitButtonText}_comment_btn`}
                    onClick={() => {toggleCommentId(commentId);handleDeleteComment()}}
                    >
                        {submitButtonText}
                    </button>
                </div>
                )}
            </div>
            {(submitButtonText == "Edit") ?
                <h4 className="comment_content_box">{content}</h4>
                :
                <textarea 
                className={"edit_comment_textarea " + editCommentErrorColor}
                placeholder={editCommentErrorMsg}
                value={editCommentContent}
                onFocus={(e) => {
                    if (editCommentErrorMsg == "Comment cannot be empty!") {
                        setEditCommentErrorMsg("Leave your comment here");
                    } else {
                        setEditCommentErrorMsg(content);
                    }
                    setEditCommentErrorColor("");
                }
                }
                onChange={(e) => setEditCommentContent(e.target.value)}>
                </textarea>
            }
        </div>
    )
}