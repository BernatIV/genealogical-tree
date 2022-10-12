import {Handle, Position} from "reactflow";


const CoupleUnionNode = (props) => {
    const nodeStyle = {
        minWidth: '21px',
        minHeight: '16px',
        padding: '4px',
        borderRadius: '50px',
        border: '1px solid #696831',
        backgroundColor: '#FFFEDE'
    }

    const smallHandleStyle = {
        width: '1px',
        height: '1px',
        backgroundColor: 'transparent',
        borderColor: 'transparent'
    }

    const bigHandleStyle = {
        width: '10px',
        height: '10px',
        backgroundColor: '#CDE8BE',
    }

    return (
        <div style={nodeStyle}>
            <Handle style={smallHandleStyle}
                    type="target"
                    position={Position.Left}
                    id="a" />
            <Handle style={bigHandleStyle}
                    type="source"
                    position={Position.Bottom}
                    id="b" />
            <div>
                {props.data?.label}
            </div>
            <Handle style={smallHandleStyle}
                    type="source"
                    position={Position.Right}
                    id="c" />
        </div>
    );
}
export default CoupleUnionNode;