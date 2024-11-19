'use client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBook, faGraduationCap, faComputer } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 md:p-[128px]">
      <div className="flex flex-row items-center justify-between max-w-[700px] w-full gap-8 md:gap-0">
        <h1 className="text-[32px] md:text-[64px] font-bold mb-4 md:mb-[128px] text-left">
          Course <br />
          Registration <br />
          Software
        </h1>
        <FontAwesomeIcon icon={faComputer} className="text-[100px] md:text-[160px]"/>
      </div>
      <div className="flex flex-col md:flex-row items-stretch justify-center gap-[16px] w-full max-w-[1000px]">
        <Link href="/studentlogin" className="flex flex-1 items-center justify-centers gap-[16px] text-[20px] md:text-[24px] hover:text-gray-400 cursor-pointer flex-col p-6 hover:p-8 rounded-lg border-[2px] border-black hover:border-gray-400 w-full md:min-w-[150px] transition-all duration-300">
            <FontAwesomeIcon icon={faGraduationCap} className="text-[48px] md:text-[64px]"/>
            <div className="text-center whitespace-nowrap">
              Student Login
            </div>
        </Link>
        <Link href="/facultyadminlogin" className="flex flex-1 items-center justify-center gap-[16px] text-[20px] md:text-[24px] hover:text-gray-400 cursor-pointer flex-col p-6 hover:p-8 rounded-lg border-[2px] border-black hover:border-gray-400 w-full md:min-w-[150px] transition-all duration-300">
            <FontAwesomeIcon icon={faUser} className="text-[48px] md:text-[64px]"/>
            <div className="text-center whitespace-nowrap">
              Faculty/Admin Login
            </div>
        </Link>
        <Link href="/courses" className="flex flex-1 items-center justify-center gap-[16px] text-[20px] md:text-[24px] hover:text-gray-400 cursor-pointer flex-col p-6 hover:p-8 rounded-lg border-[2px] border-black hover:border-gray-400 w-full md:min-w-[150px] transition-all duration-300">
            <FontAwesomeIcon icon={faBook} className="text-[48px] md:text-[64px]"/>
            <div className="text-center whitespace-nowrap">
              View Courses
            </div>
        </Link>
      </div>
    </div>
  );
}
