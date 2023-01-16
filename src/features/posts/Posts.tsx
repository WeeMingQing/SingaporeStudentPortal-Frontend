import React, { useEffect, useState } from 'react'
import { useAppDispatch} from '../../app/hooks'
import { updatePostAsync, destroyPostAsync } from './postSlice'
import { createCommentAsync } from '../comments/commentSlice';
import Comment from '../comments/comment';
import "./Posts.css"
import { CommentState } from '../comments/commentSlice';
import { fetchPostComments } from '../comments/commentAPI';
import Moment from 'react-moment';
import { useSelectAuthProvider } from '../../app/hooks/AuthProvider'

// function Posts(index:number) {
//     const posts = useAppSelector(selectPosts);
//     const status = useAppSelector(selectStatus);
//     const dispatch = useAppDispatch();
//     const [postToEdit, setPostToEdit] = useState<number>(0);

//     useEffect(() => {
//         dispatch(fetchPostsAsync(index));
//     }, [dispatch])

//     function toggleEditForm(post_id?:number) {
//         if(postToEdit === post_id) {
//             setPostToEdit(0);
//         } else {
//             setPostToEdit(post_id as number);
//         }
//     }

//     function submitEdit(formData: any) {
//         dispatch(updatePostAsync(formData));
//         toggleEditForm();
//     }

//     let contents;

//     if (status !== Statuses.UpToDate) {
//         contents = <div>{status}</div>
//     } else {
//         contents = <div className='card'>
//             <div className='card-body'>
//                 <h3>{status}</h3>
//                 <PostForm />
//                 {posts && posts.length > 0 && posts.map(post => {
//                     return <div key={post.id} style = {{margin: "5em"}}>
//                         <Post
//                         dispatch = {dispatch}
//                         post = {post}
//                         toggleEditForm={() => toggleEditForm(post.id)}
//                         postToEdit={postToEdit}
//                         submitEdit={submitEdit}
//                         post_id = {post.id}
//                         />
//                     </div>
//                 })}
//             </div>
//         </div>
//     }
//     return (
//         <div>
//         <h1>Post</h1>
//         <h3>{contents}</h3>
//         </div>
//     )
// }

type PostsProps = {
    PostIndex:number
    PostContent:string
    PostCreator: string
    PostCreationDate: string
    PostUpdateDate: string
    Community_header: string
    Community_id: number
    togglePostId:(postId: number) => void
}

