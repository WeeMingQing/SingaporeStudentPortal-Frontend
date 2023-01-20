import "./Feed.css"
import React, { useEffect, useState, useRef } from "react";
import Posts from "../../features/posts/Posts";
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { createPostsAsync, fetchPostsAsync, selectPosts } from "../../features/posts/postSlice";
import Moment from "react-moment";
import { fetchUserCount } from "../../features/communities/communityAPI";
import { joinedCommunities } from "../../features/communities/community";
import { createCommunityAsync, destroyCommunityAsync } from "../../features/communities/communitySlice";
import { useSelectAuthProvider } from "../hooks/AuthProvider"

//To display the community, as well as the associate posts and comments
// that user has clicked into
export function Feed() {
    localStorage.setItem("DropDownNavigationDisplay", "Explore");
    let event = new Event('storage');
    window.dispatchEvent(event);
    const {toggleModal} = useSelectAuthProvider();
    const curr_username = localStorage.getItem("username") as string;
    const API_URL = "https://mq-sspr.onrender.com";
    const userId = parseInt(localStorage.getItem("user_id") as string);
    const community_id = parseInt(localStorage.getItem("community_id") as string);
    const community_header = localStorage.getItem("community_header") as string;
    const CommunityCreateDate = localStorage.getItem("CommunityCreateDate") as string;
    const username = localStorage.getItem("creatorUsername");
    const commId = `${community_id}`;
    const [userCount, setUserCount] = useState<number>(0);
    const posts = useAppSelector(selectPosts);
    const [postContent, setPostContent] = useState<string>("");
    const [editPostId, setEditPostId] = useState<number>(-1);
    const [postMsg, setPostMsg] = useState<string>("Create a post here");
    const [postErrorMsgColor, setPostErrorMsgColor] = useState<string>("");
    const token = localStorage.getItem("token");
    const [buttonMsg, setButtonMsg] = useState<string>("Join This Community");
    const [buttonMsgColor, setButtonMsgColor] = useState<string>("");
    const [communityHeader, setCommunityHeader] = useState<boolean>(false);
    const deleteOrCreate = useRef<boolean>(false);
    const dispatch = useAppDispatch();

    type updateJoinedCommunityProps = {
        community_header: string,
        deleteOrCreateValue: boolean,
        community_id: number
    }

    function updateJoinedCommunity({community_id, community_header, deleteOrCreateValue}: updateJoinedCommunityProps) {
        if (curr_username != "") {
        if (deleteOrCreateValue) {
            const CommunityData =  {
                community: {
                    id:community_id
                }
        }
            dispatch(destroyCommunityAsync(CommunityData))
            .then(() => {
                setCommunityHeader(!communityHeader);
                deleteOrCreate.current = false;
            })
        } else {
            const CommunityData = {
                community: {
                    header: community_header,
                    user_id: userId,
                    username: username
                    }
                }
            dispatch(createCommunityAsync(CommunityData))
            .then(() => {
                setCommunityHeader(!communityHeader);
                deleteOrCreate.current = true;

            })
        }
    } else {
        toggleModal("openJoinThisCommunity");
    }
    }


    function updateUserCount(userNumber: number) {
        setUserCount(userNumber);
    }

    function togglePostId(postId: number) {
        setEditPostId(postId);
    }

    function handlePostSubmit() {
        if (curr_username != "") {
        if (postContent == "") {
            setPostErrorMsgColor("emptyError");
            setPostMsg("Post cannot be empty!");
        } else {
            setEditPostId(5); 
        const PostData = {
            post: {
                content: postContent.trim(),
                user_id: userId,
                username: curr_username,
                community_id: community_id,
                community_header: community_header
            }
        }

        dispatch(createPostsAsync(PostData))
        .then(() => {
            setPostContent("");
            setEditPostId(-1);
        })
    }} else {
        toggleModal("CreatePost");
    }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
    },[])

    useEffect(() => {
        fetchUserCount({updateUserCount, community_header});
        setButtonMsg("Join This Community");
        setButtonMsgColor("");
        deleteOrCreate.current = false;
        if (userId) {
            fetch(`${API_URL}/users/communities`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"              
            }
            })
            .then(response => response.json())
            .then(data => {
              const d: joinedCommunities[] = data;
              d.forEach(community => {
                if (community.header == community_header) {
                    deleteOrCreate.current = true;
                    setButtonMsg("Leave This Community");
                    setButtonMsgColor("leaveBtnDisplay");
                }
              })
            });
        }
    },[community_id, communityHeader]);

    useEffect(() => {
        dispatch(fetchPostsAsync(commId));
    },[setPostContent, editPostId,]);

    return (
        <div className="Feed_container">
            <div className="Feed_header">
                <div className="Feed_header_top">
                    <button 
                    className={"Feed_header_button " + buttonMsgColor}
                    onClick={(event) => {
                        const deleteOrCreateValue = deleteOrCreate.current;
                        updateJoinedCommunity({community_id, community_header, deleteOrCreateValue })}}>
                        {buttonMsg}
                    </button>
                </div>
                <div className="Feed_header_bottom">
                    <h1>{community_header}</h1>
                    <h3>{"Creator: "+ username}</h3>
                    <div className="Community_status">
                        <h2>{(posts?.length) ? "Posts: " + posts.length : "Posts: " + 0}</h2>
                        <h2>{"Created: "} 
                            <Moment fromNow>{CommunityCreateDate}</Moment>
                        </h2>
                        <h2>{`Users: ${userCount}`}</h2>
                    </div>
                </div>
            </div>
            <div className="Post_create_container">
                <div className="Post_create_button">
                    <h5>Create Post as:</h5>
                    <h4>{curr_username}</h4>
                    <button onClick={handlePostSubmit}>Submit</button>
                </div>
                <textarea
                className={"Post_create_textarea "+ postErrorMsgColor}
                placeholder={postMsg}
                onFocus={(e) => {
                        setPostMsg("Create a post here"); 
                        setPostErrorMsgColor("");
                    }}
                onBlur={(e) => e.target.value=""}
                onChange = {(e) => setPostContent(e.target.value)}>
                </textarea>
            </div>
            <div className="Post_render_container">
                <>
                {posts && posts.length > 0 && (
                    <div className="Post_divider">
                        <span className="black_line"></span>
                        <h1>Posts</h1>
                        <span className="black_line"></span>
                    </div>
                )}
                </>
                <>
                {posts && posts.length > 0 && (
                    posts.map(post => {
                    return (
                        <React.Fragment key={post.id}>
                            <Posts
                            PostUpdateDate={post.updated_at}
                            PostCreationDate={post.created_at}
                            PostCreator={post.username}
                            PostIndex={post.id as number}
                            PostContent={post.content}
                            Community_header={post.community_header}
                            Community_id={post.community_id}
                            togglePostId = {togglePostId}/>
                        </React.Fragment>
                        )
                    })
                )}
            </>
            </div>
        </div>
    )
}