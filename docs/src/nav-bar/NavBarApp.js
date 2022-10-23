import {Container, Nav, Navbar} from "react-bootstrap";
import TreeLogo from '../images/tree-logo.svg';


const NavBarApp = (props) => {

    const goToHomeTabHandler = () => {
        props.onChangeTab('tree');
    }

    const goToGuideTabHandler = () => {
        props.onChangeTab('guide');
    }

    const goToLoginTabHandler = () => {
        props.onChangeTab('login');
    }

    return(
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="#home" onClick={goToHomeTabHandler}>
                    <img
                        alt=""
                        src={TreeLogo}
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                    />{' '}
                    Arbre genealògic
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="#guide" onClick={goToGuideTabHandler}>Guia</Nav.Link>
                        {/*<NavDropdown title="Dropdown" id="basic-nav-dropdown">*/}
                        {/*    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>*/}
                        {/*    <NavDropdown.Item href="#action/3.2">*/}
                        {/*        Another action*/}
                        {/*    </NavDropdown.Item>*/}
                        {/*    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>*/}
                        {/*    <NavDropdown.Divider />*/}
                        {/*    <NavDropdown.Item href="#action/3.4">*/}
                        {/*        Separated link*/}
                        {/*    </NavDropdown.Item>*/}
                        {/*</NavDropdown>*/}
                    </Nav>
                    <Nav>
                        <Nav.Link href="#login" onClick={goToLoginTabHandler}>Entrar</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
export default NavBarApp;

// Docs
// https://react-bootstrap.github.io/components/navbar/
