import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'

// 이 페이지에서는 로그인되어있어도 메인 페이지로 리다이렉트 안시켰음.
function FirstPage(props) {
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
                // navigate(`/main`);  // 이 페이지에서는 로그인되어있어도 메인 페이지로 리다이렉트 안시키기로 결정했기때문에 주석처리함.
            })
            .catch((error) => {
                localStorage.removeItem('token');
                localStorage.removeItem('expirationTime');
                localStorage.removeItem('refreshToken');
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
        }
    }, []);

    return (
        <div>
            <h2>첫 페이지 (First Page)</h2>

            <Link to={'/login'}>'로그인 방식 선택 페이지로 이동'</Link>
        </div>
    );
}

export default FirstPage;