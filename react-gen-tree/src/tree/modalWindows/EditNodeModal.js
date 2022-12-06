import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import {parseStringDDMMYYYToDate} from "../tree-utils/NodeUtils";

const EditNodeModal = (props) => {

    const [enterDateManually, setEnterDateManually] = useState(false);
    const [node, setNode] = useState({
        id: '',
        personName: '',
        job: '',
        birthPlace: '',
        deathPlace: '',
        birthDate: '',
        deathDate: '',
        manualInputDate: '',
        nodeType: 'person',
        positionX: 0,
        positionY: 0
    });

    // We pass the node data to the modal window once the user selects the node
    useEffect(() => {
        if (props.showEditNodeModal) {
            loadNodeData();
        }
    }, [props.showEditNodeModal]);

    const loadNodeData = () => {
        setNode((prevState) => {
            return {
                ...prevState,
                id: props.node.id,
                personName: props.node?.data.label.props.children[0].props?.children,
                birthPlace: props.node.data.label.props.children[1].props?.children,
                job: props.node?.data.label.props.children[2].props?.children,
                birthDate: '',
                deathDate: '',
                positionX: props.node.position.x,
                positionY: props.node.position.y,
            }
        });

        if (props.node.data.label.props.children[3]?.props.children.length >= 3) {
            setNode(prevState => {
                return {
                    ...prevState,
                    birthDate: getTimeForDateInput(props.node?.data.label.props.children[3].props?.children[1]),
                    deathDate: getTimeForDateInput(props.node?.data.label.props.children[3].props?.children[3])
                };
            });
        }

        if (props.node.data.label.props.children[3]?.props.children[0] === 'Data de naixement: ') { // TODO quan afegeixi traduccions això no funcionarà :/
            setNode(prevState => {
                return {
                    ...prevState,
                    birthDate: getTimeForDateInput(props.node?.data.label.props.children[3].props?.children[1])
                };
            });
        }

        if (props.node.data.label.props.children[3]?.props.children[0] === 'Data de mort: ') { // TODO quan afegeixi traduccions això no funcionarà :/
            setNode(prevState => {
                return {
                    ...prevState,
                    deathDate: getTimeForDateInput(props.node?.data.label.props.children[3].props?.children[1])
                }
            });
        }
    }

    const getTimeForDateInput = (localeFormattedDate) => {
        let date = parseStringDDMMYYYToDate(localeFormattedDate);
        const offset = date.getTimezoneOffset(); // To handle time zone offset
        date = new Date(date.getTime() - (offset*60*1000));
        return date.toISOString().split('T')[0];
    }

    const nameChangeHandler = (event) => {
        setNode(prevState => {
            return {...prevState, personName: event.target.value};
        });
    }

    const birthPlaceChangeHandler = (event) => {
        setNode(prevState => {
            return {...prevState, birthPlace: event.target.value};
        });
    }

    const jobChangeHandler = (event) => {
        setNode(prevState => {
            return {...prevState, job: event.target.value};
        });
    }

    const birthDateChangeHandler = (event) => {
        setNode(prevState => {
            return {...prevState, birthDate: event.target.value};
        });
    }

    const deathDateChangeHandler = (event) => {
        setNode(prevState => {
            return {...prevState, deathDate: event.target.value};
        });
    }

    const manualInputDateChangeHandler = (event) => {
        setNode(prevState => {
            return {...prevState, manualInputDate: event.target.value};
        });
    }

    const changeHowToInputDateHandler = (event) => {
        setEnterDateManually(event.target.checked);
    }

    const closeEditNodeModalHandler = () => {
        props.onCloseEditNodeModal();
    }

    const saveNodeHandler = () => {
        props.onSaveNode(node);
        closeEditNodeModalHandler();
        setNode({
            personName: '',
            birthPlace: '',
            job: '',
            birthDate: '',
            deathDate: '',
            manualInputDate: ''
        });
    }

    const handleKeypress = e => {
        //it triggers by pressing the enter key
        if (e.keyCode === 13) {
            saveNodeHandler();
        }
    };

    return (
        <Modal show={props.showEditNodeModal} onHide={closeEditNodeModalHandler} onKeyDown={handleKeypress}>
            <Modal.Header closeButton>
                <Modal.Title>Editar node</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="updateNodeForm.Name">
                        <Form.Label>Nom</Form.Label>
                        <Form.Control
                            type="text"
                            value={node.personName}
                            onChange={nameChangeHandler}
                            autoFocus
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="updateNodeForm.Name">
                        <Form.Label>Lloc de naixement</Form.Label>
                        <Form.Control
                            type="text"
                            value={node.birthPlace}
                            onChange={birthPlaceChangeHandler}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="updateNodeForm.Name">
                        <Form.Label>Ofici</Form.Label>
                        <Form.Control
                            type="text"
                            value={node.job}
                            onChange={jobChangeHandler}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="updateNodeForm.Name">
                        <Row>
                            {enterDateManually ?
                                <Col>
                                    <Form.Label>Dates (o la informació que es tingui)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={node.manualInputDate}
                                        onChange={manualInputDateChangeHandler}
                                    />
                                </Col>
                                :
                                <>
                                    <Col md>
                                        <Form.Label>Data de naixement</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={node.birthDate}
                                            onChange={birthDateChangeHandler}
                                        />
                                    </Col>
                                    <Col md>
                                        <Form.Label>Data de defunció</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={node.deathDate}
                                            onChange={deathDateChangeHandler}
                                        />
                                    </Col>
                                </>
                            }
                        </Row>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="updateNodeForm.checkboxDates">
                        <Row>
                            <Col>
                                <Form.Check
                                    label="Escriu la data manualment"
                                    onChange={changeHowToInputDateHandler}
                                />
                            </Col>
                        </Row>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeEditNodeModalHandler}>
                    Tancar
                </Button>
                <Button variant="primary" onClick={saveNodeHandler}>
                    Guardar
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
export default EditNodeModal;


/**
 * https://react-bootstrap.github.io/components/modal/
 */
