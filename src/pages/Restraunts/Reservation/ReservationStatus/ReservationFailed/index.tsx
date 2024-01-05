const ReservationFailed = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="max-w-3xl w-full mx-4 md:mx-auto rounded-lg overflow-hidden shadow-lg bg-white flex md:flex-row flex-col-reverse">
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
        <div className="md:w-1/2 flex justify-center items-center">
          <img
            src="https://png.pngtree.com/png-clipart/20230429/original/pngtree-failed-stamp-png-image_9122885.png"
            alt="Clipart"
            className="w-80 md:w-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default ReservationFailed;
