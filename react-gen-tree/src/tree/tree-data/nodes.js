const parseNodes = (nodes) => {

    let nodesDto = [];

    for (const node of nodes) {
        nodesDto = [...nodesDto, {
            id: node.id.toString(),
            type: node.nodeType,
            data: {
                label: node.nodeType === 'person' ?
                    <div>
                        <div>{node.personName}</div>
                        <div style={{fontSize: 8}}>{node.birthPlace}</div>
                        <div style={{fontSize: 8}}>{node.job}</div>
                    </div>
                    :
                    <div style={{fontSize: 7}}>&nbsp;</div>
            },
            position: {x: node.positionX, y: node.positionY}
        }];
    }

    return nodesDto;
}

export default parseNodes;


/*

return [
            {
                id: '52',
                type: 'person',
                // style: { background: '#1e9e99' }, // { width: 80, fontSize: 11, color: 'white' };
                data: { label: <div><div>Pilar Casanovas Casals</div><div style={{fontSize: 8}}>Olesa de Montserrat</div></div> },
                position: { x: 0, y: 125 },
                // sourcePosition: 'right', -->  només per si el tipus és default
                // targetPosition: 'left'
            },
            {
                id: '53',
                type: 'person',
                data: { label: <div><div>Manel Casanovas Casals</div><div style={{fontSize: 8}}>Olesa de Montserrat</div></div> },
                position: { x: 250, y: 125 },
                // sourcePosition: 'right',
                // targetPosition: 'left'
            },
            {
                id: '54',
                type: 'person',
                data: { label: <div><div>Carme</div><div style={{fontSize: 8}}>BCN 4/2/1904</div></div> },
                position: { x: 300, y: 0 },
                // sourcePosition: 'right',
                // targetPosition: 'left'
            },
            {
                id: '55',
                type: 'person',
                data: { label: <div><div>Ignasi</div><div style={{fontSize: 8}}>BCN 4/2/1904</div></div> },
                position: { x: 0, y: 0 },
                // sourcePosition: 'right',
                // targetPosition: 'left'
            },
            {
                id: '56',
                type: 'relation',
                data: { label: <div style={{fontSize: 7}}>&nbsp;</div> },
                position: { x: 200, y: 14 },
                // sourcePosition: 'right',
                // targetPosition: 'left'
            },

        ];
 */
