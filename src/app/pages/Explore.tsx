import { Community } from "../../features/communities/community"
import {useEffect} from "react";
import "./Explore.css"

type ExploreProps = {
    changeUser: string
}

//To display all the existing communities created by users
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