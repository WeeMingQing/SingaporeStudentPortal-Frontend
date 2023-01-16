import React, {useEffect, useState, } from 'react'
import "./navbar.css"
import { RiMenu3Line, RiCloseLine} from "react-icons/ri"
//RiMenu3Line creates 3 lines, RiCloseLine displays a cross
import {Link} from "react-router-dom"
import { useDarkTheme } from "../hooks/ThemeProvider"
import { useSelectAuthProvider } from '../hooks/AuthProvider'
import { SearchBar } from '../utilities/SearchBar'
import {NavBarDropDown} from "../utilities/NavBarDropDown"
import { MainNavBar } from '../utilities/MainNavBar'
import { CommunityState } from '../../features/communities/communitySlice'

const Menu = () => (
  <>
  <p><Link to="/" className="ssp__navbar-menu_container-title-style">
    Home
    </Link></p>
  <p><Link to="/Explore" className="ssp__navbar-menu_container-title-style">Explore</Link></p>
  </>
)

type NavbarProps = {
  communityData: CommunityState[];
}

export function Navbar({communityData}: NavbarProps) {
  const username = localStorage.getItem("username");
  const {toggleDarkTheme, themeColour, textColour} = useDarkTheme()
  const {toggleModal, modalToggle, authType} = useSelectAuthProvider();
  const [togglingMenu, setTogglingMenu] = useState<boolean>(false);


  return (
    <div className="ssp__navbar" style={{backgroundColor: textColour}}>
      <div className='ssp__navbar-links'>
        <div className='ssp__navbar-links_logo'>
          <Link to={"/"}>
            <img src="/NavBarMenuPics/SSP_logo_light.png" style={{width:"3.8rem", height:"3.8rem"}}/>
          </Link>
        </div>
        <div className='ssp__navbar-links_container'>
          <MainNavBar/>
        </div>
        <div className="ssp__navbar-links_SearchBar">
          <SearchBar placeholder='Search Topic' communityData={communityData}/>
        </div>
      </div>
      <div className="ssp__navbar-sign">
        {(username == "") && 
          (
          <>
          <p style={{color: themeColour}}
        onClick={() => {toggleModal("Login")}}>Sign In</p>
        <button type = "button" style={{color: textColour}}
        onClick={() => {toggleModal("SignUp")}}>Sign Up</button>
        </>
          )
        }
        <NavBarDropDown/>
      </div>
      <div className="ssp__navbar-menu">
        {togglingMenu
        ?<RiCloseLine color="#000" size={27} onClick={()=>{setTogglingMenu(false)}}/>
        :<RiMenu3Line color="#000" size={27} onClick={()=>{setTogglingMenu(true)}}/>
        }
        {togglingMenu && (
          <div className="ssp__navbar-menu_container scale-up-center">
            <div className="ssp__navbar-menu_container-links">
              <Menu/>
              {(username == "") && (
              <div className="ssp__navbar-menu_container-links-sign">
                <p onClick={() => {toggleModal("Login")}}>Sign In</p>
                <button type = "button"
                onClick={() => {toggleModal("SignUp")}}>Sign Up</button>
              </div>
              )
              }
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar
