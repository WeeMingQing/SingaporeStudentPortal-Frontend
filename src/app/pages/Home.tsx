import React, { useEffect, useState } from "react"
import "./Home.css"
import { CommunityState, destroyCommunityAsync } from "../../features/communities/communitySlice"
import { Link } from "react-router-dom"
import { useAppDispatch } from "../hooks"

type communityClickedProps = {
    communityId: string,
    communityHeader: string,
    username: string,
    communityCreateDate: string
}

//Set the community info that user has clicked into
export function communityClicked({communityId, communityHeader, username, communityCreateDate}: communityClickedProps) {
    localStorage.setItem("community_id", communityId);
    localStorage.setItem("community_header", communityHeader);
    localStorage.setItem("creatorUsername", username);
    localStorage.setItem("CommunityCreateDate", communityCreateDate)
}

//To display all the communities that the user has joined
export function Home() {
    const dispatch = useAppDispatch();
    const [communityId, setCommunityId] = useState<number>(-1);
    const [joinedCommunities, setJoinedCommunities] = useState<CommunityState[]>([]);
    const [communitiesNumber, setCommunitiesNumber] = useState<number>(0);
    useEffect(() => {
        localStorage.setItem("DropDownNavigationDisplay", "Home");
        const API_URL = "https://mq-sspr.onrender.com";
        const token = localStorage.getItem("token");
        const user_id = localStorage.getItem("user_id");
        if (user_id != "") {
            fetch(`${API_URL}/users/communities`, {
            method: "GET",
            headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"              
      }
      })
      .then(response => response.json())
      .then(data => {
          setJoinedCommunities(data);
          setCommunitiesNumber((data) ? data.length : 0);
      });
    }

    }, [communityId])

    useEffect(() => {
        window.scrollTo(0, 0);
        localStorage.setItem("DropDownNavigationDisplay", "Home");
    },[])

    type deleteJoinedCommunityProps = {
        community_id: number,
        event: React.MouseEvent
    }

    function deleteJoinedCommunity({community_id, event}: deleteJoinedCommunityProps) {
        event.preventDefault()
        const CommunityData = {
            community: {
                id: community_id
            }
        }
        dispatch(destroyCommunityAsync(CommunityData))
        .then(() => {
            setCommunityId(-1);
        })
    }


    return (
        <div className="Home_main_container">
            <div className="Home_header">
                <div className="Home_header_top"></div>
                <h1>Home</h1>
                <h5>{`Communities joined: ${communitiesNumber}`}</h5>
            </div>
            <div className='Home_main_container-body'>
                {joinedCommunities && joinedCommunities.length > 0 && joinedCommunities.map(community => {
                    const community_id = community.id as number
                    const communityId = `${community.id as number}`;
                    const communityHeader = community.header as string;
                    const username = community.username;
                    const communityCreateDate  = community.created_at as string;
                    return (
                        <React.Fragment key={community.id as number}>
                                <Link className="Community-card_content" to={"/Feed"} 
                                onClick={() => {communityClicked({communityId, communityHeader, username, communityCreateDate})}}>
                                <h3>{community.header}</h3>
                                <div className="community_btns">
                                    <button className="Leave_community_btn" onClick={(event)=> {setCommunityId(community_id); deleteJoinedCommunity({community_id, event})}}>
                                    Leave
                                    </button>
                                    <img src= "./NavBarMenuPics/rightArrow.png"/>
                                </div>
                                </Link>
                    </React.Fragment>
                    )
                })}
            </div>
        </div>
    )
}