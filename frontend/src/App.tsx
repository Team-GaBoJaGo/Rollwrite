import React, { useEffect } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./constants/types";
import {
  updateAccessToken,
  updateLoginStatus,
  updateRouteHistory,
} from "./store/authReducer";
import { axiosFileInstance, axiosInstance } from "./apis/instance";

import MainLayout from "./Layout/MainLayout";
import SubLayout from "./Layout/SubLayout";
import HomePage from "./pages/HomePage/HomePage";
import MyPage from "./pages/MyPage/MyPage";
import QuestionPage from "./pages/QuestionPage/QuestionPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import NotifyPage from "./pages/NotifyPage/NotifyPage";
import SettingPage from "./pages/SettingPage/SettingPage";
import CreateGroupPage from "./pages/CreateGroupPage/CreateGroupPage";
import InvitePage from "./pages/InvitePage/InvitePage";
import AnswerPage from "./pages/AnswerPage/AnswerPage";
import ResultPage from "./pages/ResultPage/ResultPage";
import JoinPage from "./pages/JoinPage/JoinPage";
import AwardPage from "./pages/AwardPage/AwardPage";
import OauthPage from "./pages/OauthPage/OauthPage";
import ErrorPage from "./pages/ErrorPage/ErrorPage";

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const accessToken = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyNzcwNzc4MjAwIiwicm9sZSI6IlVTRVIiLCJpc3MiOiJyb2xsd3JpdGUuY28ua3IiLCJleHAiOjE2ODMxODQyNDcsImlhdCI6MTY4MzA5Nzg0N30.umHq-d0ioV-wavsc-2Nu4XnP0UJL70X6YwAeeyGXSlAIkz--ymlEtXtXtZe19cSlExw7F1WFou2erZYMebZq5Q`;
  // const accessToken = useAppSelector((state) => state.auth.accessToken);
  const isLogin = useAppSelector((state) => state.auth.isLogin);

  const currentPath = location.pathname;
  if (accessToken) {
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${accessToken}`;
    axiosFileInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${accessToken}`;
  }

  // 토큰 갱신
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const { config, response } = error;
      const originalRequest = config;

      if (response.data.statusCode === 401) {
        try {
          // 갱신 요청
          axiosInstance.defaults.headers.common["Authorization"] = null;
          const res = await axiosInstance.post<any>(`auth/reissue`);
          const newAccessToken = res.data.data.accessToken;
          dispatch(updateAccessToken(newAccessToken));
          // 실패했던 요청 새로운 accessToken으로 헤더 변경하고 재요청
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } catch (err) {
          // 갱신 실패시 임의 로그아웃 처리
          console.log("갱신실패", err);
          dispatch(updateLoginStatus(false));
          dispatch(updateAccessToken(""));
          navigate("/error");
        }
      } else {
        navigate("/error");
      }
      return Promise.reject(error);
    }
  );

  // 토큰 갱신
  axiosFileInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const { config, response } = error;
      const originalRequest = config;

      if (response.data.statusCode === 401) {
        try {
          // 갱신 요청
          axiosInstance.defaults.headers.common["Authorization"] = null;
          const res = await axiosInstance.post<any>(`auth/reissue`);
          const newAccessToken = res.data.data.accessToken;
          dispatch(updateAccessToken(newAccessToken));
          // 실패했던 요청 새로운 accessToken으로 헤더 변경하고 재요청
          axiosFileInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosFileInstance(originalRequest);
        } catch (err) {
          // 갱신 실패시 임의 로그아웃 처리
          console.log("갱신실패", err);
          dispatch(updateLoginStatus(false));
          dispatch(updateAccessToken(""));
          navigate("/error");
        }
      } else {
        navigate("/error");
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    // if (!isLogin && currentPath !== "/login" && currentPath !== "/oauth") {
    //   navigate("/login");
    //   dispatch(updateRouteHistory(currentPath));
    // }
  });

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/question" />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/question" element={<QuestionPage />} />
        <Route path="/my" element={<MyPage />} />
      </Route>
      <Route path="/" element={<SubLayout />}>
        <Route path="/notify" element={<NotifyPage />} />
        <Route path="/setting" element={<SettingPage />} />
        <Route path="/invite/:meetingId" element={<InvitePage />} />
        <Route path="/answer" element={<AnswerPage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/oauth" element={<OauthPage />} />
      <Route path="/result/:meetingId" element={<ResultPage />} />
      <Route path="/join/:inviteCode" element={<JoinPage />} />
      <Route path="/award/:meetingId" element={<AwardPage />} />
      <Route path="/create" element={<CreateGroupPage />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;
