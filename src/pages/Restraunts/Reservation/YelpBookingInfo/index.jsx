const YelpBookingInfo = ({ bookingInfo }) => {
  return (
    <>
      <div className="flex flex-col md:flex-row lg:flex-row w-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg shadow-lg">
        <div className="w-full md:w-1/3 lg:w-1/3">
          <div>
            <img
              src={bookingInfo?.avatars["120s"]?.src}
              alt={bookingInfo?.avatars["120s"]?.altText}
              height={"255px"}
              className="object-cover w-full md:w-[255px] lg:w-[255px]"
              style={{
                borderTopLeftRadius: "8px",
                borderBottomLeftRadius:"8px"
              }}
            />
          </div>
        </div>
        <div className="w-2/3  p-6">
          <h3 className="text-white text-center mr-24 text-2xl mb-4 font-bold">
            Reservation Details:
          </h3>
          <div className="flex">
            <div className=" flex flex-col text-gray-800">
              <div className="md:flex lg:flex md:space-x-20 lg:space-x-20">
                <h3 className="text-white text-md font-semibold">Date:</h3>
                <p className="text-white ">{bookingInfo?.formattedDate}</p>
              </div>
              <div className="md:flex lg:flex md:space-x-16 lg:space-x-16">
                <h3 className="text-white text-md font-semibold">Persons:</h3>
                <p className="text-white ">{bookingInfo?.formattedCovers}</p>
              </div>
              <div className="md:flex lg:flex md:space-x-12 lg:space-x-12">
                <h3 className="text-white text-md font-semibold">Time Slot:</h3>
                <p className="text-white">{bookingInfo?.formattedTime}</p>
              </div>
            </div>
            <div className="ml-8 flex flex-col  text-gray-800">
              <div className="md:flex lg:flex md:space-x-14 lg:space-x-14">
                <h3 className="text-white text-md font-semibold">Name:</h3>
                <p className="text-white ">{bookingInfo?.restaurant?.name}</p>
              </div>
              <div className="md:flex lg:flex md:space-x-10 lg:space-x-10">
                <h3 className="text-white text-md font-semibold">Address:</h3>
                <p className="text-white ">
                  {bookingInfo?.restaurant?.address}
                </p>
              </div>
              <div className="md:flex lg:flex md:space-x-10 lg:space-x-10">
                <h3 className="text-white text-md font-semibold">Contact:</h3>
                <p className="text-white">{bookingInfo?.restaurant?.phone}</p>
              </div>
            </div>
          </div>
          <div className=" flex flex-col mt-2 text-gray-800">
            <div>
              <h3 className="text-white text-lg mb-4 font-bold">Categories:</h3>
            </div>
            <div className="flex flex-wrap  gap-2">
              {bookingInfo?.restaurant.categories.map((category, index) => (
                <span
                  key={index}
                  className="px-2 py-1 border-2 border-white bg-purple-600 text-white rounded-full text-sm"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default YelpBookingInfo;
