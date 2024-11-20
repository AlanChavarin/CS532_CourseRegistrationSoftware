import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

function LinkMenu({linkComponentDataArray}) {
  return (
    <div className="flex flex-col md:flex-row items-stretch justify-center gap-[16px] w-full max-w-[1000px] flex-wrap">
        {linkComponentDataArray.map((linkComponentData) => (
            <Link key={linkComponentData.link} href={linkComponentData.link} className="flex flex-1 items-center justify-centers gap-[16px] text-[20px] md:text-[24px] hover:text-gray-400 cursor-pointer flex-col p-6 hover:p-8 rounded-lg border-[2px] border-black hover:border-gray-400 w-full md:min-w-[250px] transition-all duration-300">
                <FontAwesomeIcon icon={linkComponentData.icon} className="text-[48px] md:text-[64px]"/>
                <div className="text-center whitespace-nowrap">
                    {linkComponentData.name}
                </div>      
            </Link>
        ))}
    </div>  
  )
}
export default LinkMenu