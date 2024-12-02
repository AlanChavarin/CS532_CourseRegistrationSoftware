import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDashboard,
  faPlus,
  faBook,
  faUserGraduate,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import LinkMenu from "../helperComponents/LinkMenu";

const linkComponentDataArray = [
  { link: "/admindashboard/addcourse", icon: faPlus, name: "Add Course" },
  { link: "/admindashboard/addfaculty", icon: faPlus, name: "Add Faculty" },
  { link: "/admindashboard/addstudent", icon: faPlus, name: "Add Student" },
  { link: "/admindashboard/addmajor", icon: faPlus, name: "Add Major" },
  {
    link: "/admindashboard/addscheduledcourse",
    icon: faPlus,
    name: "Add Scheduled Course",
  },
  {
    link: "/admindashboard/adddepartment",
    icon: faPlus,
    name: "Add Department",
  },
  { link: "/admindashboard/viewcourses", icon: faBook, name: "View Courses" },
  {
    link: "/admindashboard/viewstudents",
    icon: faUserGraduate,
    name: "View Students",
  },
  {
    link: "/admindashboard/viewfaculty",
    icon: faUserTie,
    name: "View Faculty",
  },
];

function AdminDashboard() {
  return (
    <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 md:p-[32px]">
      <div className="flex flex-row items-center justify-center gap-4 text-[32px] sm:text-[64px]">
        <FontAwesomeIcon icon={faDashboard} />
        <h1 className="font-bold mb-4">Admin Dashboard</h1>
      </div>
      <LinkMenu linkComponentDataArray={linkComponentDataArray} />
    </div>
  );
}
export default AdminDashboard;
