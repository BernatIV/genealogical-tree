
const initialEdges = (edges) => {
    let edgesDto = [];

    for (const edge of edges) {
        edgesDto = [...edgesDto, {
            id: edge.id.toString(),
            source: edge.source,
            sourceHandle: edge.sourceHandle,
            target: edge.target,
            targetHandle: edge.targetHandle
        }];
    }
    return edgesDto;
}
export default initialEdges;

/*
    [
        { id: 'e1-2', source: '55', target: '64', sourceHandle: 'c', targetHandle: 'a' }, // label: 'hola', type: 'step'
        { id: 'e2-3', source: '64', target: '54', sourceHandle: 'c', targetHandle: 'a' }, // animated: true
        { id: '3333', source: '64', target: '52', sourceHandle: 'b', targetHandle: 'b' },
        { id: '4444', source: '64', target: '53', sourceHandle: 'b', targetHandle: 'b' },
    ];

 */
