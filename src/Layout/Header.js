import { Nav, NavDropdown, Navbar, Container } from "react-bootstrap";
import { UserContext } from "../hooks/UserContext";
import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
const Header = () => {
  const [UserData, setUser] = useState({
    nama: "",
  });
  const { user, isLoading } = useContext(UserContext);
  const [redirect, setRedirect] = useState(<></>);

  useEffect(() => {
    if (!isLoading) {
      setUser(user);
    }
  }, [isLoading, user]);

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      {redirect}
      <Container fluid className="mx-0">
        <Navbar.Brand href="#home">
        <img
          alt=""
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png"
          width="30"
          height="30"
          className="d-inline-block align-top"
        />{' '}
          Laundry Apps
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-flex flex-row-reverse">
            <Nav.Link href="#home">{UserData.nama}</Nav.Link>
            <Nav.Link
              onClick={() => {
                localStorage.removeItem("token");
                setRedirect(<Navigate to="/login"></Navigate>);
              }}
              href="#logout"
            >
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
export default Header;
