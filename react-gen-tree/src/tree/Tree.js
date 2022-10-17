import {Button, Card, Col, Container, Row} from "react-bootstrap";
import ReactFlow, {addEdge, applyEdgeChanges, applyNodeChanges, Background, Controls, MiniMap} from "reactflow";
import {forwardRef, useCallback, useEffect, useMemo, useState} from "react";
import initialNodes from "./tree-data/nodes";
import initialEdges from "./tree-data/edges";
import './Tree.css';
import CreateNodeModal from "./modalWindows/CreateNodeModal";
import ContextMenu from "./contextMenu/ContextMenu";
import {Snackbar} from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import PersonNode from "./customNodes/PersonNode";
import RelationNode from "./customNodes/RelationNode";

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
    const nodeTypes = useMemo(() => ({person: PersonNode, relation: RelationNode}), []);

    // *** USE EFFECT ***
    useEffect(() => {
        console.log('useEffect');
        fetchNodesHandler();
        fetchEdgesHandler();

    }, []);

    const fetchNodesHandler = async () => {
        const response = await fetch('http://localhost:8080/api/tree/nodes');
        if (!response.ok) {
            throw new Error('Something went wrong');
        }

        const data = await response.json();
        const nodesDto = initialNodes(data);
        setNodes(nodesDto);
    }

    const fetchEdgesHandler = async () => {
        const response = await fetch('http://localhost:8080/api/tree/edges');
        if (!response.ok) {
            throw new Error('Something went wrong');
        }

        const data = await response.json();
        const edgesDto = initialEdges(data);
        setEdges(edgesDto);
    }

    // *** HANDLERS ***
    const onNodesChange = useCallback((changes) =>
            setNodes((nds) =>
                applyNodeChanges(changes, nds)),
        []);

    const onEdgesChange = useCallback((changes) =>
            setEdges((eds) =>
                applyEdgeChanges(changes, eds)),
        []);

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
        console.log('nodes');
        console.log(nodes);
        console.log('edges');
        console.log(edges);
    }

    const saveNodesHandler = async () => {
        console.log(nodes);
        const nodesDto = fillNodesDto();
        const edgesDto = fillEdgesDto();

        const nodesResponse = await fetch('http://localhost:8080/api/tree/updateNodes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nodesDto)
        });

        if (!nodesResponse.ok) {
            console.log('something went wrong');
            return;
        }

        const edgesResponse = await fetch('http://localhost:8080/api/tree/saveEdges', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(edgesDto)
        });

        if (!edgesResponse.ok) {
            console.log('something went wrong');
            return;
        }

        // fetchNodesHandler(); // TODO fix: No es crida :( es per solucionar que quan es guardi un node relation se li posi l'id que la DB ha assignat.
        // fetchEdgesHandler(); // TODO fix: No es crida :(

        setEditable(false);
        setOpenSaveTreeSuccessSnackbar(true);
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
                console.log('slice');
                console.log(node.id.slice(-4));
                nodesDto = [...nodesDto, {
                    id: node.id.slice(-4) === '_new' ? null : node.id,
                    nodeType: node.type,
                    positionX: node.position.x,
                    positionY: node.position.y
                }];
            }
        }
        return nodesDto;
    }

    const fillEdgesDto = () => {
        let edgesDto = [];

        for (const edge of edges) {
            edgesDto = [...edgesDto, {
                id: edge.id.slice(-4) === '_new' ? null : edge.id, // TODO: les relacions pares-fill també tenen id que comencen per reactflow_
                source: edge.source,            // FIXME: Quan s'envien els ids dels nodes alguns encara tenen la id provisional
                sourceHandle: edge.sourceHandle,
                target: edge.target,            // FIXME: Quan s'envien els ids dels nodes alguns encara tenen la id provisional
                targetHandle: edge.targetHandle
            }];
        }

        return edgesDto;
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
            const response = await fetch('http://localhost:8080/api/tree/addNode', {
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

            console.log(newNodeResponse);
            setOpenSaveNodeSuccessSnackbar(true);

            return newNodeResponse;
        } catch (e) {
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

    // Primer has de seleccionar el node que vols amb clic esquerre, i després pots eliminar amb clic dret
    // TODO: Fer que no calgui clic esquerra
    const removeSelectedNodeHandler = () => {
        // has d'estar en mode editable perq pugui funcionar veure quin esta seleccionat
        for (const node of nodes) {
            if (node.selected === true) {
                // TODO borrar el node
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
                        // style={{background: '#696851'}} // Possibles colors: 696851, CDE8BE
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
                <Alert onClose={closeTreeSuccessSnackbarHandler} severity="success" sx={{width: '100%'}}>
                    La persona s'ha guardat
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
