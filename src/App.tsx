import { BrowserRouter, Route, Routes } from 'react-router-dom'
import DataStructure from './pages/DataStructure/DataStructure'
import GraphAlgorithm from './pages/GraphAlgorithm/GraphAlgorithm'
import Home from './pages/Home/Home'

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App/>}/>
          <Route path='/home' element={<Home/>}/>
          <Route path='/graph-algorithm' element={<GraphAlgorithm/>}/>
          <Route path='/data-structure' element={<DataStructure/>}/>

        </Routes>

      </BrowserRouter>
    </>
  )
}

export default App
