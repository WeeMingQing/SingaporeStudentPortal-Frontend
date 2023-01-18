import React, {useState, useEffect} from "react"
import "./community.css"
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { CommunityState, destroyCommunityAsync, selectCommunities, selectStatus } from "./communitySlice";
import { fetchCommunitiesAsync, createCommunityAsync, Statuses } from "./communitySlice";
import {Link} from "react-router-dom"
import { useSelectAuthProvider } from '../../app/hooks/AuthProvider'

export type joinedCommunities = {
    id: number
    header: string 
    user_id: number
    created_at: string
    updated_at: string
}

type CommunityProps = {
    changeUser: string
}

export function Community({changeUser}: CommunityProps) {
    const {toggleModal} = useSelectAuthProvider();
    const user_id = localStorage.getItem("user_id") as string;
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username") as string;
    const API_URL = "https://mq-sspr.onrender.com";
    
    const dispatch = useAppDispatch();
    const communities = useAppSelector(selectCommunities);
    const status = useAppSelector(selectStatus);
    const [communityHeader, setCommunityHeader] = useState<string>("");
    const [editCommunityId, setEditCommunityId] = useState<number>(-1);
    const [createCommunityId, setCreateCommunityId] = useState<number>(-1);
    const [headerArr, setHeaderArr] = useState<CommunityState[]>([]);
    const [openCommunityModal, setOpenCommunityModal] = useState<boolean>(false);
    const [createCommunityHeaderErrorMsg, setCreateCommunityHeaderErrorMsg] = useState<string>("");

    type communityClickedProps = {
        communityId: string,
        communityHeader: string,
        username: string
        communityCreateDate: string
    }

    function communityClicked({communityId, communityHeader, username, communityCreateDate}: communityClickedProps) {
        localStorage.setItem("community_id", communityId);
        localStorage.setItem("community_header", communityHeader);
        localStorage.setItem("creatorUsername", username);
        localStorage.setItem("CommunityCreateDate", communityCreateDate)
    }

    type updateJoinedCommunityProps = {
        communityHeader: string,
        event: React.MouseEvent,
        deleteOrCreate: boolean,
        commIndex: number
    }

    function updateJoinedCommunity({commIndex, communityHeader, event, deleteOrCreate}: updateJoinedCommunityProps) {
        event.preventDefault();
        setEditCommunityId(commIndex);
        console.log("It ran", user_id, username);
        if (username != "") {
        if (deleteOrCreate) {
            const CommunityData =  {
                community: {
                    id:commIndex
                }
        }
            dispatch(destroyCommunityAsync(CommunityData))
            .then(() => {
                setCommunityHeader(communityHeader);
                setEditCommunityId(-1);
            })
        } else {
            const CommunityData = {
                community: {
                    header: communityHeader,
                    user_id: user_id,
                    username: username
                    }
                }
            dispatch(createCommunityAsync(CommunityData))
            .then(() => {
                setCommunityHeader(communityHeader);
                setEditCommunityId(-1);
            })
        }
    } else {
        toggleModal("changeJoinedCommunity");
    }
    }

    function handleCommunitySubmit() {
        console.log(communityHeader);
        if (communityHeader == "") {
        setCreateCommunityHeaderErrorMsg("Please fill in the header!");
        } else if (communities.filter(community => community.header.toUpperCase() == communityHeader.toUpperCase()).length != 0) {
            setCreateCommunityHeaderErrorMsg("Header already Exist!");
        } else {
        const CommunityData = {
            community: {
                header: communityHeader.trim(),
                user_id: user_id,
                username: username
            }
        }

        dispatch(createCommunityAsync(CommunityData))
        .then(() => {
            setCommunityHeader("");
            setCreateCommunityId(-1);
            setOpenCommunityModal(prevOpenCommunityModal => !prevOpenCommunityModal)
            setCreateCommunityHeaderErrorMsg("");    
        })
        }
    }

    useEffect(() => {
        localStorage.setItem("DropDownNavigationDisplay", "Explore");
        dispatch(fetchCommunitiesAsync(""));
        console.log("here", communities);
        if (user_id) {
          fetch(`${API_URL}/users/communities`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"              
          }
          })
          .then(response => response.json())
          .then(data => {
            setHeaderArr(data);
          });
}}, [createCommunityId, editCommunityId, changeUser]);

    let contents;

    if (status !== Statuses.UpToDate) {
            contents = 
        <div>{status}</div>
    } else {
        contents = 
        <div className="Community_container">
                {communities && communities.length > 0 && communities.map(community => {
                    const community_id = community.id as number;
                    const communityId = `${community.id as number}`;
                    const communityHeader = community.header as string;
                    const username = community.username;
                    const communityCreateDate = community.created_at as string;
                    const deleteOrCreate:boolean = (headerArr.filter(comm => comm.header == community.header).length != 0) ? true : false;
                    const btnStyle = (deleteOrCreate) ? "Leave" : "Join";
                    const commIndex = community.id as number;
                    return (
                        <React.Fragment key={community.id as number}>
                                <Link className="Community-card_content" to={"/Feed"} 
                                onClick={() => {communityClicked({communityId, communityHeader, username,communityCreateDate})}}>
                                <h3>{community.header}</h3>
                                <div className="community_btns">
                                    <button className={`${btnStyle}_community_btn`} onClick={(event)=> {updateJoinedCommunity({commIndex, communityHeader, event, deleteOrCreate})}}>{
                                    (deleteOrCreate) ? "Leave" : "Join"    
                                    }
                                    </button>
                                    <img src= "./NavBarMenuPics/rightArrow.png"/>
                                </div>
                                </Link>
                    </React.Fragment>
                    )
                })}
            </div>
    }
    return (
        <div className = "Community_main_container">
            {openCommunityModal && 
                <div className="Community_modal">
                    <div className="Community_modal_content">
                        <div className="Community_modal_content_header">
                            <h1>Create Community</h1>
                            <button className="close_community_modal" onClick={() => {setOpenCommunityModal(prevOpenCommunityModal => !prevOpenCommunityModal); 
                             setCreateCommunityHeaderErrorMsg("");}}>
                                <img src= "./NavBarMenuPics/CloseIcon.png"/>
                            </button>
                        </div>
                        {createCommunityHeaderErrorMsg ? (
                        <h5 className="create_community_header_error">{createCommunityHeaderErrorMsg}</h5>
                        )
                        :
                        (<h5 className="create_community_header_error"></h5>)
                        }
                        <div className="Community_modal_content_input">
                            <h5>Header:</h5>
                            <textarea placeholder="Enter header for community"
                            onFocus={(e) => setCreateCommunityId(-2)}
                            onChange={(e) => setCommunityHeader(e.target.value)}></textarea>
                        </div>
                        <button className="Community_submit_btn"
                        onClick={() => handleCommunitySubmit()}>Submit</button>
                    </div>
                </div>
            }
            <div className="Community_header">
                <div className="Community_header_top"></div>
                <h1>Explore Communities</h1>
                <button className="create_community_btn"
                onClick={() => {
                if (username != "") {
                    setOpenCommunityModal(prevOpenCommunityModal => !prevOpenCommunityModal)
                } else {
                    toggleModal("createCommunity");
                }
                }}>
                <h4>+</h4>
                <h5>Community</h5>
                </button>
            </div>
            {contents}
        </div>
    )
}