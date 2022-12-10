import { BrowserRouter, Route, Routes } from 'react-router-dom'
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
        </Routes>

      </BrowserRouter>
    </>
  )
}

export default App
