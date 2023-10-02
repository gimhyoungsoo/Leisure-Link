import MainPage from "./MainPage";
import MyPage from "../components/MyPage/MyPage";
import React from "react";
import "../pages/App.module.css";
import SignupPage from "./SignupPage";
import LoginPage from "./LoginPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Modal from "../components/Common/Modal";
import { createPortal } from 'react-dom';
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/LoginPage" element={<LoginPage />} />
          <Route path="/SignUpPage" element={<SignupPage />} />
          <Route path="/MyPage" element={<MyPage />} />
        </Routes>
      </BrowserRouter>
      {createPortal(<Modal/>, document.body)}
    </>
  );
}

export default App;



