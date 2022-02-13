import React, { useContext } from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';
import { UserContext } from './../hooks/UserContext';
import Loading from './../components/Loading'; 


export default function PrivateRoute(props) {   
    const { user, isLoading } = useContext(UserContext); 
    console.log(user, isLoading);

    const { component: Component,
        ...rest } = props;

      if(isLoading) {
          return <Loading/>
        }

      return user ? <Outlet/>:<Navigate to='/login'/>

}




