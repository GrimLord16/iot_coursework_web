import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import styles from './DataStructure.module.scss';

const MinHeap = ({elements, layout, setCy}) => {
    cytoscape.use( dagre );
  return (
    <div className={styles.dataStructure}>
        
        <CytoscapeComponent elements={elements} style={{ width: '80%', height: '600px' }} layout={layout} cy={setCy}  maxZoom={1}
        minZoom={0.5} classes={null}  stylesheet={[
        {
            selector: 'node',
            style: {
              width: 40,
              height: 40,
              'label': 'data(id)',
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
                "selector": ".highlighted",
                "style": {
                  'background-color': '#61bffc',
                  'line-color': '#61bffc',
                  'target-arrow-color': '#61bffc',
                  'transition-property': 'background-color, line-color, target-arrow-color',
                  'transition-duration': '0.5s'
                }
              },
              {
                "selector": ".past_nodes",
                "style": {
                  'background-color': '#aed7f2',
                  'line-color': '#bbe2fb',
                  'target-arrow-color': '#d4ebfb',
                  'transition-property': 'background-color, line-color, target-arrow-color',
                  'transition-duration': '0.5s'
                  
                }
        }
    ]
        }
        
        ></CytoscapeComponent>

    </div>
  )
}

export default MinHeap