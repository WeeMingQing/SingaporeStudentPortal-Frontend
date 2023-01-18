import "./MainNavBar.css"
import React, {useEffect, useState} from "react"
import cx from "classnames"

//The navbar dropdown that enables users to navigate between home and explore.
export function MainNavBar() {
    const [dropDown, setDropDown] = useState<string>("");
    const [caret, setCaret] = useState<string>("selected_img");
    const [borderClicked, setBorderClicked] = useState<string>("");
    const selectedItem = (localStorage.getItem("DropDownNavigationDisplay") == null) ? "Home" : localStorage.getItem("DropDownNavigationDisplay");
    const [selectedPage, setSelectedPage] = useState<string>("");

    useEffect(() => {
        window.addEventListener('storage', (e) => setSelectedPage(selectedItem as string));
    return () => {
      window.removeEventListener('storage', (e) => setSelectedPage(selectedItem as string));
    };
  }, [selectedPage]);

    function toggleDropDown() {
        if (dropDown === "") {
            setBorderClicked("border_clicked")
            setDropDown("Main_Menu_container_focused");
            setCaret("rotated");
        } else {
            setDropDown("");
            setCaret("");
            setBorderClicked("");
        }
    }
    function MainNavBarOnBlur(event: React.FocusEvent) {
        const MainNavBarBlur = () => {
        const currentTarget = event.currentTarget;
        setTimeout(() => {
        if (!currentTarget.contains(document.activeElement)) {
            setDropDown("");
            setCaret("");
            setBorderClicked("");
            }
        }, 0)
        }
        return MainNavBarBlur();
    }

    function MainNavBarComponent() {
        return (
            <li className="Main_NavBar_selected-item">
                <img src={`./NavBarMenuPics/${selectedItem}Icon.png`} className="Menu_item-icon"/>
                <span className="Main_Menu_item-title">{selectedItem}</span>
                <img src="./NavBarMenuPics/DownArrow.png" className={cx("selected_img", caret)}/>
            </li>
        )
    }

    type MainNavBarItemListProps = {
        title: string
        linkTo: string
        content: string
    }
    function MainNavBarItemList({content, title, linkTo}: MainNavBarItemListProps) {
        return (
            <li className="Main_Menu_item-list_item">
                <a>
                    <span className="Menu_item-title">{title.toUpperCase()}</span>
                </a>
                <a className="Menu_item_link" href={linkTo} onClick={()=>{localStorage.setItem("DropDownNavigationDisplay", title)}}>
                    {content}
                </a>
            </li>
        )}


    return (
        <button className={cx("Main_NavBar_container", borderClicked)} onBlur={(event) => MainNavBarOnBlur(event)}
        onClick={toggleDropDown}>
            <MainNavBarComponent/>
            <ul className={cx("Main_Menu_container", dropDown)}>
                <MainNavBarItemList title={"Home"} content={"YOUR COMMUNITIES"} linkTo={"/"}/>
                <MainNavBarItemList title={"Explore"} content={"COMMUNITIES"} linkTo={"/Explore"}/>
            </ul>

        </button>
    )
}