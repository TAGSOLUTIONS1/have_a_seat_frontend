const ReservationSuccessfull = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="max-w-3xl w-full mx-4 md:mx-auto rounded-lg overflow-hidden shadow-lg bg-white flex md:flex-row flex-col-reverse">
        <div className="md:w-1/2 px-6 py-8 mt-12 md:p-12">
          <div className="text-center md:text-left">
            <h2 className="font-bold text-3xl text-green-600 mb-4">
              Reservation Successful!
            </h2>
            <p className="text-gray-700 text-base">
              Your reservation has been successfully processed. We look forward
              to serving you!
            </p>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center items-center">
          <img
            src="https://media.istockphoto.com/id/1219181841/vector/approved-stamp.jpg?b=1&s=612x612&w=0&k=20&c=LaL6GCc4n0NUw6HMSJWB2zfoUvlxB9h3NUjSlxYoGmU="
            alt="Clipart"
            className="w-80 md:w-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default ReservationSuccessfull;
