const ReservationSuccess = ({ formData }) => {
  // console.log(formData)
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-8 text-center max-w-sm">
        <div
          className="flex items-center justify-center w-20 h-20 mx-auto mb-4 shadow-lg bg-plum rounded-full"
          style={{
            boxShadow: "0 4px 15px rgba(128, 0, 128, 0.3)", // Adjust RGBA for lighter plum shadow
          }}
        >
          <img src="/assets/ok.png" alt="" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Your Reservation is Confirmed.
        </h1>
        <p className="mt-2 text-gray-600">
          Please check your email for further details.
        </p>
      </div>
    </div>
  );
};

export default ReservationSuccess;
