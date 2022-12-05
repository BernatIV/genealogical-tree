import {Menu, MenuItem} from "@mui/material";

const ContextMenu = (props) => {

    const editNodeHandler = () => {
        props.onCloseContextMenu();
        props.onEditSelectedNode();
    }

    const removeNodeHandler = () => {
        props.onCloseContextMenu();
        props.onRemoveSelectedNode();
    }

    return (
        <Menu
            open={props.contextMenuProp !== null}
            onClose={props.onCloseContextMenu}
            anchorReference="anchorPosition"
            anchorPosition={
                props.contextMenuProp !== null
                    ? { top: props.contextMenuProp.mouseY, left: props.contextMenuProp.mouseX }
                    : undefined
            }
        >
            {props.nodeContextMenu?.type === 'person' &&
                <MenuItem onClick={editNodeHandler}>Editar</MenuItem>}
            <MenuItem onClick={removeNodeHandler}>Eliminar</MenuItem>
        </Menu>
    );
}
export default ContextMenu;

/**
 * https://mui.com/material-ui/react-menu/#context-menu
 */
