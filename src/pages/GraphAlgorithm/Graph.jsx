import CytoscapeComponent from 'react-cytoscapejs';
import avsdf from 'cytoscape-avsdf';
import Cytoscape from 'cytoscape';
import styles from './GraphAlgorithm.module.scss'



const Graph = ({ elements, setCy, layout }) => {
  Cytoscape.use(avsdf);
  
  
  return (
    <div className={styles.graph}>
      <CytoscapeComponent elements={elements} style={{ width: '80%', height: '600px' }} layout={layout} maxZoom={1}
        minZoom={0.5} classes={null} cy={setCy} stylesheet={[
          {
            selector: 'node',
            style: {
              width: 40,
              height: 40,
              'label': 'data(label)',
              'source-text-offset': '0',
              "text-valign": "center",
              "text-halign": "center",
              'color': 'black',
              'background-color': 'white',
              'border-width': '3px',
              'border-color': 'black'

            }
          },
          {
            selector: 'edge',
            style: {
              'label': 'data(label)' // maps to data.label
            }
          }
        ]} />

    </div>
  )
}

export default Graph