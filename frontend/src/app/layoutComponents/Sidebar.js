'use client'
import Link from "next/link";

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-[250px] transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col items-start justify-start gap-[16px] px-4 py-8 bg-gray-800 text-white font-semibold text-[20px] h-full">
          <Link href="/" onClick={onClose} className="hover:text-gray-400 transition-all duration-300">Home</Link>
          <Link href="/studentlogin" onClick={onClose} className="hover:text-gray-400 transition-all duration-300">Student Login</Link>
          <Link href="/facultyadminlogin" onClick={onClose} className="hover:text-gray-400 transition-all duration-300">Faculty/Admin Login</Link>
          <Link href="/courses" onClick={onClose} className="hover:text-gray-400 transition-all duration-300">View Courses</Link>
        </div>
      </div>
    </>
  )
}
export default Sidebar