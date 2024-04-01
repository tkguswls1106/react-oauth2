import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'

function SignupPage(props) {
    const navigate = useNavigate();

    const [moreInfo1, setMoreInfo1] = useState("");
    const [moreInfo2, setMoreInfo2] = useState("");
    const [moreInfo3, setMoreInfo3] = useState("");

    const [accessToken, setAccessToken] = useState("");  // axios호출시 토큰재발급까지 할경우, 페이지 새로고침을 위해 작성해둠.

    const handleChangeMoreInfo1 = (event) => {
        setMoreInfo1(event.target.value);
    }
    const handleChangeMoreInfo2 = (event) => {
        setMoreInfo2(event.target.value);
    }
    const handleChangeMoreInfo3 = (event) => {
        setMoreInfo3(event.target.value);
    }

    const handleSignupClick = async (moreInfo1, moreInfo2, moreInfo3, e) => {  // 화살표함수로 선언하여 이벤트 사용시 바인딩되도록 함.
        // e.preventDefault();  // 리프레쉬 방지 (spa로서)

        await axios
            .post(process.env.REACT_APP_DB_HOST + '/oauth2/signup', {
                moreInfo1: moreInfo1,
                moreInfo2: moreInfo2,
                moreInfo3: moreInfo3
            })
            .then((response) => {
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.tokenDto.accessToken}`;
                localStorage.setItem('token', response.data.data.tokenDto.accessToken);
                localStorage.setItem('expirationTime', String(response.data.data.tokenDto.accessTokenExpiresIn));
                navigate(`/main`);
            })
            .catch((error) => {
                if (error.response.data.status == 401 &&
                    error.response.data.code == "TOKEN_EXPIRED" &&
                    error.response.data.message == "ERROR - JWT 토큰 만료 에러") {
                    reissueToken();  // Access 토큰 만료시, 토큰 재발급 axios함수 호출.
                }
                else {
                    navigate(`/login`);
                }
            })
    }

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
                setAccessToken(response.data.data.accessToken);
            })
            .catch((error) => {
                localStorage.removeItem('token');
                localStorage.removeItem('expirationTime');
                localStorage.removeItem('refreshToken');
                navigate(`/login`);
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
                setAccessToken(localStorage.getItem('token'));
            }
        }
        else {
            navigate('/login');
        }
    }, [accessToken]);  // axios호출시 토큰재발급까지 할경우, 페이지 새로고침을 위해 작성해둠.

    return (
        <div>
            <h2>회원가입 페이지 (Signup Page)</h2>

            - moreInfo1:&nbsp;&nbsp;<input type="text" onChange={handleChangeMoreInfo1} /><br></br>
            - moreInfo2:&nbsp;&nbsp;<input type="text" onChange={handleChangeMoreInfo2} /><br></br>
            - moreInfo3:&nbsp;&nbsp;<input type="text" onChange={handleChangeMoreInfo3} /><br></br>
            <button onClick={(event) => handleSignupClick(moreInfo1, moreInfo2, moreInfo3)}>회원가입 추가정보 제출</button>
        </div>
    );
}

export default SignupPage;