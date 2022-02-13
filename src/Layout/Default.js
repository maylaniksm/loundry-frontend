import React from 'react';
import Header from './Header';
import Navigation from './Navigation';
import { Outlet } from 'react-router-dom';
const Default = ({ children }) => {
    return (
    <React.Fragment>
        <Header />
        <div className="navigationWrapper">
            {/* <h1>Halo</h1> */}
            <Navigation />
            <Outlet />
        </div>
    </React.Fragment>
    );
};
export default Default;