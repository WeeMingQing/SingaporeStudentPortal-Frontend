import "./NavBarDropDown.css"
import React, {ReactNode, useState, useEffect, ReactEventHandler} from "react";
import cx from "classnames"
import { ToggleButton } from "./ToggleButton";
import { Link } from "react-router-dom";


interface NavItemProps {
    index: Number
    curr: Number
    setFunc: (value: Number) => void
    source: string;
  }

const NavItem: React.FC<NavItemProps> = ({index, curr, setFunc, source}: NavItemProps ) => {
    const username = localStorage.getItem("username");
    useEffect(() => {
        if (curr!= index && open) {
            setOpen(prevOpen => !open)
            setCXStrName(prevCsStrName => "")
        }
    }, [curr])
    const [open, setOpen] = useState<boolean>(false)
    const [cxStrName, setCXStrName] = useState<string>("")
    function clickOutside( event: React.FocusEvent) {
        const handleBlur = () => {
            const currentTarget = event.currentTarget;
            setTimeout(() => {
                if (!currentTarget.contains(document.activeElement)) {
                    setOpen(false);
                    setCXStrName(prevCxStrName => "");
                }
            }, 0);
        }
        return handleBlur();
    }

    const NavBarItemDropDown = () => {
        const [toggled, setToggled] = useState<boolean>(false);
        return (
            <div className="dropdown">
                    <div className="menu">
                        {(username != "") && 
                        <h6>{"Hi, " + username }</h6>
                        }
                        <DropDownItem source1="/NavBarMenuPics/DarkMode.png" source2={<ToggleButton rounded={true} isToggled={toggled} onToggle={() => {setToggled(prevToggled => !toggled)}}/>} texttittle="Dark Mode" buttonFunction={() => {}}></DropDownItem>
                        {(username != "") &&
                            <DropDownItem source1="/NavBarMenuPics/LogoutIcon.png" source2 ="" texttittle="Logout" buttonFunction={() => {
                            localStorage.setItem("username", "");
                            localStorage.setItem("token", "");
                            localStorage.setItem("user_id", "");
                            setOpen(false);
                        }}></DropDownItem>
                        }
                    </div>
            </div>
        )
    }

    return (
        <li className="nav-item" onBlur ={(event) => clickOutside(event)} >
            <a href="#!" className= {cx("icon-button", cxStrName)} onClick={() => 
                {
                setFunc(index);
                setOpen(prevOpen => !open);
                if (!open) {
                    setCXStrName(prevCxStrName => "clicked")
                } else {
                    setCXStrName(prevCxStrName => "")
                }
                }}>
                <img src={source}/>
            </a>
            {open && 
            <NavBarItemDropDown/>
            }
        </li>
    )
  };


export function NavBarDropDown() {
    const [selectedItem, setSelectedItem] = useState<Number>(-1);
    function setItem(value : Number) {
        setSelectedItem(value)
    }

    return (
        <nav className="navbardropdown">
            <ul className="navbardropdown_nav">
                <NavItem 
                index={0} 
                curr={selectedItem} 
                setFunc = {setItem}
                source="/NavBarMenuPics/SettingIcon.png"/>
            </ul>
        </nav>
    )
}

type DropDownItemProps = {
    source1: string | ReactNode
    source2: null | ReactNode
    texttittle: string
    buttonFunction: () => void
}

export function DropDownItem({source1, source2, texttittle, buttonFunction}: DropDownItemProps) {
    return (
        <Link reloadDocument to={"/Explore"} className="menu-item" onClick={() => buttonFunction()}>
            { (typeof source1 === "string") ? ( 
            <span className="icon-button">
                <img src = {source1 as string}/>
            </span>
            )
            :
            (source1 as ReactNode)
            }
            <span className="text-title">
                {texttittle}
            </span>
            <span className="icon-right"> 
            { ((typeof source2) == null) ?  
                    null
                : 
                (source2 as ReactNode)}
            </span>
        </Link>
    )
}

  