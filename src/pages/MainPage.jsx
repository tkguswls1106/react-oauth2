import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'

function MainPage(props) {
    const navigate = useNavigate();

    const [user, setUser] = useState();
    const [id, setId] = useState(0);  // 사실 이런거 {user.id} 이렇게 빼서 쓰면 되긴하다.
    const [email, setEmail] = useState("");
    const [nickname, setNickname] = useState("");
    const [socialType, setSocialType] = useState("");
    const [moreInfo1, setMoreInfo1] = useState("");
    const [moreInfo2, setMoreInfo2] = useState("");
    const [moreInfo3, setMoreInfo3] = useState("");

    const [accessToken, setAccessToken] = useState("");  // axios호출시 토큰재발급까지 할경우, 페이지 새로고침을 위해 작성해둠.

    async function getUser() {  // 사용자 회원정보 조회
        await axios
            .get(`${process.env.REACT_APP_DB_HOST}/test`)
            .then((response) => {
                setUser(response.data.data);
                setId(Number(response.data.data.id));
                setEmail(response.data.data.email);
                setNickname(response.data.data.nickname);
                setSocialType(response.data.data.socialType);
                setMoreInfo1(response.data.data.moreInfo1);
                setMoreInfo2(response.data.data.moreInfo2);
                setMoreInfo3(response.data.data.moreInfo3);
                //console.log(response);
            })
            .catch((error) => {
                if (error.response.data.status == 401 &&
                    error.response.data.code == "TOKEN_EXPIRED" &&
                    error.response.data.message == "ERROR - JWT 토큰 만료 에러") {
                    reissueToken();  // Access 토큰 만료시, 토큰 재발급 axios함수 호출.
                }
                else {
                    navigate('/login');
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

        getUser();
    }, [accessToken]);  // axios호출시 토큰재발급까지 할경우, 페이지 새로고침을 위해 작성해둠.

    return (
        <div>
            <h2>메인 페이지 (Main Page)</h2>

            - userId:&nbsp;&nbsp;{user && id}<br></br>
            - email:&nbsp;&nbsp;{user && email}<br></br>
            - nickname:&nbsp;&nbsp;{user && nickname}<br></br>
            - socialType:&nbsp;&nbsp;{user && socialType}<br></br>
            - moreInfo1:&nbsp;&nbsp;{user && moreInfo1}<br></br>
            - moreInfo2:&nbsp;&nbsp;{user && moreInfo2}<br></br>
            - moreInfo3:&nbsp;&nbsp;{user && moreInfo3}
        </div>
    );
}

export default MainPage;