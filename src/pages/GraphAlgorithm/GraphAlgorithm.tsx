import { FormEvent, useEffect, useRef, useState } from 'react';
import { Data, GraphElement, Line, NodeJ } from '../../utils/types';
import Graph from './Graph';

const GraphAlgorithm = () => {

    const [elements, setElements] = useState<NodeJ[]>([]);
    const [elementsG, setElementsG] = useState<GraphElement[]>([]);
    const [result, setResult] = useState<number>();

    let cyRef = useRef<cytoscape.Core | undefined>();
      
    const layout = { name: 'avsdf' };
    
    const setCy = (cy: any) => {
        cyRef.current = cy;
    }

    
    useEffect(() => {
        if (elements) {
            cyRef.current?.elements().makeLayout(layout).run();
        }
    }, [elements]);

    

    useEffect(()=>{
        
        const arr: GraphElement[] =[];
        elements.forEach((value)=>{
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
                label: value.edgeValue.toString()

            }
            if(!arr.find((item)=> value.vertex.toString() === item.data.label)) {
                arr.push({data: graphEl1})
            }
            if(!arr.find((item)=> value.vertexTo.toString() === item.data.label)) {

                arr.push({data: graphEl2})
            }

            arr.push({data: graphLine} )
        })
        setElementsG(arr);
    }
    ,[elements])
    const findMaxflow = (source: number, sink: number) => {
        let matrix = convert(elements);
        return fordFulkerson(matrix, source, sink)
    }
    
    const handleAddFormSubmit =(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const vertex =  parseInt(data.get('vertex')?.toString() || '0');
        const vertexTo = parseInt(data.get('vertexTo')?.toString() || '0');
        const edgeValue = parseInt(data.get('edgeValue')?.toString()|| '0') ;
        const newId = elements[elements.length-1]?.id+1 || 0;

        setElements([...elements, {vertex, vertexTo, edgeValue, id: newId}])
    }

    const handleAlgorithmFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const source =  parseInt(data.get('source')?.toString() || '0');
        const sink =  parseInt(data.get('sink')?.toString() || '0');
        setResult(findMaxflow(source, sink))
    }

    function convert(array: NodeJ[]){
        let set = new Set();
        array.forEach( value =>{
            set.add(value.vertex);
            set.add(value.vertexTo);
        }) 
        let unlen = set.size
        let matrix:number[][] = Array.from({length: unlen}, () => new Array(unlen).fill(0));
        
    
        array.forEach( value =>{
            matrix[value.vertex-1][value.vertexTo-1] = value.edgeValue
        })
        return matrix
    
        
    }
    function bfs(rGraph:any, source:any, sink:any, parent:any)
    {
        let V = rGraph.length
        let visited = new Array(V);
        for(let i = 0; i < V; ++i)
            visited[i] = false;
        let queue  = [];
        queue.push(source);
        visited[source] = true;
        parent[source] = -1;
     
        while (queue.length !== 0)
        {
            let u = queue.shift();
            const amogus = cyRef.current?.getElementById(u)
            console.log(amogus)
            for(let v = 0; v < V; v++)
            {
                if (visited[v] === false &&
                    rGraph[u][v] > 0)
                {
                    if (v == sink)
                    {
                        parent[v] = u;
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
    function fordFulkerson(graph:number[][], source:any, sink:any)
    {
        let u, v;
        let V = graph.length
        let rGraph = new Array(V);
     
        for(u = 0; u < V; u++)
        {
            rGraph[u] = new Array(V);
            for(v = 0; v < V; v++)
                rGraph[u][v] = graph[u][v];
         }
        let parent = new Array(V);
        let max_flow = 0;
        while (bfs(rGraph, source-1, sink-1, parent))
        {
            let path_flow = Number.MAX_VALUE;
            for(v = sink-1; v != source-1; v = parent[v])
            {
                u = parent[v];
                path_flow = Math.min(path_flow,
                                     rGraph[u][v]);
            }
            for(v = sink-1; v !== source-1; v = parent[v])
            {
                u = parent[v];
                rGraph[u][v] -= path_flow;
                rGraph[v][u] += path_flow;
            }
     
            max_flow += path_flow;
        }
     
        return max_flow;
    }
    
    return (
        <div>
            <Graph elements={elementsG} setCy = {setCy} layout = {layout}/>
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
            <h2>Add an edge</h2>
            <form onSubmit={handleAddFormSubmit}>
                <input
                    type="number"
                    name="vertex"
                />
                <input
                    type="number"
                    name="vertexTo"
                />
                <input
                    type="number"
                    name="edgeValue"
                />
                <button type="submit">Add</button>
            </form>
            <form onSubmit={handleAlgorithmFormSubmit}>
                <input 
                    type="number"
                    name="source"
                />
                <input 
                    type="number"
                    name="sink"
                />
                <button type='submit'>Compute</button>
            </form>
            <p>
                Result: {result}
            </p>
        </div>
      
  )
}

export default GraphAlgorithm