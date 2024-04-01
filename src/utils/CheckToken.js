import axios from 'axios'

// !!! 아직 미사용 상태 !!! (단지 테스트 용도이기에, 로컬 스토리지에 토큰값이 있는지 없는지만으로 로그인 여부를 판단하는것으로 결정했기 때문임.)

function CheckToken() {
    //const navigateLogin = useNavigate();

    const storedToken = localStorage.getItem('token');
    const storedExpirationDate = localStorage.getItem('expirationTime') || '0';

    if (storedToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

        const remainingTime = storedExpirationDate - String(new Date().getTime());
        if (remainingTime <= '1000') {
            localStorage.removeItem('token');
            localStorage.removeItem('expirationTime');

            window.location.href = '/login';
        }
    }
    else {
        window.location.href = '/login';
    }
}

export { CheckToken };