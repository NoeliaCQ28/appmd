import { FaFilter } from "react-icons/fa6";

export const Filter = () => {
  return (
     <button className="flex items-center bg-gray-50 p-2 rounded-md space-x-2 border w-24 justify-center">
          <FaFilter color="gray" />
          <span className="text-gray-900 text-lg">Filtro</span>
     </button>
  )
}
