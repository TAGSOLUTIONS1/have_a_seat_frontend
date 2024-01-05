
interface YelpBookingInfoProps {
  bookingInfo: any;
}

  const YelpBookingInfo: React.FC<YelpBookingInfoProps> = ({ bookingInfo }) => {
  // console.log(bookingInfo);
  return (
    <div className="flex justify-center">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6 pt-[-4] pb-[-6] rounded-lg shadow-lg">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-8 ">
          <h2 className=" text-white text-3xl font-bold text-center pb-6">Booking Info</h2>
          <div className="mb-4">
            <img
              src={bookingInfo?.avatars["120s"]?.src}
              alt={bookingInfo?.avatars["120s"]?.altText}
              height={'150px'}
              width={'150px'}
              className="mx-auto rounded-full border-2 border-white"
            />
          </div>
          <div className="text-white flex flex-col space-y-6">
          <div className="pl-6 flex flex-col text-gray-800">
              <h3 className="text-white text-lg mb-4 font-bold">Reservation Details:</h3>
              <div className="flex space-x-24">
                <h3 className="text-white text-md font-semibold">Name:</h3>
                <p className="text-white ">{bookingInfo?.restaurant?.name}</p>
              </div>
              <div  className="flex space-x-20">
                <h3 className="text-white text-md font-semibold">Address:</h3>
                <p className="text-white ">{bookingInfo?.restaurant?.address}</p>
              </div>
              <div  className="flex space-x-20">
                <h3 className="text-white text-md font-semibold">Contact:</h3>
                <p className="text-white" >{bookingInfo?.restaurant?.phone}</p>
              </div>
            </div>
            <div className=" pl-6 flex flex-col text-gray-800">
              <h3 className="text-white text-lg text-center mb-4 font-bold">Reservation Details:</h3>
              <div className="flex space-x-32">
                <h3 className="text-white text-md font-semibold">Date:</h3>
                <p className="text-white ">{bookingInfo?.formattedDate}</p>
              </div>
              <div  className="flex space-x-28">
                <h3 className="text-white text-md font-semibold">Persons:</h3>
                <p className="text-white ">{bookingInfo?.formattedCovers}</p>
              </div>
              <div  className="flex space-x-24">
                <h3 className="text-white text-md font-semibold">Time Slot:</h3>
                <p className="text-white" >{bookingInfo?.formattedTime}</p>
              </div>
            </div>
            <div className="flex flex-col text-gray-800">
              <h3 className="text-white text-lg text-center mb-4 font-bold">Categories:</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {bookingInfo?.restaurant.categories.map((category:any, index:any) => (
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
      </div>
    </div>
  );
};

export default YelpBookingInfo;
