import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function useLogout() {
    let useNavigate = useNavigate();

    const logoutUser = async () => {
        try {
           await axios({
                method: 'GET',
                url: `auth/logout`,
            }).then(res => { 
                console.log(res); 
                useNavigate.push('/');
            })
        } catch(err) {
            console.log(err);
        } 
    }

    return {
        logoutUser
    }

}