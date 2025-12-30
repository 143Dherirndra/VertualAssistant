import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Customized from './pages/Customized'
import { UserDataContext } from './context/userContext'
import Home from './pages/Home'
import Customized2 from './pages/Customized2'

const App = () => {

  const {userData, setUserData}=useContext(UserDataContext)
  return (

    <Routes>
        {/* <Route path='/' element={(userData?.assistantImage && userData?.assistantName)?
        <Home/>:<Navigate to={'/customized'}/>}/> */}
        <Route path="/"element={userData?.assistantName? <Home />: <Navigate to="/customized" />
  }
/>

      <Route path='/signup' element={!userData ?<Signup/>:<Navigate to={'/customized'}/>}/>
      <Route path='/login' element={!userData?<Login/>:<Navigate to={'/'}/>}/>
      <Route path='/customized' element={userData?<Customized/>:<Navigate to={'/signup'}/>}/>
       <Route path='/customized2' element={userData?<Customized2/>:<Navigate to={'/signup'}/>}/>  
    </Routes>
  )
}

export default App
