import { useEffect , useState } from "react";

interface PreviousProps {
    formData: any;
}

const PreviousData:React.FC<PreviousProps> = ({formData}) => {
    const [prePopulatedData , setPrePopulatedData] = useState<any>()
    useEffect(() => {
        if (Array.isArray(formData) && formData.length > 0) {
          console.log(formData[1]);
          setPrePopulatedData(formData[1])
        }
      }, [formData]);
  return (
    <>
    <div className="bg-white p-8 rounded shadow-md">
    <h2 className="text-3xl font-bold text-center pb-8">Previous Details</h2>
      <form>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <label htmlFor="date" className="text-sm font-medium text-gray-700">
              Date:
            </label>
            <input
              disabled
              type="date"
              id="date"
              value={prePopulatedData?.reservation_date || ''}
              name="date"
              className="w-full px-3 py-2 rounded border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="persons" className="text-sm font-medium text-gray-700">
              Persons:
            </label>
            <input
              disabled
              type="number"
              id="persons"
              name="persons"
              value={prePopulatedData?.reservation_covers || ''}
              className="w-full px-3 py-2 rounded border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="timeSlot" className="text-sm font-medium text-gray-700">
              Time Slot:
            </label>
            <select
              disabled
              id="timeSlot"
              name="timeSlot"
              className="w-full px-3 py-2 rounded border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50"
            >
              <option value="" disabled >
              </option>
              <option value="12PM-1PM">{prePopulatedData?.reservation_time || ''}</option>
            </select>
          </div>
          {/* <button
            type="submit"
            className="inline-flex justify-center items-center px-4 py-2 text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-800"
          >
            Make a Reservation
          </button> */}
        </div>
      </form>
    </div>

</>
  )
}

export default PreviousData