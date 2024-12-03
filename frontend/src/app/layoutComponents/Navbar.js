import Link from "next/link";
import SidebarButton from "./SidebarButton";
import { useUser } from "../context/UserContext";

function Navbar() {
  const { user } = useUser();
  return (
    <nav className="flex flex-row justify-between md:justify-center gap-[16px] md:gap-[32px] items-center p-4 bg-gray-800 text-white font-semibold text-[16px] md:text-[20px]">
        <div className="hidden md:flex flex-row gap-[32px]">
            <Link href="/" className="hover:text-gray-400 h-full transition-all duration-300">Home</Link>
            {!user ? <Link href="/userlogin" className="hover:text-gray-400 h-full transition-all duration-300">Login</Link> : <Link href="/logout" className="hover:text-gray-400 h-full transition-all duration-300">Logout</Link>}
            {/* <Link href="/studentlogin" className="hover:text-gray-400 h-full transition-all duration-300">Student Login</Link> */}
            {/* <Link href="/facultyadminlogin" className="hover:text-gray-400 h-full transition-all duration-300">Faculty/Admin Login</Link> */}
            {/* <Link href="/courses" className="hover:text-gray-400 h-full transition-all duration-300">Courses</Link> */}
        </div>
        <SidebarButton />
    </nav>
  )
}
export default Navbar