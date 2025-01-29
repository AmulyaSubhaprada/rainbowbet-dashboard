import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NavBar from './components/NavBar'
import Header from './components/Header'
import RouteConf from './router/RouteConf'

function App() {

  return (
    <div className='w-full h-screen  m-0 p-0 relative   '>
      <Header/>
      <div className='w-full flex' style={{height:"calc(100% - 64px)"}}>
      <div className='w-[200px] h-full'>
      <NavBar/>
      </div>
      <div className=' h-full ' style={{width:"calc(100% - 200px)"}}>
       <RouteConf/>

      </div>
      </div>
    </div>
  )
}

export default App
