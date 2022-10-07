import {Handle, Position} from "reactflow";
import {useEffect, useState} from "react";

const PersonNode = (props) => {
    const [personNodeStyle, setPersonNodeStyle] = useState({
        minWidth: '125px',
        padding: '10px',
        border: '1px solid #3a3a3a',
        borderRadius: '5px',
        background: 'white',
        fontSize: '10px',
    });

    /**
     * check on every render (only if props changed) if the node is selected to update the border.
     */
    useEffect(() => {
        if (props.selected) {
            setPersonNodeStyle(prevState => {
                return {...prevState, border: '2px solid #3a3a3a'}
            });
        } else {
            setPersonNodeStyle(prevState => {
                return {...prevState, border: '1px solid #3a3a3a'}
            });
        }
    }, [props]);

    const handleStyle = {
        width: '10px',
        height: '10px'
    }

    return (
        <div style={personNodeStyle}>
            <Handle style={{
                width: '20px',
                height: '20px',
                left: '-9px',
                border: "6px solid rgba(0,0,0,0)",
                backgroundClip: "padding-box",

                // left: "50%",
                // background: "#B1B1B7",
                // height: 60,
                // width: 60,
                // marginTop: -26,
                // border: "22px solid rgba(0,0,0,0)",
                // backgroundClip: "padding-box",
            }}
                    type="target"
                    position={Position.Left}
                    id="a" />
            <Handle style={handleStyle} type="target" position={Position.Top} id="b" />
            <div>
                <label htmlFor="text">Text:</label>
            </div>
            <Handle style={handleStyle} type="source" position={Position.Right} id="c" />
        </div>
    );
}
export default PersonNode;

/**
 * TODO que els handlers siguin ben grans per poder clicar-los rapids.
 *  Solució -> https://github.com/wbkd/react-flow/discussions/1180
 */
