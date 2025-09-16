import { useEffect } from 'react';
// import { useNotificationToast } from '@/hooks/useNotificationToast';

const ReservationSuccess = ({ formData }) => {
  // const { showNotification } = useNotificationToast();
  
  // ✅ Notification already sent in main reservation flow, no need to send again
  // This prevents duplicate notifications
  useEffect(() => {
    if (formData) {
      console.log('Reservation success - notification already sent in main flow');
    }
  }, [formData]);

  // console.log(formData)
  return (
    <div className="flex items-center justify-center my-20 md:my-0 p-10 md:p-20">
      <div className="bg-white shadow-md rounded-lg px-10 py-20 md:px-30 md:py-40 text-center md:w-[50%]">
        <div className="flex items-center justify-center w-[6.5rem] h-[6.5rem] mx-auto mb-8 shadow-lg bg-[#ebd4ff] rounded-full">
          <div className="flex items-center justify-center w-20 h-20 mx-auto shadow-lg bg-plum rounded-full">
            <img src="/assets/ok.png" alt="" />
          </div>
        </div>

        <h1 className="text-2xl md:text-[2.25rem] font-semibold text-gray-800">
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
