import { useUser } from '../context/UserContext'

function Footer() {

  const { user } = useUser();
  

  return (
    <footer className="flex flex-col justify-center items-center p-4 bg-gray-800 text-white">
        <p>Copyright &copy; 2024 Course Registration Software</p>
        {user && <p className="text-[16px] font-bold">Logged in as {user.name}</p>}
    </footer>
  )
}
export default Footer