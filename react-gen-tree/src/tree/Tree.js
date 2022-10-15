import {Button, Card, Col, Container, Row} from "react-bootstrap";
import ReactFlow, {addEdge, applyEdgeChanges, applyNodeChanges, Background, Controls, MiniMap} from "reactflow";
import {forwardRef, useCallback, useMemo, useState} from "react";
import initialNodes from "./tree-data/nodes";
import initialEdges from "./tree-data/edges";
import './Tree.css';
import CreateNodeModal from "./modalWindows/CreateNodeModal";
import ContextMenu from "./contextMenu/ContextMenu";
import {Snackbar} from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import PersonNode from "./customNodes/PersonNode";
import CoupleUnionNode from "./customNodes/CoupleUnionNode";

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Tree = () => {
    const [editable, setEditable] = useState(false);
    const [showAddNodeModal, setShowAddNodeModal] = useState(false);
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
    const [contextMenu, setContextMenu] = useState(null);
    const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
    let nodesToSave = [];
    const nodeTypes = useMemo(() => ({person: PersonNode, coupleUnion: CoupleUnionNode}), []);


    const onNodesChange = useCallback((changes) =>
            setNodes((nds) =>
                applyNodeChanges(changes, nds)),
        []);

    const onEdgesChange = useCallback((changes) =>
            setEdges((eds) =>
                applyEdgeChanges(changes, eds)),
        []);

    const connectHandler = (params) => {
        const target = params.target;
        const targetHandle = params.targetHandle;
        const newNodeId = (Math.random() * 1000000).toString();

        addNodeBetweenCouple(params, newNodeId);
        connectFirstPartEdge(params);
        connectSecondPartEdge(params, target, targetHandle, newNodeId);
    }

    const connectFirstPartEdge = useCallback((params) =>
            setEdges((eds) => {


                console.log('hola?');
                console.log(params);
                console.log(eds);

                return addEdge(params, eds);
            }),
        []);

    const connectSecondPartEdge = useCallback((params, target, targetHandle, newNodeId) =>
            setEdges((eds) => {

                params.source = newNodeId;
                params.sourceHandle = 'c';
                params.target = target;
                params.targetHandle = targetHandle;

                console.log(params);

                return addEdge(params, eds);
            }),
        []);

    const changeEditModeHandler = () => {
        setEditable(!editable);
        console.log(nodes);
    }
    const saveNodesHandler = () => {
        nodesToSave = nodes;
        console.log(nodesToSave);
        // El node ja estarà guardat al backend, però actualitzarà les posicions i els edges a la DB.
        setEditable(false);

        setOpenSuccessSnackbar(true);
    }

    const addNodeHandler = () => {
        setShowAddNodeModal(true);
    }

    const addNodeBetweenCouple = (params, nodeId) => {
        params.target = nodeId;
        params.targetHandle = 'a';

        setNodes(prevState => {
            return [...prevState, {
                id: nodeId,
                type: 'coupleUnion',
                data: {
                    label: <div style={{fontSize: 7}}>&nbsp;</div>
                },
                position: {x: 50, y: 50} // TODO: Les coordenades les tenim a l'array de nodes perq tenim l'id dels nodes que estem relacioant
                // falta posar
                // 1. les coordenades de debò entre els dos nodes,
                // 2. i una segona relació
            }];
        });
        return nodeId;
    }

    const addNewNodeHandler = async (newNode) => {

        const newNodeResponse = await saveNewNode(newNode);
        const dateContent = fillDateField(newNodeResponse);

        console.log('afegint node a larbre');
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
    }

    const fillDateField = (newNode) => {
        let dateContent;

        if ((newNode.birthDate !== '' && newNode.birthDate !== null) &&
            (newNode.deathDate === '' || newNode.deathDate === null)) {
            dateContent = <div style={{fontSize: 8}}>Data de naixement: {newNode.birthDate}</div>;
        }

        if ((newNode.birthDate === '' || newNode.birthDate === null) &&
            (newNode.deathDate !== '' && newNode.deathDate !== null)) {
            dateContent = <div style={{fontSize: 8}}>Data de mort: {newNode.deathDate}</div>;
        }

        if (newNode.birthDate !== '' && newNode.birthDate !== null &&
            newNode.deathDate !== '' && newNode.deathDate !== null) {
            dateContent = <div style={{fontSize: 8}}>({newNode.birthDate}) - ({newNode.deathDate})</div>;
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

    const closeSuccessSnackbarHandler = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSuccessSnackbar(false);
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
                open={openSuccessSnackbar}
                onClose={closeSuccessSnackbarHandler}
                autoHideDuration={6000}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert onClose={closeSuccessSnackbarHandler} severity="success" sx={{width: '100%'}}>
                    L'arbre s'ha guardat!
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
