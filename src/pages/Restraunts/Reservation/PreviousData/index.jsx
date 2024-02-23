import { useEffect, useState } from "react";

const PreviousData = ({ formData, bookingInfo }) => {
  const [prePopulatedData, setPrePopulatedData] = useState();
  useEffect(() => {
    if (Array.isArray(formData) && formData.length > 0) {
      console.log(formData[0]);
      setPrePopulatedData(formData[0]);
      return;
    }
  }, [formData]);

  return (
    <>
      <div className="bg-white p-8 rounded shadow-md">
        <h2 className="text-3xl font-bold text-center pb-8">
          Booking Details
        </h2>
        <form>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col">
              <label
                htmlFor="date"
                className="text-sm font-medium text-gray-700"
              >
                Date:
              </label>
              <input
                disabled
                id="date"
                value={
                  prePopulatedData?.reservation_date
                    ? prePopulatedData?.reservation_date
                    : bookingInfo?.formattedDate
                }
                name="date"
                className="w-full px-3 py-2 rounded border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="persons"
                className="text-sm font-medium text-gray-700"
              >
                Persons:
              </label>
              <input
                disabled
                id="persons"
                name="persons"
                value={
                  prePopulatedData?.reservation_covers
                    ? prePopulatedData?.reservation_covers
                    : bookingInfo?.formattedCovers
                }
                className="w-full px-3 py-2 rounded border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="timeSlot"
                className="text-sm font-medium text-gray-700"
              >
                Time Slot:
              </label>
              <select
                disabled
                id="timeSlot"
                name="timeSlot"
                className="w-full px-3 py-2 rounded border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50"
              >
                <option value="" disabled></option>
                <option value="12PM-1PM">
                  {prePopulatedData?.reservation_time
                    ? prePopulatedData?.reservation_time
                    : bookingInfo?.formattedTime}
                </option>
              </select>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default PreviousData;
