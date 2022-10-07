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
    const nodeTypes = useMemo(() => ({ person: PersonNode }), []);


    const onNodesChange = useCallback((changes) =>
            setNodes((nds) =>
                applyNodeChanges(changes, nds)),
        []);

    const onEdgesChange = useCallback((changes) =>
            setEdges((eds) =>
                applyEdgeChanges(changes, eds)),
        []);

    const connectHandler = useCallback((params) =>
        setEdges((eds) => {
            // TODO if both nodes are parents, connected with the left and right handles -> create a node in the middle of the edge
            addEdge(params, eds)
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

    const addNewNodeHandler = (newNode) => {

        const dateContent = fillDateField(newNode);

        setNodes(prevState => {
            return [...prevState, {
                id: 'temporary-id',
                type: '',
                data: {
                    label:
                        <div>
                            <div>{newNode.name.trim()}</div>
                            <div style={{fontSize: 8}}>{newNode.birthPlace.trim()}</div>
                            <div style={{fontSize: 8}}>{newNode.job.trim()}</div>
                            {dateContent}
                        </div>
                },
                position: {x: 0, y: 0}
            }];
        });
        // TODO save to backend
    }

    const fillDateField = (newNode) => {
        let dateContent;

        if (newNode.birthDate !== '' && newNode.deathDate === '') {
            dateContent = <div style={{fontSize: 8}}>Data de naixement: {newNode.birthDate}</div>;
        }

        if (newNode.birthDate === '' && newNode.deathDate !== '') {
            dateContent = <div style={{fontSize: 8}}>Data de mort: {newNode.deathDate}</div>;
        }

        if (newNode.birthDate !== '' && newNode.deathDate !== '') {
            dateContent = <div style={{fontSize: 8}}>({newNode.birthDate}) - ({newNode.deathDate})</div>;
        }

        if (newNode.manualEnteredDate.trim() !== '') {
            dateContent = <div style={{fontSize: 8}}>({newNode.manualEnteredDate.trim()})</div>;
        }
        return dateContent
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
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={closeSuccessSnackbarHandler} severity="success" sx={{ width: '100%' }}>
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
