import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Data, GraphElement, Line, NodeJ } from '../../utils/types';
import Graph from './Graph';
import styles from './GraphAlgorithm.module.scss';

const GraphAlgorithm = () => {

    const [elements, setElements] = useState<NodeJ[]>([]);
    const [elementsG, setElementsG] = useState<GraphElement[]>([]);
    const [result, setResult] = useState<number>();
    const [path, setPath] = useState<number[]>([]);
    const [curr, setCurr] = useState<number>(-1);
    const [isStopped, setIsStopped] = useState<boolean>(false);
    const [temp, setTemp] = useState<number[]>([]);

    let cyRef = useRef<cytoscape.Core | undefined>();
    useEffect(() => {
        console.log(isStopped)
    }, [isStopped])

    const layout = {
        name: 'avsdf',
        ready: function () {
        },
        // Called on `layoutstop`
        stop: function () {
        },
        // number of ticks per frame; higher is faster but more jerky
        refresh: 30,
        // Whether to fit the network view after when done
        fit: true,
        // Padding on fit
        padding: 10,
        // Prevent the user grabbing nodes during the layout (usually with animate:true)
        ungrabifyWhileSimulating: false,
        // Type of layout animation. The option set is {'during', 'end', false}
        animate: 'end',
        // Duration for animate:end
        animationDuration: 500,
        // How apart the nodes are
        nodeSeparation: 100
    };

    const setCy = (cy: any) => {
        cyRef.current = cy;
    }


    useEffect(() => {
        if (elements) {
            cyRef.current?.elements().makeLayout(layout).run();
        }
    }, [JSON.stringify(elements)]);


    const highlights = () => {
        if(curr<path.length){
            let amogus = cyRef.current?.getElementById(path[curr].toString());
            
            setCurr(curr + 1);
            amogus?.addClass('highlighted');
            setTemp([...temp ,path[curr]]);
            console.log(temp)
            if (curr > 0 && path[curr - 1].toString() !== path[path.length-2].toString()) {
                let pastamogus = cyRef.current?.getElementById(path[curr - 1].toString());
                pastamogus?.removeClass('highlighted');
                pastamogus?.addClass('past_nodes');
            }
            if (path[curr].toString() === path[0].toString()) {

                for (let j = temp.length - 1; j >= 0; j--) {
                    let unamogus = cyRef.current?.getElementById(temp[j].toString());
                    unamogus?.removeClass('past_nodes');
                    unamogus?.removeClass('highlighted');
                    cyRef.current?.getElementById(path[curr].toString()).removeClass('past_nodes');
                    cyRef.current?.getElementById(path[curr].toString()).removeClass('highlighted');
                }

                setTemp([]);
            }
        }
    }
        
    useEffect(() => {
        if(curr>=0){
            if (!isStopped) { 
            setTimeout(highlights, 1500);
            }
        }


    }, [curr])


    useEffect(() => {

        const arr: GraphElement[] = [];
        elements.forEach((value) => {
            const graphEl1: Data = {
                label: value.vertex.toString(),
                id: value.vertex.toString(),
                classes: null
            }
            const graphEl2: Data = {
                label: value.vertexTo.toString(),
                id: value.vertexTo.toString(),
                classes: null
            }
            const graphLine: Line = {
                source: value.vertex.toString(),
                target: value.vertexTo.toString(),
                label: value.edgeValue.toString(),


            }
            if (!arr.find((item) => value.vertex.toString() === item.data.label)) {
                arr.push({ data: graphEl1 })
            }
            if (!arr.find((item) => value.vertexTo.toString() === item.data.label)) {

                arr.push({ data: graphEl2 })
            }

            arr.push({ data: graphLine })
        })
        setElementsG(arr);
    }
        , [elements])
    const findMaxflow = (source: number, sink: number) => {
        let matrix = convert(elements);
        return fordFulkerson(matrix, source, sink)
    }

    const handleAddFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const vertex = parseInt(data.get('vertex')?.toString() || '0');
        const vertexTo = parseInt(data.get('vertexTo')?.toString() || '0');
        const edgeValue = parseInt(data.get('edgeValue')?.toString() || '0');
        const newId = elements[elements.length - 1]?.id + 1 || 0;

        setElements([...elements, { vertex, vertexTo, edgeValue, id: newId }])
    }

    const generateValues = () => {
        const generated = [{ vertex: 1, vertexTo: 2, edgeValue: 20, id: 1 },
        { vertex: 2, vertexTo: 3, edgeValue: 20, id: 2 },
        { vertex: 3, vertexTo: 4, edgeValue: 20, id: 3 },
        { vertex: 1, vertexTo: 5, edgeValue: 20, id: 4 },
        { vertex: 5, vertexTo: 6, edgeValue: 20, id: 5 },
        { vertex: 6, vertexTo: 7, edgeValue: 20, id: 6 },
        { vertex: 7, vertexTo: 8, edgeValue: 20, id: 7 },
        { vertex: 4, vertexTo: 8, edgeValue: 20, id: 8 }]
        setElements([...generated])
    }

    const handleAlgorithmFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const source = parseInt(data.get('source')?.toString() || '0');
        const sink = parseInt(data.get('sink')?.toString() || '0');
        setResult(findMaxflow(source, sink));
        visualize(); 
    }

    async function visualize() {
        


        setCurr(0);


    }

    function convert(array: NodeJ[]) {
        let set = new Set();
        array.forEach(value => {
            set.add(value.vertex);
            set.add(value.vertexTo);
        })
        let unlen = set.size
        let matrix: number[][] = Array.from({ length: unlen }, () => new Array(unlen).fill(0));


        array.forEach(value => {
            matrix[value.vertex - 1][value.vertexTo - 1] = value.edgeValue
        })
        return matrix


    }
    function bfs(rGraph: any, source: any, sink: any, parent: any, temp: number[]) {
        let V = rGraph.length;
        let visited = new Array(V);
        for (let i = 0; i < V; ++i)
            visited[i] = false;
        let queue = [];
        queue.push(source);
        visited[source] = true;
        parent[source] = -1;

        while (queue.length !== 0) {


            let u = queue.shift();
            // console.log(u + 1)
            temp.push(u + 1)


            for (let v = 0; v < V; v++) {
                if (visited[v] === false &&
                    rGraph[u][v] > 0) {
                    if (v === sink) {
                        temp.push(sink + 1)
                        parent[v] = u;
                        // console.log(temp);

                        return true;
                    }
                    queue.push(v);
                    parent[v] = u;
                    visited[v] = true;
                }
            }

        }

        return false;
    }
    function fordFulkerson(graph: number[][], source: any, sink: any) {
        let u, v;
        let V = graph.length;
        let rGraph = new Array(V);

        for (u = 0; u < V; u++) {
            rGraph[u] = new Array(V);
            for (v = 0; v < V; v++)
                rGraph[u][v] = graph[u][v];
        }
        let parent = new Array(V);
        let max_flow = 0;
        let temp: number[] = []
        while (bfs(rGraph, source - 1, sink - 1, parent, temp)) {
            let path_flow = Number.MAX_VALUE;
            for (v = sink - 1; v !== source - 1; v = parent[v]) {
                u = parent[v];
                path_flow = Math.min(path_flow,
                    rGraph[u][v]);
            }
            for (v = sink - 1; v !== source - 1; v = parent[v]) {
                u = parent[v];
                rGraph[u][v] -= path_flow;
                rGraph[v][u] += path_flow;
            }

            max_flow += path_flow;
        }
        setPath(temp);

        return max_flow;
    }

    return (
        <div>
            <Graph elements={elementsG} setCy={setCy} layout={layout} />
            <div className={styles.controlButtons}>
                <button onClick={() => {setIsStopped(true)
                }}>Stop</button>
                <button onClick={() => {
                    setIsStopped(false);
                    setCurr(curr-1);
                    
                }}>Continue</button>
                    <button onClick={() => {
                    console.log('step')
                    if (isStopped) {
                        let unamogus = cyRef.current?.getElementById(path[curr-1].toString());
                        let pastamogus = cyRef.current?.getElementById(path[curr-2].toString());
                        pastamogus?.removeClass('past_nodes');
                        pastamogus?.addClass('highlighted');
                        unamogus?.removeClass('highlighted');
                        setCurr(curr-1);
                    }
                }}>Step back</button>
            </div>
            <table>
                <tbody>
                    <tr>
                        <th>Edge list</th>
                    </tr>

                    {elements.map((val, key) => {
                        return (
                            <tr key={key}>
                                <td>{val.id}:</td>
                                <td>{val.vertex}</td>
                                <td>{val.vertexTo}</td>
                                <td>{val.edgeValue}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        <div className={styles.forms}>
            <form onSubmit={handleAddFormSubmit} className={styles.addForm}>
                <h2>Add an edge</h2>
                <label htmlFor='vertex'>Vertex from: </label>
                <input
                    id="vertex"
                    type="number"
                    name="vertex"
                />
                <label htmlFor='vertexTo'>Vertex to: </label>
                <input
                    id="vertexTo"
                    type="number"
                    name="vertexTo"
                />
                <label htmlFor='edgeValue'>Edge weight: </label>
                <input
                    id="edgeValue"
                    type="number"
                    name="edgeValue"
                />
                <div className={styles.buttons}>
                    <button type="submit">Add</button>
                    <div className={styles.orText}>or</div>
                    <button onClick={generateValues} type="button">Generate a random network</button>
                </div>
            </form>
            <form onSubmit={handleAlgorithmFormSubmit} className={styles.computeForm}>
                <h2>Get result</h2>
                <label htmlFor='source'>Source: </label>
                <input
                    id="source"
                    type="number"
                    name="source"
                />
                <label htmlFor='sink'>Sink: </label>
                <input
                    id="sink"
                    type="number"
                    name="sink"
                />
                <button type='submit'>Compute</button>
                <p>
                Result: {result}
                    </p>
            </form>
        </div>
    </div>
    )
}

export default GraphAlgorithm