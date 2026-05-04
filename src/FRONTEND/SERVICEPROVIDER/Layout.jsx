import React from 'react'
import Header1 from "./Header1"
import Footer from './Footer'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <>
      <Header1 />
      <Outlet />   {/* THIS SHOWS PAGES */}
      <Footer />
    </>
  )
}

export default Layout