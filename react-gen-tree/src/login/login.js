import {
    MDBBtn,
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBInput,
    // MDBIcon,
    MDBRow,
    MDBCol,
}
    from 'mdb-react-ui-kit';
import './login.css';
import {useState} from "react";

const Login = () => {
    const [showLogin, setShowLogin] = useState(true);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [userInput, setUserInput] = useState({
        email: '',
        password: ''
    });
    const [repeatedPassword, setRepeatedPassword] = useState('');

    const onSwitchLoginSignUp = () => {
        setShowLogin(!showLogin);
        setButtonDisabled(true);
        setUserInput({
            email: '',
            password: ''
        });
    }

    const emailLoginChangeHandler = (event) => {
        setUserInput((prevState) => {
            return {...prevState, email: event.target.value}
        });

        if (event.target.value.length > 0 && userInput.password.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }

    const passwordLoginChangeHandler = (event) => {
        setUserInput((prevState) => {
            return {...prevState, password: event.target.value}
        });

        if (event.target.value.length > 0 && userInput.email.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }

    const emailSignUpChangeHandler = (event) => {
        setUserInput((prevState) => {
            return {...prevState, email: event.target.value}
        });

        if (event.target.value.length > 0 && userInput.password.length > 0 && repeatedPassword === userInput.password) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }

    const passwordSignUpChangeHandler = (event) => {
        const password = event.target.value;

        setUserInput((prevState) => {
            return {...prevState, password: password}
        });

        if (password.length > 0 && userInput.email.length > 0 && password === repeatedPassword) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }

    const repeatedPasswordChangeHandler = (event) => {
        setRepeatedPassword(event.target.value);

        if (event.target.value.length > 0 && userInput.email.length > 0 && userInput.password === event.target.value) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }

    return (
        <MDBContainer fluid className='my-5'>

            <MDBRow className='g-0 align-items-center'>
                <MDBCol md='2'></MDBCol>
                <MDBCol col='4'>

                    <MDBCard className='my-5 cascading-right'
                             style={{background: 'hsla(0, 0%, 100%, 0.55)', backdropFilter: 'blur(30px)'}}>
                        <MDBCardBody className='padding-card shadow-5 text-center'>

                            {showLogin ?
                                <>
                                    <h2 className="fw-bold mb-5">Log in</h2>

                                    <MDBInput wrapperClass='mb-4' label='Username or email' id='form3' type='email'
                                              value={userInput.email} onChange={emailLoginChangeHandler}/>
                                    <MDBInput wrapperClass='mb-4' label='Password' id='form4' type='password'
                                              value={userInput.password} onChange={passwordLoginChangeHandler}/>

                                    <MDBBtn className='w-100 mb-4' size='md' disabled={buttonDisabled}>login</MDBBtn>

                                    <div className='text-center'>
                                        <p className="small mb-5 pb-lg-3">
                                            <a className="text-muted mouse-pointer">Forgot password?</a>
                                        </p>
                                    </div>

                                    <p className='ms-5'>Don't have an account?&nbsp;
                                        <a onClick={onSwitchLoginSignUp} className="link-info mouse-pointer">
                                            Register here</a>
                                    </p>
                                </>

                                :

                                <>
                                    <h2 className="fw-bold mb-5">Sign up</h2>

                                    <MDBInput wrapperClass='mb-4' label='Email' id='form3' type='email'
                                              value={userInput.email} onChange={emailSignUpChangeHandler}/>
                                    <MDBInput wrapperClass='mb-4' label='Password' id='form5' type='password'
                                              value={userInput.password} onChange={passwordSignUpChangeHandler}/>
                                    <MDBInput wrapperClass='mb-4' label='Repeat password' type='password'
                                              value={repeatedPassword} onChange={repeatedPasswordChangeHandler}/>

                                    <MDBBtn className='w-100 mb-4' size='md' disabled={buttonDisabled}>sign up</MDBBtn>

                                    <div className='text-center'>
                                        <p className="small mb-5 pb-lg-3">
                                            <a className="text-muted" href="#">Forgot password?</a>
                                        </p>
                                    </div>

                                    <p className='ms-5'>Already have an account?&nbsp;
                                        <a onClick={onSwitchLoginSignUp} className="link-info mouse-pointer">Log in
                                            here</a>
                                    </p>
                                </>
                            }

                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>

                <MDBCol col='4' className="side-image">
                    <img src="https://pixahive.com/wp-content/uploads/2021/01/TREE-283119-pixahive.jpg"
                         className="w-100 rounded-4 shadow-4" alt="" fluid/>
                </MDBCol>

                <MDBCol md='2'></MDBCol>

            </MDBRow>

        </MDBContainer>
    );
}
export default Login;


// Sample:
// https://mdbootstrap.com/docs/react/extended/login-form/#section-registration-card-example


/*
    * 1. Show Login icons
        <div className="text-center">

            <p>or sign up with:</p>

            <MDBBtn tag='a' color='none' className='mx-3' style={{color: '#1266f1'}}>
                <MDBIcon fab icon='facebook-f' size="sm"/>
            </MDBBtn>

            <MDBBtn tag='a' color='none' className='mx-3' style={{color: '#1266f1'}}>
                <MDBIcon fab icon='twitter' size="sm"/>
            </MDBBtn>

            <MDBBtn tag='a' color='none' className='mx-3' style={{color: '#1266f1'}}>
                <MDBIcon fab icon='google' size="sm"/>
            </MDBBtn>

            <MDBBtn tag='a' color='none' className='mx-3' style={{color: '#1266f1'}}>
                <MDBIcon fab icon='github' size="sm"/>
            </MDBBtn>

        </div>
 */
