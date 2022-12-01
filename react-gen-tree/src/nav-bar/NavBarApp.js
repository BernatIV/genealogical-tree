import {Container, Nav, Navbar} from "react-bootstrap";
import TreeLogoLight from '../images/tree-logo-light.svg';
import TreeLogoDark from '../images/tree-logo-dark.svg';
import {DarkModeSwitch} from "react-toggle-dark-mode";
import {useState} from "react";
import './NavBarApp.css'
import {Tooltip} from "@mui/material";


const NavBarApp = (props) => {
    const [bgTheme, setBgTheme] = useState('light');
    const [darkModeTooltipText, setDarkModeTooltipText] = useState('Activa mode fosc'); // Enable Dark Mode

    const toggleDarkMode = (checked) => {
        props.onToggleDarkMode(checked);

        if (checked) {
            setBgTheme('light');
            setDarkModeTooltipText('Activa mode fosc');  // Enable Dark Mode
        } else {
            setBgTheme('dark');
            setDarkModeTooltipText('Desactiva mode fosc');  // Disable Dark Mode
        }
    };

    const goToHomeTabHandler = () => {
        props.onChangeTab('tree');
    }

    const goToGuideTabHandler = () => {
        props.onChangeTab('guide');
    }

    const goToLoginTabHandler = () => {
        props.onChangeTab('login');
    }

    return (
        <Navbar bg={bgTheme} variant={bgTheme} expand="lg">
            <Container>
                <Navbar.Brand
                    className="dark-background"
                    href="#home"
                    onClick={goToHomeTabHandler}>
                    <img
                        alt=""
                        src={props.darkMode ? TreeLogoLight : TreeLogoDark}
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                    />{' '}
                    Arbre genealògic
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Tooltip title="Explicació">
                            <Nav.Link href="#guide"
                                      className="dark-background"
                                      onClick={goToGuideTabHandler}>Guia</Nav.Link>
                        </Tooltip>
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
                        <Tooltip title={darkModeTooltipText} arrow>
                            <div>
                                <DarkModeSwitch
                                    className="dark-background"
                                    style={{marginRight: '1rem'}}
                                    checked={props.darkMode}
                                    onChange={toggleDarkMode}
                                    size={30}
                                    moonColor={'#4f4f4f'}
                                    sunColor={'#f2f2f2'}
                                />
                            </div>
                        </Tooltip>

                        <Tooltip title="Accedir com a usuari" arrow>
                            <Nav.Link
                                className="dark-background"
                                href="#login"
                                onClick={goToLoginTabHandler}
                            >Entrar</Nav.Link>
                        </Tooltip>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
export default NavBarApp;

// Docs
// https://react-bootstrap.github.io/components/navbar/

// https://mui.com/material-ui/react-tooltip/
