import React, {useState} from "react"
import "./SearchBar.css"
import SearchIcon from "@material-ui/icons/Search"
import CloseIcon from "@material-ui/icons/Close"
import { CommunityState } from "../../features/communities/communitySlice"
import { Link } from "react-router-dom"
import { communityClicked } from "../pages/Home"

type SearchBarProps = {
    placeholder: string;
    communityData: CommunityState[]
}

//Enable users to search for communities
export function SearchBar({placeholder, communityData}: SearchBarProps) {
    const communities = communityData;
    const [filteredData, setFilteredData] = useState<CommunityState[]>([]);
    const [userInput, setUserInput] = useState<string>("");
    const clearInput = () => {
        setFilteredData([])
        setUserInput("")
    }
    const handleFilter = (event: React.ChangeEvent) => {
        const target = event.target as HTMLInputElement;
        const searchWord = target.value;
        setUserInput(searchWord)
        const newFilter = communities.filter((value) => {
            return value.header.toLowerCase().includes(searchWord.toLowerCase()) ? true : false
        })
        if (searchWord === "") {
            setFilteredData([])
            setUserInput("")
        } else {
            setUserInput(searchWord)
            setFilteredData(newFilter)
        }
    }

    return (
            <div className="search">
                <div className="searchInputs">
                    <input type="text" placeholder={placeholder} onChange={(event) => {handleFilter(event)}} value={userInput}/>
                    <div className="searchInputs_clearBtn"> 
                    { (userInput !== "") && (
                        <button id="clearBtn" onClick={clearInput}>
                            <CloseIcon/>
                        </button>
                    )}
                    </div>
                    <button className="searchIcon">
                        <SearchIcon/>
                    </button>
                </div>
                { (filteredData.length != 0) &&
                <div className="dataResult">
                    {filteredData.slice(0, 15).map((value, key) => {
                        const community_id = value.id as number
                        const communityId = `${value.id as number}`;
                        const communityHeader = value.header as string;
                        const username = value.username;
                        const communityCreateDate  = value.created_at as string;
                        return (
                            <React.Fragment key={community_id}>
                            <Link 
                            reloadDocument
                            className="dataItem" 
                            to={"/Feed"}
                            onClick={() => {setUserInput("");setFilteredData([]);communityClicked({communityId, communityHeader, username, communityCreateDate})}}>
                                <p>{value.header}</p>
                            </Link>
                            </React.Fragment>
                        )
                        })
                    }
                </div>
                }
            </div>
    )
}