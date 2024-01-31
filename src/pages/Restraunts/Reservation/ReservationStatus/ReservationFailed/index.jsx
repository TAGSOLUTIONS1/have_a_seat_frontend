const ReservationFailed = ({ formData }) => {
  console.log(formData)
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="max-w-3xl  w-full mx-4 md:mx-auto rounded-lg overflow-hidden shadow-lg bg-white flex md:flex-row flex-col">
        <div className="md:w-1/2 px-6 py-8 mt-12 md:p-12">
          <div className="text-center md:text-left">
            <h2 className="font-bold text-3xl text-red-600 mb-4">
              Oops! Reservation Failed
            </h2>
            <p className="text-gray-700 text-base">
              We apologize, there was an issue processing your reservation due
              to some confidential reasons. Please try again later.
            </p>
          </div>
        </div>
        <div className="md:w-1/2 block md:flex lg:flex text-center justify-center space-x-8 items-center">
          <div>
            <div>
              <h1 className="font-bold text-lg">Email</h1>
              <h3 className="text-md mb-1">
                {formData?.email}
              </h3>
            </div>
            <div>
              <h1 className="font-bold text-lg">Name</h1>
              <h3 className="text-md mb-1">
                {formData?.first_name} {""}{" "}
                {formData?.last_name}
              </h3>
            </div>
            <div>
              <h1 className="font-bold text-lg">Phone Number</h1>
              <h3 className="text-md">
                {formData?.reservationFormData?.phone}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationFailed;
