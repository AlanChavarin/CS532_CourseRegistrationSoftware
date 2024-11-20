import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDashboard } from '@fortawesome/free-solid-svg-icons'

function AdminDashboard() {
  return (
    <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 md:p-[32px]">
        <div className="flex flex-row items-center justify-center gap-4 text-[32px] sm:text-[64px]">
            <FontAwesomeIcon icon={faDashboard} />
            <h1 className="font-bold mb-4">Admin Dashboard</h1>
        </div>
    </div>
  )
}
export default AdminDashboard