function Posts({PostIndex, PostContent, PostCreator, PostUpdateDate, PostCreationDate, Community_header, Community_id, togglePostId}: PostsProps) {
    const {toggleModal} = useSelectAuthProvider();
    const username = localStorage.getItem("username") as string;
    const userId = parseInt(localStorage.getItem("user_id") as string);
    const dispatch = useAppDispatch();
    const [comments, setComments] = useState<CommentState[]>([]); 
    const [openComments, setOpenComments] = useState<boolean>(false);
    const [commentContent, setCommentContent] = useState<string>("");
    const [editPostId, setEditPostId] = useState<number>(-1);
    const [editCommentId, setEditCommentId] = useState<number>(-1);
    const [submitButtonText, setSubmitButtonText] = useState<string>("Edit");
    const [editPostContent, setEditPostContent] = useState<string>(PostContent);
    const [postPlaceholderValue, setPostPlaceholderValue] = useState<string>(PostContent);
    const [editPostErrorMsg, setEditPostErrorMsg] = useState<string>("");
    const [commentErrorMsgColor, setCommentErrorMsgColor] = useState<string>("");
    const [commentErrorMsg, setCommentErrorMsg] = useState<string>('Leave your comment here');


    function toggleCommentId(commentId: number) {
        setEditCommentId(commentId);
    }

    function handleToggleComments() {
        setOpenComments(prevOpenComments => !prevOpenComments);
    }

    function getComments(arr: CommentState[]) {
        setComments(arr);
    }

    function handleSubmitComments(event: React.MouseEvent) {
        if (username != "") {
        if (commentContent == "") {
            setCommentErrorMsgColor("emptyError");
            setCommentErrorMsg("Comment cannot be empty!");
        } else {
        const commentData = {
            comment : {
                content: commentContent,
                username: username,
                user_id: userId,
                post_id: PostIndex,
            }
        }
        dispatch(createCommentAsync(commentData))
        .then(() => {
            setCommentContent("");
            setEditPostId(-1);
        })
    }} else {
        toggleModal("createComment");
    }
    }
//For Posts:
    function handleEditPost() {
        if (submitButtonText == "Edit") {
            setSubmitButtonText("Delete");
            togglePostId(PostIndex);
        } else {
            setSubmitButtonText("Edit");
            togglePostId(-1);
        }
    }

    function handleDeletePost() {
        const PostData = {
            post: {
                id: PostIndex
            }
        }

        dispatch(destroyPostAsync(PostData))
        .then(() => {
            togglePostId(-1);
        })
    }

    function submitEditPost() {
        if (editPostContent == "") {
            setPostPlaceholderValue("Post cannot be empty!");
            setEditPostErrorMsg("editPostError");
        } else {
        const PostData = {
            post: {
                id: PostIndex,
                username: username,
                user_id: userId,
                content: editPostContent,
                community_header: Community_header,
                community_id: Community_id
                
            }
        }

        dispatch(updatePostAsync(PostData))
        .then(() => {
            handleEditPost();
        })
    }
    }
    useEffect(() => {
        console.log("checkpost", PostIndex)
        fetchPostComments({getComments, PostIndex});
        console.log("checkcomments", comments)
    },[commentContent, PostIndex, editPostId, editCommentId])

    return (
        <div className='Feed_body_container'>
            <div className='Feed_post_flexbox'>
            <div className='side_decoration'></div>
            <div className="Feed_post_container">
                    <div className="Authentication_style">
                        <h1>{"Posted by " + PostCreator + "  ~ "}</h1>
                        <Moment fromNow>{PostCreationDate}</Moment>
                        {(PostCreationDate != PostUpdateDate) && 
                        <>
                            <h5 className='double_wall'>||</h5>
                            <h5 className="moment_divider">{"edited "}
                                <Moment fromNow>{PostUpdateDate}</Moment>
                            </h5>
                        </>
                        }
                        {(username == PostCreator) && 
                        
                        ((submitButtonText == "Edit") ?
                        <button className={`${submitButtonText}_comment_btn`}
                        onClick={handleEditPost}>
                            {submitButtonText}
                        </button>

                        :
                        <div className="Edit_component_btns">
                            <button className="Done_comment_btn"
                            onClick={submitEditPost}>Done</button>
                            <button className={`${submitButtonText}_comment_btn`}
                            onClick={() => {handleDeletePost()}}>
                                {submitButtonText}
                            </button>
        
                        </div>

                        )}
                    </div>
                    {(submitButtonText == "Edit") ?
                    <h1 className='Feed_post_content'>{PostContent}</h1>
                    :
                    <textarea className={`Feed_post_content_textarea ${editPostErrorMsg}`}
                    placeholder={postPlaceholderValue}
                    value={editPostContent}
                    onFocus={(e) => {
                        if (postPlaceholderValue == "Post cannot be empty!") {
                            setPostPlaceholderValue("Leave Your Post here");
                        }
                        setEditPostErrorMsg("");
                    }}
                    onChange={(e) => setEditPostContent(e.target.value)}></textarea>

                    }
                    <button className='open_comments_btn' onClick={handleToggleComments}>
                        <img src= "./NavBarMenuPics/CommentIcon.png"/>
                        <h6>{(comments.length) ? comments.length + " comments" : "0 comment"}</h6>
                    </button>
            </div>
            </div>
            {(openComments) && 
            <div className='Feed_comment_container'>
                <textarea
                className={'Feed_create_textarea ' + commentErrorMsgColor}
                placeholder={commentErrorMsg}
                onFocus={() => {setEditPostId(PostIndex); setCommentErrorMsg('Leave your comment here'); setCommentErrorMsgColor("")}}
                onChange={(e) => setCommentContent(e.target.value)}
                onBlur={(e) => e.target.value=""}>
                </textarea>
                <button className="submit_post_btn" onClick={(e) => {setEditPostId(PostIndex);handleSubmitComments(e)}}>Submit</button>
                <>
                    {comments && comments.length > 0 &&<span className='black_line'></span>}
                </>
                <>
                {comments && comments.length > 0 && comments.map(comment => {
                    return (
                        <React.Fragment key={comment.id}>
                        <Comment
                        commentUpdateDate={comment.updated_at}
                        commentCreationDate={comment.created_at}
                        commentId={(comment.username == username) ? comment.id as number : -1}
                        username={comment.username}
                        userId = {comment.user_id}
                        content={comment.content}
                        postId={PostIndex}
                        toggleCommentId = {toggleCommentId}
                        />
                        </React.Fragment>
                    )
                })

                }
                </>
    
            </div>
            }
        </div>
    )
}

export default Posts
