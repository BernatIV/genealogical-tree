import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import {useState} from "react";

const CreateNodeModal = (props) => {
    const [newNode, setNewNode] = useState({
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
    const [enterDateManually, setEnterDateManually] = useState(false);

    const nameChangeHandler = (event) => {
        setNewNode(prevState => {
            return {...prevState, personName: event.target.value};
        });
    }

    const birthPlaceChangeHandler = (event) => {
        setNewNode(prevState => {
            return {...prevState, birthPlace: event.target.value};
        });
    }

    const jobChangeHandler = (event) => {
        setNewNode(prevState => {
            return {...prevState, job: event.target.value};
        });
    }

    const birthDateChangeHandler = (event) => {
        setNewNode(prevState => {
            return {...prevState, birthDate: event.target.value};
        });
    }

    const deathDateChangeHandler = (event) => {
        setNewNode(prevState => {
            return {...prevState, deathDate: event.target.value};
        });
    }

    const manualInputDateChangeHandler = (event) => {
        setNewNode(prevState => {
            return {...prevState, manualInputDate: event.target.value};
        });
    }

    const changeHowToInputDateHandler = (event) => {
        setEnterDateManually(event.target.checked);
    }

    const closeAddNodeModalHandler = () => {
        props.onCloseAddNodeModal();
    }

    const saveNewNodeHandler = () => {
        console.log(newNode);
        props.onSaveNewNode(newNode);
        props.onCloseAddNodeModal();
        setNewNode({
            personName: '',
            birthPlace: '',
            job: '',
            birthDate: '',
            deathDate: '',
            manualInputDate: ''
        });
    }

    return (
        <Modal show={props.showAddNodeModal} onHide={closeAddNodeModalHandler}>
            <Modal.Header closeButton>
                <Modal.Title>Afegeix node</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="newNodeForm.Name">
                        <Form.Label>Nom</Form.Label>
                        <Form.Control
                            type="text"
                            value={newNode.personName}
                            onChange={nameChangeHandler}
                            autoFocus
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="newNodeForm.Name">
                        <Form.Label>Lloc de naixement</Form.Label>
                        <Form.Control
                            type="text"
                            value={newNode.birthPlace}
                            onChange={birthPlaceChangeHandler}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="newNodeForm.Job">
                        <Form.Label>Ofici</Form.Label>
                        <Form.Control
                            type="text"
                            value={newNode.job}
                            onChange={jobChangeHandler}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="newNodeForm.Dates">
                        <Row>
                            {enterDateManually ?
                                <Col>
                                    <Form.Label>Dates (o la informació que es tingui)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={newNode.manualInputDate}
                                        onChange={manualInputDateChangeHandler}
                                    />
                                </Col>
                                :
                                <>
                                    <Col md>
                                        <Form.Label>Data de naixement</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={newNode.birthDate}
                                            onChange={birthDateChangeHandler}
                                        />
                                    </Col>
                                    <Col md>
                                        <Form.Label>Data de defunció</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={newNode.deathDate}
                                            onChange={deathDateChangeHandler}
                                        />
                                    </Col>
                                </>
                            }
                        </Row>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="newNodeForm.checkboxDates">
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
                <Button variant="secondary" onClick={closeAddNodeModalHandler}>
                    Tancar
                </Button>
                <Button variant="primary" onClick={saveNewNodeHandler}>
                    Guardar
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
export default CreateNodeModal;


/**
 * https://react-bootstrap.github.io/components/modal/
 */
