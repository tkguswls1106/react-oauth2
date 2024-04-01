import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from 'axios'

function LoginWaitPage(props) {
    const navigate = useNavigate();

    // useLocation으로 URL 정보 가져오기
    const location = useLocation();

    // 쿼리 파라미터를 파싱하는 함수
    const searchParams = new URLSearchParams(location.search);

    useEffect(() => {
        // URLSearchParams를 사용하여 쿼리 파라미터 값 읽기
        const accessTokenParam = searchParams.get('accessToken');
        const accessTokenExpiresInParam = searchParams.get('accessTokenExpiresIn');
        const refreshTokenParam = searchParams.get('refreshToken');
        const isNewUserParam = searchParams.get('isNewUser');

        localStorage.setItem('token', accessTokenParam);
        localStorage.setItem('expirationTime', accessTokenExpiresInParam);
        localStorage.setItem('refreshToken', refreshTokenParam);

        if(isNewUserParam == 'false') {
            navigate(`/main`);
        }
        else {  // (isNewUserParam == 'true')
            navigate(`/signup`);
        }
    }, [location]);  // location이 변경될 때마다 이 useEffect()를 실행

    return (
        <div>
            <h2>로그인 대기 페이지 (Login Wait Page)</h2>

            {/* 로직 */}
        </div>
    );
}

export default LoginWaitPage;