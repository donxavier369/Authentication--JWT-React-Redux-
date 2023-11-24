import React from 'react'
import { Router, UNSAFE_DataRouterStateContext, useLocation } from 'react-router-dom'
import Header from '../Header/Header'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import Routers from '../../Containers/routes/Routers'

function Layout() {
  let location = useLocation()
  let adminHeader = location.pathname.startsWith("/admin")
  return (
    <>
        {/* {
            adminHeader ? <Header /> : <Navbar />
        } */}

        <Routers />
        
        {/* {
            adminHeader ? null : <Footer />
        } */}
    </>
  )
}

export default Layout