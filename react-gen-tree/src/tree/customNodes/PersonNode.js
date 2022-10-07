import {Handle, Position} from "reactflow";
import './PersonNode.css';


const PersonNode = (props) => {
    return (
        <div className="person-node">
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
            <Handle style={{width: '10px', height: '10px'}} type="target" position={Position.Top} id="b" />
            <div>
                <label htmlFor="text">Text:</label>
            </div>
            <Handle style={{width: '10px', height: '10px'}} type="source" position={Position.Right} id="c" />
        </div>
    );
}
export default PersonNode;

/**
 * TODO que els handlers siguin ben grans per poder clicar-los rapids.
 *  Solució -> https://github.com/wbkd/react-flow/discussions/1180
 */
