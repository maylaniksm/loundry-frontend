import React, { useContext } from 'react';
import Header from '../sections/Header';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../hooks/UserContext';

export default function Landing() {
    // const { user } = useContext(UserContext);
    //     if(user) {
    //         <Navigate to='/home'/> 
    //     }

    return(
        <div className="page">
            <Header/>
           <h3>This is the public landing page</h3> 
        </div>
    )
}