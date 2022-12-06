import {Button, Card, Col, Container, Row} from "react-bootstrap";
import ReactFlow, {addEdge, applyEdgeChanges, applyNodeChanges, Background, Controls, MiniMap} from "reactflow";
import {forwardRef, useCallback, useEffect, useMemo, useState} from "react";
import formatNodes from "./tree-data/nodes";
import parseEdges from "./tree-data/edges";
import './Tree.css';
import CreateNodeModal from "./modalWindows/CreateNodeModal";
import EditNodeModal from "./modalWindows/EditNodeModal";
import ContextMenu from "./contextMenu/ContextMenu";
import {Snackbar} from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import PersonNode from "./customNodes/PersonNode";
import RelationNode from "./customNodes/RelationNode";
import {fillDateField, parseStringDDMMYYYToDate} from "./tree-utils/NodeUtils";

const ENDPOINT = 'https://arbregenalogic.com/'
// const ENDPOINT = 'http://ec2-13-37-107-32.eu-west-3.compute.amazonaws.com:8080/';
// const ENDPOINT = 'http://localhost:8080/';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Tree = (props) => {

    // *** HOOKS ***

    const [editable, setEditable] = useState(false);
    const [showAddNodeModal, setShowAddNodeModal] = useState(false);
    const [showEditNodeModal, setShowEditNodeModal] = useState(false);
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [contextMenu, setContextMenu] = useState(null);
    const [openSaveTreeSuccessSnackbar, setOpenSaveTreeSuccessSnackbar] = useState(false);
    const [openSaveNodeSuccessSnackbar, setOpenSaveNodeSuccessSnackbar] = useState(false);
    const [openNodeRemovedSuccessSnackbar, setOpenNodeRemovedSuccessSnackbar] = useState(false);
    const [openSavingErrorSnackbar, setOpenSavingErrorSnackbar] = useState(false);
    const [openRetrievingErrorSnackbar, setOpenRetrievingErrorSnackbar] = useState(false);
    const [nodeContextMenuActions, setNodeContextMenuActions] = useState();
    const [nodeEditModal, setNodeEditModal] = useState();
    const nodeTypes = useMemo(() => ({person: PersonNode, relation: RelationNode}), []);

    useEffect(() => {
        fetchNodesHandler();
        fetchEdgesHandler();

    }, []);

    // write useEffect that checks all node.type and if they are null, set them to 'person'
    // useEffect(() => { // tinc por que peti quan el node.type que s'hagi tornat null fos de tipus relation i ara l'estigui posant a person
    //     console.log('useEffect node');
    //     let nodesCopy = [...nodes];
    //     nodesCopy.forEach(node => {
    //         if (node.type === null) {
    //             console.log('node.type is null', node);
    //             node.type = 'person';
    //         }
    //     });
    //     setNodes(nodesCopy);
    // }, [nodes]);
    // pot ser que aquest problema passi al guardar tots els nodes? Perquè el tipus null arriba a la base de dades


    // *** HANDLERS ***

    const onNodesChange = useCallback((changes) => {
        if (changes[0]?.type === 'remove' &&
            changes[0].id.slice(-4) !== '_new') {
            deleteNode(changes[0].id);
        }
        return setNodes((nds) => applyNodeChanges(changes, nds));
    }, []);

    const onEdgesChange = useCallback((changes) => {
        if (changes[0].type === 'remove') {
            deleteEdges(changes);
        }
        return setEdges((eds) => applyEdgeChanges(changes, eds));
    }, []);

    const onNodeDoubleClick = (event, node) => {
        if (editable && node.type === 'person') {
            setNodeEditModal(node);
            editNodeHandler();
        }
    };

    const onNodeContextMenu = (event, node) => {
        if (editable) {
            contextMenuHandler(event, node);
        }
    };

    const onNodesDelete = (elements) => {
        if (editable) {
            // jo no ho utilitzaria. ho deixaria aixi com està
        }
    }


    // *** API CALLS ***

    const fetchNodesHandler = async () => {
        try {
            const response = await fetch(ENDPOINT + 'api/tree/nodes', {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Something went wrong');
            }

            const data = await response.json();
            const nodesDto = formatNodes(data);
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
            const nodesDto = formatNodes(data);
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

    const addNewNodeHandler = async (newNode) => {
        props.onChangeLoadingState(true);

        const newNodeResponse = await createOrUpdateNode(newNode);
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

    const updateNodeHandler = async (node) => {
        const nodeResponse = await createOrUpdateNode(node);
        const dateContent = fillDateField(nodeResponse);

        const updatedNode = nodes.find(n => n.id === nodeResponse.id.toString());
        updatedNode.data.label =
            <div>
                <div>{nodeResponse.personName.trim()}</div>
                <div style={{fontSize: 8}}>{nodeResponse.birthPlace.trim()}</div>
                <div style={{fontSize: 8}}>{nodeResponse.job.trim()}</div>
                {dateContent}
            </div>;

        setNodes(prevState => {
            return [...prevState, updatedNode];
        });
    }

    const createOrUpdateNode = async (newNode) => {
        try {
            const response = await fetch(ENDPOINT + 'api/tree/createOrUpdateNode', {
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

    const fillNodesDto = () => {
        let nodesDto = [];

        for (const node of nodes) {
            if (node.type === 'person') {
                nodesDto = [...nodesDto, {
                    id: node.id,
                    nodeType: node.type,
                    personName: node.data.label.props.children[0].props.children,
                    birthPlace: node.data.label.props.children[1].props.children,
                    job: node.data.label.props.children[2].props.children,
                    positionX: node.position.x,
                    positionY: node.position.y
                }];

                if (node.data.label.props.children[3]?.props.children.length >= 3) {
                    nodesDto[nodesDto.length - 1].birthDate = parseStringDDMMYYYToDate(node.data.label.props.children[3].props.children[1]);
                    nodesDto[nodesDto.length - 1].deathDate = parseStringDDMMYYYToDate(node.data.label.props.children[3].props.children[3]);
                }

                if (node.data.label.props.children[3]?.props.children[0] === 'Data de naixement: ') { // TODO quan afegeixi traduccions això no funcionarà :/
                    nodesDto[nodesDto.length - 1].birthDate = parseStringDDMMYYYToDate(node.data.label.props.children[3].props.children[1]);
                }

                if (node.data.label.props.children[3]?.props.children[0] === 'Data de mort: ') { // TODO quan afegeixi traduccions això no funcionarà :/
                    nodesDto[nodesDto.length - 1].deathDate = parseStringDDMMYYYToDate(node.data.label.props.children[3].props.children[1]);
                }

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

    const editNodeHandler = () => {
        setShowEditNodeModal(true);
    }

    const addNodeBetweenCouple = (sourceNodeId, targetNodeId, nodeId) => {
        const sourceNode = nodes.find(node => node.id === sourceNodeId);
        const targetNode = nodes.find(node => node.id === targetNodeId);

        const averagePosition = calculateAveragePosition(sourceNode.position, targetNode.position);

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

    const closeAddNodeModalHandler = () => setShowAddNodeModal(false);

    const closeEditNodeModalHandler = () => setShowEditNodeModal(false);

    const contextMenuHandler = (event, node) => {
        event.preventDefault();

        if (!editable || node === undefined) {
            return;
        }

        // we save the node which will be the target of the Context Menu actions
        setNodeContextMenuActions(node);

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

    const editNodeContextMenuHandler = () => {
        if (editable && nodeContextMenuActions.type === 'person') {
            setNodeEditModal(nodeContextMenuActions);
            editNodeHandler();
        }
    }

    const removeNodeContextMenuHandler = () => {
        if (editable) {
            removeSelectedNode(nodeContextMenuActions);
        }
    }

    const handleKeypress = e => {
        if (!editable) {
            return;
        }

        if (e.keyCode === 46) { // delete key (backspace is already handled by reactflow)
            removeSelectedNode();

        } else if (e.keyCode === 78) { // N key
            addNodeHandler();

        }
    };

    const removeSelectedNode = (selectedNode) => {
        if (selectedNode === undefined) {
            selectedNode = findSelectedNode();
        }

        if (selectedNode !== null && selectedNode !== undefined) {
            setNodes(prevState => {
                return prevState.filter(node => node.id !== selectedNode.id);
            });
            deleteNode(selectedNode.id);
            const edgesToDelete = findRelatedNodeEdges(selectedNode.id);
            deleteEdges(edgesToDelete);
        }
    }

    const findSelectedNode = () => {
        for (const node of nodes) {
            if (node.selected === true) {
                return node;
            }
        }
    }

    const findRelatedNodeEdges = (nodeId) => {
        let edgesToDelete = [];

        for (const edge of edges) {
            if (edge.source === nodeId || edge.target === nodeId) {
                edgesToDelete = [...edgesToDelete, {id: edge.id}];

                setEdges(prevState => {
                    return prevState.filter(edgeItem => edgeItem.id !== edge.id);
                });
            }
        }
        return edgesToDelete;
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
                      onContextMenu={contextMenuHandler}
                      onKeyDown={handleKeypress}>
                    <ReactFlow
                        style={{background: props.backgroundColor}} // Possibles colors: 696851, CDE8BE
                        nodes={nodes}
                        onNodesChange={editable ? onNodesChange : null}
                        edges={edges}
                        onEdgesChange={editable ? onEdgesChange : null}
                        onConnect={editable ? connectHandler : null}
                        onNodeDoubleClick={onNodeDoubleClick}
                        onNodeContextMenu={onNodeContextMenu}
                        onNodesDelete={onNodesDelete}
                        nodeTypes={nodeTypes}
                        fitView
                    >
                        {editable && <Background/>}
                        <Controls showInteractive={false}/>
                        <MiniMap/>
                    </ReactFlow>
                    <ContextMenu
                        contextMenuProp={contextMenu}
                        nodeContextMenu={nodeContextMenuActions}
                        onOpenContextMenu={contextMenuHandler}
                        onCloseContextMenu={closeContextMenuHandler}
                        onEditSelectedNode={editNodeContextMenuHandler}
                        onRemoveSelectedNode={removeNodeContextMenuHandler}
                    />
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
                    Hi ha hagut un error guardant canvis
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
            <EditNodeModal showEditNodeModal={showEditNodeModal}
                           onCloseEditNodeModal={closeEditNodeModalHandler}
                           onSaveNode={updateNodeHandler}
                           node={nodeEditModal}
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
 *
 * // Events handlers:
 * // https://reactflow.dev/docs/api/react-flow-props/#event-handlers
 * // https://reactflow.dev/docs/examples/interaction/interaction-props/
 */
