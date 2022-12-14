import React, { useEffect, useRef, useState } from 'react'
import { MinHeapEle } from '../../utils/types';
import MinHeap from './MinHeap';
import styles from './DataStructure.module.scss';

const DataStructure = () => {
    const [heapElements, setHeapElements] = useState<MinHeapEle[]>([]);
    const [elements, setElements] = useState<number[]>([0]);
    const [input, setInput] = useState<string>();
    const [result, setResult] = useState<string>('Gives an index of a wanted node');
    let cyRef = useRef<cytoscape.Core | undefined>();
    console.log(elements)
    
    useEffect (() => {
        updateCytoscapeNodes();
    }, [elements]);

    const setCy = (cy: any) => {
        cyRef.current = cy;
    }

    const addNode = () => {
        const temp = new Set(elements);
        temp?.add(parseInt(input ?? '0'));
        const tempArray = [...Array.from(temp)];
        setElements([...tempArray])
        fixHeapElements(tempArray, tempArray.length-1);
    }



    const fixHeapElements = async (tempArray: number[], currIndex: number) => {
        const currElement = tempArray[currIndex];
        const parentIndex = Math.floor(currIndex / 2);
        const currElementParent = tempArray[parentIndex];
        if (currElement > currElementParent || currIndex === 0) {
            setElements(tempArray);
            return;
        }

        [tempArray[currIndex], tempArray[parentIndex]] = [tempArray[parentIndex], tempArray[currIndex]];
        await renderElements(tempArray);
        fixHeapElements(tempArray, parentIndex);
        
    } 

    const renderElements = async (array: number[]) => {
        
        console.log(array)
        await new Promise((r) => {
            setTimeout(r, 1000)
        });
        setElements([...array]);
    }

    

    const updateCytoscapeNodes = () => {
        if (elements.length <= 1) return;

        const tempHeapElements: MinHeapEle[]  = [];
        elements.forEach((element, index) => {
            if (index === 0) return;
            
            const node = {data: {id: element.toString()}};
            if (index === 1) tempHeapElements.push(node); // tree root
            else tempHeapElements.push(node, {data: {source: elements[Math.floor((index)/2)].toString(), target: element.toString()}});
        });
        
        setHeapElements(tempHeapElements);
    }



    const deleteNode = async () => {
        const node: number = parseInt(input ?? '0')
        if (node !== 0) {

            const index = elements.findIndex((el) => el===node );
            if(index===-1) return;
            let amogus = cyRef.current?.getElementById(elements[index].toString())
            amogus?.addClass('past_nodes');
            let anotherAmogus = cyRef.current?.getElementById(elements[elements.length-1].toString())
            anotherAmogus?.addClass('highlighted');
            await new Promise((r) => {
                setTimeout(r, 2000)
            });
            if(index===elements.length-1){
                amogus?.removeClass('past_nodes');
                anotherAmogus?.removeClass('past_nodes');
                elements.pop();
                setElements([...elements]);
            } else {
                [elements[index], elements[elements.length-1]] = [elements[elements.length-1], elements[index]];
                amogus?.removeClass('past_nodes');
                elements.pop();
                setElements([...elements]);
                fixDeletion(elements, index);

                
            }
            
            
        }
        
    }
    const fixDeletion = async (tempArray: number[], currIndex: number) => {
        const currElement = tempArray[currIndex];
        const leftChild = tempArray[2*currIndex];
        const rightChild = tempArray[2*currIndex+1];
        let childIndex = leftChild<rightChild? 2*currIndex: 2*currIndex+1
        if (currElement < tempArray[childIndex] || childIndex >= tempArray.length-1) {
            setElements(tempArray);
            let amogus = cyRef.current?.getElementById(elements[currIndex].toString())
            amogus?.removeClass('highlighted');
            return;
        }

        [tempArray[currIndex], tempArray[childIndex]] = [tempArray[childIndex], tempArray[currIndex]];
        await renderElements(tempArray);
        fixDeletion(tempArray, childIndex);
    }

    const findNode = async () => {
        const wanted = parseInt(input ?? '0')
        if (wanted !== 0) {
            if (wanted>elements[1]) {
                for (let i=1; i<elements.length; i++){
                    let amogus = cyRef.current?.getElementById(elements[i].toString())
                    amogus?.addClass('highlighted');
                    if(i>1) {
                        let pastamogus = cyRef.current?.getElementById(elements[i-1].toString());
                        pastamogus?.removeClass('highlighted');
                        pastamogus?.addClass('past_nodes');
                    }
                    await new Promise((r) => {
                        setTimeout(r, 2000)
                    });
                    if (elements[i] === wanted) {
                        setResult(i.toString() + 'th in the array');
                        for(const noder of elements){
                            let amogus = cyRef.current?.getElementById(noder.toString())
                            amogus?.removeClass('past_nodes');
                        }
                        amogus?.removeClass('highlighted');
                        return;
                    }
                }
            }
            setResult(`the wanted value:${wanted} is lesser than the root of a min heap`)
            return; 
        }
        setResult('You should input a non-negative number or you didn\'t input number at all!! 0 can\'t be inputted')
    }
    useEffect(() => {
        if (heapElements) {
            cyRef.current?.elements().makeLayout(layout).run();
        }
    }, [JSON.stringify(heapElements)]);

    const layout = {
        name: 'dagre',
        animate: true,
        refresh: 30
    };
    
  return (
      
    <div>
       <MinHeap elements={heapElements} layout={layout} setCy={setCy}/>
                <div className={styles.interface}>
                    <h2>Add a Node</h2>
                    <label htmlFor='vertex'>Node: </label>
                    <input onChange={(e) => setInput(e.target.value)}
                        id="vertex"
                        type="number"
                        name="vertex"
                    />
                    <div className={styles.buttons}>
                        <button onClick={addNode}>Add</button>
                        <button onClick={deleteNode}>Delete</button>
                        <button onClick={findNode}>Find</button>
                    </div>
                    <p>Found: {result}</p>
                </div>
        
    </div>
  )
}

export default DataStructure