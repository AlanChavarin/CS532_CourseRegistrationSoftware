'use client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/free-solid-svg-icons"
import Sidebar from "./Sidebar"
import { useState } from "react"

function SidebarButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="text-[24px] md:hidden z-50 relative"
      >
        <FontAwesomeIcon icon={faBars} />
      </button>

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-[250px] transform transition-transform duration-300 ease-in-out md:hidden ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </>
  )
}
export default SidebarButton