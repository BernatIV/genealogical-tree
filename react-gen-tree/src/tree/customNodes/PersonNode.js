import {Handle, Position} from "reactflow";
import {useEffect, useState} from "react";

const PersonNode = (props) => {
    const [personNodeStyle, setPersonNodeStyle] = useState({
        minWidth: '125px',
        padding: '10px',
        border: '1px solid', // #1a192b',
        borderColor: '#9C9B68',
        borderRadius: '5px',
        backgroundColor: '#E8E7B3',
        fontSize: '10px',
        textAlign: 'center'
    });

    const [handleStyle, setHandleStyle] = useState({
        width: '10px',
        height: '10px',
        backgroundColor: '#CDE8BE',
    });

    /**
     * check on every render (only if props changed) if the node is selected to update the border.
     */
    useEffect(() => {
        setPersonNodeStyle(prevState => {
            return {...prevState, style: props.style};
        });

        if (props.selected) {
            setPersonNodeStyle(prevState => {
                return {...prevState, boxShadow: '0 0 0 0.5px #1a192b'};
            });
        } else {
            setPersonNodeStyle(prevState => {
                return {...prevState, boxShadow: ''};
            });
        }

        // check if it's editable
        if (!props.isEditable) {
            setHandleStyle(prevState => {
                return {...prevState, backgroundColor: '#CDE8BE'};
            });
        } else {
            setHandleStyle(prevState => {
                return {...prevState, backgroundColor: 'transparent'};
            });
        }
    }, [props]);

    return (
        <div style={personNodeStyle}>
            <Handle style={handleStyle}
                    type="target"
                    position={Position.Left}
                    id="a"/>
            <Handle style={handleStyle}
                    type="target"
                    position={Position.Top}
                    id="b"/>
            <div>
                {props.data?.label}
            </div>
            <Handle style={handleStyle}
                    type="source"
                    position={Position.Right}
                    id="c"/>
        </div>
    );
}
export default PersonNode;

/**
 * TODO que els handlers siguin ben grans per poder clicar-los rapids.
 *  Solució -> https://github.com/wbkd/react-flow/discussions/1180
 */

/*
 * Other possible Handle Styles
 * 1st
 *  // width: '20px',
    // height: '20px',
    // left: '-9px',
    // border: "6px solid rgba(0,0,0,0)",
    // backgroundClip: "padding-box",

* 2nd
    // left: "50%",
    // background: "#B1B1B7",
    // height: 60,
    // width: 60,
    // marginTop: -26,
    // border: "22px solid rgba(0,0,0,0)",
    // backgroundClip: "padding-box",
 */