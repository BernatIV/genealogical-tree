import {Button, Card, Col, Container, Row} from "react-bootstrap";
import ReactFlow, {addEdge, applyEdgeChanges, applyNodeChanges, Background, Controls, MiniMap} from "reactflow";
import {forwardRef, useCallback, useEffect, useMemo, useState} from "react";
import parseNodes from "./tree-data/nodes";
import parseEdges from "./tree-data/edges";
import './Tree.css';
import CreateNodeModal from "./modalWindows/CreateNodeModal";
import ContextMenu from "./contextMenu/ContextMenu";
import {Snackbar} from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import PersonNode from "./customNodes/PersonNode";
import RelationNode from "./customNodes/RelationNode";

const ENDPOINT = 'https://arbregenalogic.com/'
// const ENDPOINT = 'http://ec2-13-37-107-32.eu-west-3.compute.amazonaws.com:8080/';
// const ENDPOINT = 'http://localhost:8080/';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Tree = (props) => {
    const [editable, setEditable] = useState(false);
    const [showAddNodeModal, setShowAddNodeModal] = useState(false);
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [contextMenu, setContextMenu] = useState(null);
    const [openSaveTreeSuccessSnackbar, setOpenSaveTreeSuccessSnackbar] = useState(false);
    const [openSaveNodeSuccessSnackbar, setOpenSaveNodeSuccessSnackbar] = useState(false);
    const [openNodeRemovedSuccessSnackbar, setOpenNodeRemovedSuccessSnackbar] = useState(false);
    const [openSavingErrorSnackbar, setOpenSavingErrorSnackbar] = useState(false);
    const [openRetrievingErrorSnackbar, setOpenRetrievingErrorSnackbar] = useState(false);
    const nodeTypes = useMemo(() => ({person: PersonNode, relation: RelationNode}), []);

    // *** USE EFFECT ***
    useEffect(() => {
        fetchNodesHandler();
        fetchEdgesHandler();

    }, []);

    const fetchNodesHandler = async () => {
        try {
            const response = await fetch(ENDPOINT + 'api/tree/nodes', {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Something went wrong');
            }

            const data = await response.json();
            const nodesDto = parseNodes(data);
            setNodes(nodesDto);
        } catch (e) {
            setOpenRetrievingErrorSnackbar(true);
        }
    }

    const fetchEdgesHandler = async () => {
        try {
            const response = await fetch(ENDPOINT + 'api/tree/edges', {
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Something went wrong');
            }

            const data = await response.json();
            const edgesDto = parseEdges(data);
            setEdges(edgesDto);
        } catch (e) {
            setOpenRetrievingErrorSnackbar(true);
        }

    }

    // *** HANDLERS ***
    const onNodesChange = useCallback((changes) => {
        if (changes[0]?.type === 'remove' &&
            changes[0].id.slice(-4) !== '_new') {
            deleteNode(changes[0].id);
        }
        return setNodes((nds) => applyNodeChanges(changes, nds));
    }, []);

    const deleteNode = async (nodeId) => {
        try {
            const response = await fetch(ENDPOINT + 'api/tree/node/' + nodeId, {
                credentials: 'include',
                method: 'DELETE'
            });

            if (response.ok) {
                setOpenNodeRemovedSuccessSnackbar(true);
            }
        } catch (e) {
            setOpenSavingErrorSnackbar(true);
        }
    }

    const onEdgesChange = useCallback((changes) => {
        if (changes[0].type === 'remove') {
            deleteEdges(changes);
        }
        return setEdges((eds) => applyEdgeChanges(changes, eds));
    }, []);

    const deleteEdges = async (changes) => {
        const edgesToDelete = fillEdgesWithIds(changes);

        if (edgesToDelete.length === 0) {
            return;
        }

        try {
            const response = await fetch(ENDPOINT + 'api/tree/deleteEdges', {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(edgesToDelete)
            });

            if (response.ok) {
                setOpenNodeRemovedSuccessSnackbar(true);
            }
        } catch (e) {
            setOpenSavingErrorSnackbar(true);
        }
    }

    const fillEdgesWithIds = (changes) => {
        let edgesToDelete = [];

        changes.forEach(change => {
            if (change.id.slice(-4) !== '_new' &&
                change.id.slice(0, 10) !== 'reactflow_') {
                edgesToDelete = [...edgesToDelete, {
                    id: change.id
                }];
            }
        });

        return edgesToDelete;
    }

    const connectChildParentHandler = useCallback(
        (connection) => setEdges((eds) => addEdge(connection, eds)),
        [setEdges]
    );

    const connectHandler = (params) => {
        const parentChildRelation = params.sourceHandle === 'b';

        if (parentChildRelation) {
            connectChildParentHandler(params)
            return;
        }

        console.log(params);
        const newNodeId = (Math.random() * 1000000).toString() + '_new';

        const sourceNode = params.source;
        const targetMiddleNode = newNodeId;
        const sourceMiddleNode = newNodeId;
        const targetNode = params.target;

        const sourceHandle = params.sourceHandle;
        const targetHandle = params.targetHandle;
        let targetMiddleNodeHandle = '';
        let sourceMiddleNodeHandle = '';

        if (sourceHandle === 'c') {
            targetMiddleNodeHandle = 'a';
        } else if (sourceHandle === 'a') {
            targetMiddleNodeHandle = 'c';
        }

        if (targetHandle === 'a') {
            sourceMiddleNodeHandle = 'c';
        } else if (targetHandle === 'c') {
            sourceMiddleNodeHandle = 'a';
        }

        addNodeBetweenCouple(sourceNode, targetNode, newNodeId);
        connectFirstPartEdge(sourceNode, sourceHandle, targetMiddleNode, targetMiddleNodeHandle);
        connectSecondPartEdge(sourceMiddleNode, sourceMiddleNodeHandle, targetNode, targetHandle);
    }

    const connectFirstPartEdge = useCallback((sourceNode, sourceHandle, targetMiddleNode, targetMiddleNodeHandle) =>
            setEdges(prevState => {
                return [...prevState, {
                    id: (Math.random() * 1000000).toString() + '_new',
                    source: sourceNode,
                    sourceHandle: sourceHandle,
                    target: targetMiddleNode,
                    targetHandle: targetMiddleNodeHandle
                }];
            }),
        []);

    const connectSecondPartEdge = useCallback((sourceMiddleNode, sourceMiddleNodeHandle, targetNode, targetHandle) =>
            setEdges(prevState => {
                return [...prevState, {
                    id: (Math.random() * 1000000).toString() + '_new',
                    source: sourceMiddleNode,
                    sourceHandle: sourceMiddleNodeHandle,
                    target: targetNode,
                    targetHandle: targetHandle
                }];
            }),
        []);

    const changeEditModeHandler = () => {
        setEditable(!editable);
    }

    const saveNodesHandler = async () => {
        const nodesJavaObj = fillNodesDto();
        const edgesJavaObj = fillEdgesDto();

        try {
            const nodesResponse = await fetch(ENDPOINT + 'api/tree/updateNodes', {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nodesJavaObj)
            });

            if (!nodesResponse.ok) {
                throw new Error('Something went wrong!');
            }

            const data = await nodesResponse.json();
            const nodesDto = parseNodes(data);
            setNodes(nodesDto);

            const edgesResponse = await fetch(ENDPOINT + 'api/tree/saveEdges', {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(edgesJavaObj)
            });

            if (!edgesResponse.ok) {
                throw new Error('Something went wrong!');
            }

            const edgesData = await edgesResponse.json();
            const edgesDto = parseEdges(edgesData);
            setEdges(edgesDto);

            setEditable(false);
            setOpenSaveTreeSuccessSnackbar(true);
        } catch (e) {
            setOpenSavingErrorSnackbar(true);
        }
    }

    const fillNodesDto = () => {
        let nodesDto = [];

        for (const node of nodes) {
            if (node.type === 'person') {
                nodesDto = [...nodesDto, {
                    id: node.id,
                    nodeType: node.type,
                    personName: node.data.label.props.children[0].props.children,
                    job: '',
                    birthPlace: node.data.label.props.children[1].props.children,
                    positionX: node.position.x,
                    positionY: node.position.y
                }];
            } else if (node.type === 'relation') {
                if (node.id.slice(-4) === '_new') {
                    nodesDto = [...nodesDto, {
                        id: null,
                        temporaryId: node.id,
                        nodeType: node.type,
                        positionX: node.position.x,
                        positionY: node.position.y
                    }];
                } else {
                    nodesDto = [...nodesDto, {
                        id: node.id,
                        nodeType: node.type,
                        positionX: node.position.x,
                        positionY: node.position.y
                    }];
                }

            }
        }
        return nodesDto;
    }

    const fillEdgesDto = () => {
        let edgesDto = [];


        for (const edge of edges) {
            edgesDto = [...edgesDto, {
                id: getEdgeIdOrNull(edge),
                source: edge.source,
                sourceHandle: edge.sourceHandle,
                target: edge.target,
                targetHandle: edge.targetHandle
            }];
        }

        return edgesDto;
    }

    const getEdgeIdOrNull = (edge) => {
        if (edge.id.slice(-4) === '_new' || edge.id.slice(0, 10) === 'reactflow_') {
            return null;
        }
        return edge.id;
    }

    const addNodeHandler = () => {
        setShowAddNodeModal(true);
    }

    const addNodeBetweenCouple = (sourceNodeId, targetNodeId, nodeId) => {
        const sourceNode = nodes.find(node => node.id === sourceNodeId);
        const targetNode = nodes.find(node => node.id === targetNodeId);
        console.log(sourceNode);

        const averagePosition = calculateAveragePosition(sourceNode.position, targetNode.position);
        console.log(averagePosition);

        setNodes(prevState => {
            return [...prevState, {
                id: nodeId,
                type: 'relation',
                data: {
                    label: <div style={{fontSize: 7}}>&nbsp;</div>
                },
                position: averagePosition,
            }];
        });
    }

    const calculateAveragePosition = (sourceNodePosition, targetNodePosition) => {
        const aproxWidth = 105;
        const aproxHeight = 50;
        const averageX = (sourceNodePosition.x + aproxWidth + targetNodePosition.x) / 2;
        const averageY = (sourceNodePosition.y + aproxHeight + targetNodePosition.y) / 2;

        return {x: averageX, y: averageY};
    }

    const addNewNodeHandler = async (newNode) => {
        props.onChangeLoadingState(true);

        const newNodeResponse = await saveNewNode(newNode);
        const dateContent = fillDateField(newNodeResponse);

        setNodes(prevState => {
            return [...prevState, {
                id: newNodeResponse.id.toString(),
                type: 'person',
                data: {
                    label:
                        <div>
                            <div>{newNodeResponse.personName.trim()}</div>
                            <div style={{fontSize: 8}}>{newNodeResponse.birthPlace.trim()}</div>
                            <div style={{fontSize: 8}}>{newNodeResponse.job.trim()}</div>
                            {dateContent}
                        </div>
                },
                position: {
                    x: newNodeResponse.positionX,
                    y: newNodeResponse.positionY
                },
                isEditable: editable
            }];
        });
        props.onChangeLoadingState(false);
    }

    const fillDateField = (newNode) => {
        let dateContent;
        const birthDate = new Date(newNode.birthDate);
        const deathDate = new Date(newNode.deathDate);

        if ((newNode.birthDate !== '' && newNode.birthDate !== null) &&
            (newNode.deathDate === '' || newNode.deathDate === null)) {

            dateContent = <div style={{fontSize: 8}}>Data de naixement: {birthDate.toLocaleDateString("es-ES")}</div>;
        }

        if ((newNode.birthDate === '' || newNode.birthDate === null) &&
            (newNode.deathDate !== '' && newNode.deathDate !== null)) {
            dateContent = <div style={{fontSize: 8}}>Data de mort: {deathDate.toLocaleDateString("es-ES")}</div>;
        }

        if (newNode.birthDate !== '' && newNode.birthDate !== null &&
            newNode.deathDate !== '' && newNode.deathDate !== null) {
            dateContent =
                <div style={{fontSize: 8}}>
                    ({birthDate.toLocaleDateString("es-ES")}) - ({deathDate.toLocaleDateString("es-ES")})
                </div>;
        }

        if (newNode.manualInputDate.trim() !== '') {
            dateContent = <div style={{fontSize: 8}}>({newNode.manualInputDate.trim()})</div>;
        }
        return dateContent
    }

    const saveNewNode = async (newNode) => {
        try {
            const response = await fetch(ENDPOINT + 'api/tree/addNode', {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newNode)
            });

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const newNodeResponse = await response.json();
            setOpenSaveNodeSuccessSnackbar(true);
            return newNodeResponse;
        } catch (e) {
            setOpenSavingErrorSnackbar(true);
            throw new Error(e.message);
        }
    }

    const closeAddNodeModalHandler = () => setShowAddNodeModal(false);

    const contextMenuHandler = (event) => {
        event.preventDefault();
        setContextMenu(
            contextMenu === null
                ? {
                    mouseX: event.clientX + 2,
                    mouseY: event.clientY - 6,
                }
                : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
                  // Other native context menus might behave different.
                  // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
                null,
        );
    }

    const closeContextMenuHandler = () => {
        setContextMenu(null);
    }

    const closeTreeSuccessSnackbarHandler = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSaveTreeSuccessSnackbar(false);
    }

    const closeNodeSuccessSnackbarHandler = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSaveNodeSuccessSnackbar(false);
    }

    const closeNodeRemovedSuccessSnackbarHandler = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenNodeRemovedSuccessSnackbar(false);
    }

    const closeSavingErrorSnackbarHandler = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSavingErrorSnackbar(false);
    }

    const closeRetrievingErrorSnackbarHandler = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenRetrievingErrorSnackbar(false);
    }

    // Primer has de seleccionar el node que vols amb clic esquerre, i després pots eliminar amb clic dret
    // Fer que no calgui clic esquerra
    const removeSelectedNodeHandler = () => {
        // has d'estar en mode editable perq pugui funcionar veure quin esta seleccionat
        for (const node of nodes) {
            if (node.selected === true) {
                // borrar el node
                break;
            }
        }
    }

    return (
        <>
            <Container>
                <div style={{marginTop: '1rem'}}/>
                <Row>
                    {!editable &&
                        <div style={{margin: 'auto', textAlign: 'center'}}>
                            <Button variant="primary"
                                    onClick={changeEditModeHandler}>
                                Editar
                            </Button>
                        </div>}
                    <Col md>
                        {editable &&
                            <Button variant="outline-secondary"
                                    onClick={changeEditModeHandler}>
                                Tanca mode edició
                            </Button>}
                        {editable &&
                            <Button variant="secondary"
                                    style={{marginLeft: '1rem'}}
                                    onClick={addNodeHandler}>
                                Afegir persona
                            </Button>}
                        {/*Animació d'aquest botó: que aparegui cap a la dreta. Icona +*/}
                    </Col>
                    <Col md style={{textAlign: 'right'}}>
                        {editable &&
                            <Button variant="primary" onClick={saveNodesHandler}>
                                Guardar canvis
                            </Button>
                        }
                    </Col>
                </Row>

                <div style={{marginTop: '1rem'}}/>

                <Card className="tree-size card-shadow"
                      onContextMenu={contextMenuHandler}>
                    <ReactFlow
                        style={{background: props.backgroundColor}} // Possibles colors: 696851, CDE8BE
                        nodes={nodes}
                        onNodesChange={editable ? onNodesChange : null}
                        edges={edges}
                        onEdgesChange={editable ? onEdgesChange : null}
                        onConnect={editable ? connectHandler : null}
                        nodeTypes={nodeTypes}
                        fitView
                    >
                        {editable && <Background/>}
                        <Controls showInteractive={false}/>
                        <MiniMap/>
                    </ReactFlow>
                    <ContextMenu
                        contextMenuProp={contextMenu}
                        onOpenContextMenu={contextMenuHandler}
                        onCloseContextMenu={closeContextMenuHandler}
                        onRemoveSelectedNode={removeSelectedNodeHandler}/>
                </Card>
            </Container>
            <Snackbar
                open={openSaveTreeSuccessSnackbar}
                onClose={closeTreeSuccessSnackbarHandler}
                autoHideDuration={6000}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert onClose={closeTreeSuccessSnackbarHandler} severity="success" sx={{width: '100%'}}>
                    L'arbre s'ha guardat!
                </Alert>
            </Snackbar>
            <Snackbar
                open={openSaveNodeSuccessSnackbar}
                onClose={closeNodeSuccessSnackbarHandler}
                autoHideDuration={6000}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert onClose={closeNodeSuccessSnackbarHandler} severity="success" sx={{width: '100%'}}>
                    La persona s'ha guardat
                </Alert>
            </Snackbar>
            <Snackbar
                open={openNodeRemovedSuccessSnackbar}
                onClose={closeNodeRemovedSuccessSnackbarHandler}
                autoHideDuration={6000}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert onClose={closeNodeRemovedSuccessSnackbarHandler} severity="success" sx={{width: '100%'}}>
                    L'element s'ha esborrat
                </Alert>
            </Snackbar>
            <Snackbar
                open={openSavingErrorSnackbar}
                onClose={closeSavingErrorSnackbarHandler}
                autoHideDuration={6000}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert onClose={closeSavingErrorSnackbarHandler} severity="error" sx={{width: '100%'}}>
                    Hi ha hagut un error guardant el canvi :/
                </Alert>
            </Snackbar>
            <Snackbar
                open={openRetrievingErrorSnackbar}
                onClose={closeRetrievingErrorSnackbarHandler}
                autoHideDuration={6000}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert onClose={closeRetrievingErrorSnackbarHandler} severity="error" sx={{width: '100%'}}>
                    No es poden recuperar les dades ara mateix
                </Alert>
            </Snackbar>
            <CreateNodeModal showAddNodeModal={showAddNodeModal}
                             onCloseAddNodeModal={closeAddNodeModalHandler}
                             onSaveNewNode={addNewNodeHandler}
            />
        </>
    );
}

export default Tree;

/**
 * https://reactflow.dev/
 *
 * Snackbar / toast
 * https://mui.com/material-ui/react-snackbar/
 */
