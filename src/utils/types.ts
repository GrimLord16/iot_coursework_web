export type NodeJ = {

    id: number,
    vertex: number,
    vertexTo: number,
    edgeValue: number

}

export type GraphElement = {
    data: Data | Line
    position?: {x:number, y: number},
    

}
export type Data = {
    id: string,
    label: string,
    classes: null
}
export type Line = {
    source: string,
    target: string | undefined,
    label:string
}