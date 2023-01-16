import { Community } from "../../features/communities/community"
import React, {useEffect} from "react";
import "./Explore.css"

type ExploreProps = {
    changeUser: string
}

export function Explore({changeUser}: ExploreProps) {
    useEffect(() => {
        window.scrollTo(0, 0);
    },[changeUser])
    return ( 
    <div className="Explore_main_container">
        <Community changeUser={changeUser}/>
    </div>
    )
}