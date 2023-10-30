import './App.css'
import { Button } from '@chakra-ui/react'
import HomePage from './Pages/HomePage'
import ChatPage from './Pages/ChatPage'
import { Route,Routes } from 'react-router-dom'
// import Ab from './Ab'


function App() {

  return (
    <div className="App">
    <Routes>
      <Route path='/' element = {<HomePage/>}></Route>
      <Route path='/chats' element = {<ChatPage/>}></Route>
      {/* <Route path='/a' element = {<Ab/>}></Route> */}
    </Routes>
       
    </div>
  )
}

export default App



