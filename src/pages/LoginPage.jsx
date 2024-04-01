import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'

function LoginPage(props) {
    const navigate = useNavigate();

    async function reissueToken() {  // Access 토큰 만료시, 토큰 재발급.
        await axios
            .post(process.env.REACT_APP_DB_HOST + '/reissue', {
                accessToken: localStorage.getItem('token'),
                refreshToken: localStorage.getItem('refreshToken'),
            })
            .then((response) => {
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.accessToken}`;
                localStorage.setItem('token', response.data.data.accessToken);
                localStorage.setItem('expirationTime', String(response.data.data.accessTokenExpiresIn));
                navigate(`/main`);
            })
            .catch((error) => {
                localStorage.removeItem('token');
                localStorage.removeItem('expirationTime');
                localStorage.removeItem('refreshToken');
                // navigate(`/login`);  // 이미 현재 로그인 방식 선택 페이지에 위치해있기때문에 주석처리함.
            })
    }

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedExpirationDate = localStorage.getItem('expirationTime') || '0';

        if (storedToken) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

            const remainingTime = storedExpirationDate - String(new Date().getTime());
            if (remainingTime <= '1000') {  // 토큰 잔여만료시간이 1초 이하라면
                reissueToken();  // Access 토큰 만료시, 토큰 재발급 axios함수 호출.
            }
            else {
                navigate(`/main`);
            }
        }
    }, []);

    return (
        <div>
            <h2>로그인 방식 선택 페이지 (Login Page)</h2>

            <a href="http://localhost:8080/oauth2/authorization/kakao">Kakao Login</a><br></br>
            <a href="http://localhost:8080/oauth2/authorization/google">Google Login</a><br></br>
            <a href="http://localhost:8080/oauth2/authorization/naver">Naver Login</a><br></br>
            <a href="http://localhost:8080/oauth2/authorization/github">Github Login</a>
        </div>
    );
}

export default LoginPage;