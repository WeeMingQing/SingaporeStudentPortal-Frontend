import './App.css';
import { ThemeProvider} from "./app/hooks/ThemeProvider"
import { AuthProvider, useSelectAuthProvider} from "./app/hooks/AuthProvider"
import {Routes, Route} from "react-router-dom"
import { Home } from './app/pages/Home'
import { Feed } from './app/pages/Feed'
import { Explore } from './app/pages/Explore'
import { Container } from 'react-bootstrap'
import Navbar from './app/components/Navbar1';
import Authentication from './app/pages/Authentication';
import { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { fetchCommunitiesAsync, selectCommunities } from './features/communities/communitySlice';

function App() {
  const dispatch = useAppDispatch();
  const communities = useAppSelector(selectCommunities);
  const {currentUsername} = useSelectAuthProvider();
  const [changeUser, setChangeUser] = useState<string>("");
  const toggleUser = (username: string) => setChangeUser(username);

  const API_URL = "http://localhost:3000";
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Home ran now");
    if (token) {
      fetch(`${API_URL}/auto_login`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => response.json())
      .then(data => {
        setChangeUser(data.username)
        localStorage.setItem("user_id", `${data.id}`);
        localStorage.setItem("username", data.username);
        console.log(localStorage.getItem("username"));
      });
    }
    dispatch(fetchCommunitiesAsync(""));

  }, [currentUsername, changeUser])
  return (
  <div className='App_main_container'>
  <AuthProvider>
  <ThemeProvider>
      <Navbar communityData={communities}/>
  </ThemeProvider>
      <Authentication changeUser={toggleUser}/>
      <Container className='App_container'>
          <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/Feed" element={<Feed/>}/>
              <Route path="/Explore" element={<Explore changeUser={changeUser}/>}/>
          </Routes>
      </Container>
    </AuthProvider>
  </div>
  )
}

export default App;
