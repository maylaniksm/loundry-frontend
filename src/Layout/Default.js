import Header from './Header';
import Navigation from './Navigation';
import { Outlet } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
const Default = ({ children }) => {
    return (
    <>
        <Header />
        <Container fluid>
            <Row>
                <Col xs={2} className="px-0" id=" px-0">
                    <Navigation/>
                </Col>
                <Col xs={10} id="sidebar-wrapper">
                    <Outlet />
                </Col>
            </Row>
            {/* <h1>Halo</h1> */}
        </Container>
    </>
    );
};
export default Default;