'use client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBook, faGraduationCap, faComputer, faDashboard, faBuilding, faSearch, faChalkboardTeacher } from "@fortawesome/free-solid-svg-icons";
import LinkMenu from "./helperComponents/LinkMenu";
import { useUser } from "./context/UserContext";

const linkComponentDataArray = [
  {link: "/courses", icon: faBook, name: "View Courses"},
  {link: "/majors", icon: faGraduationCap, name: "View Majors"},
  {link: "/departments", icon: faBuilding, name: "View Departments"},
  {link: "/studentNotes", icon: faSearch, name: "Student Notes Search"},
  {link: "/students", icon: faUser, name: "Student Search"},
  {link: "/faculty", icon: faUser, name: "Faculty Search"},
  {link: "/scheduledCourses", icon: faBook, name: "Scheduled Course Search"},
  {link: "/users", icon: faUser, name: "User Search"},
  
]

const linkMenuForFaculty = [
  {link: "/facultyDashboard", icon: faChalkboardTeacher, name: "Faculty Dashboard"},
  {link: "/admindashboard", icon: faDashboard, name: "Admin Dashboard"},
]

const linkMenuForStudent = [
  {link: "/scheduledCourses", icon: faBook, name: "Scheduled Course Search / Registration"},
  {link: "/studentDashboard", icon: faGraduationCap, name: "Student Dashboard"},
]

export default function Home() {
  const { user } = useUser();

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


      {user && <>
        {user.address && <LinkMenu linkComponentDataArray={linkMenuForStudent} />}
        {user.officeNumber && <LinkMenu linkComponentDataArray={linkMenuForFaculty} />}
        <div className="w-full h-[2px] bg-black my-4"></div>
      </> 
      }

      <LinkMenu linkComponentDataArray={linkComponentDataArray} />
    </div>
  );
}