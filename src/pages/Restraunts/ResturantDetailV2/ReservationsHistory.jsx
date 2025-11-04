import React, { useState } from 'react'
import { FaHeart } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import CancelReservation from './CancelReservation';
import ReviewModal from '@/components/common/ReviewModal';

export default function ReservationsHistory({reservations, onRefresh}) {
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);
    
    const now = new Date();
    const pastReservations = reservations.filter(
    (reservation) => new Date(reservation.reservation_date) < now
  );
  const upcomingReservations = reservations.filter(
    (reservation) => new Date(reservation.reservation_date) >= now
  );

  const handleCancel = (cancelledReservation) => {
    alert(`Reservation at ${cancelledReservation?.restaurant_name} cancelled!`);
  };

  const handleLeaveReview = (reservation) => {
    setSelectedReservation(reservation);
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmitted = () => {
    // Refresh the reservations list if callback provided
    if (onRefresh) {
      onRefresh();
    }
  };
  
  return (
<>

<div className="my-4">
    <div className="flex flex-col md:flex-row justify-between items-center">
      <p className='font-bold text-4xl text-center md:text-left font-agrandir text-shipGrey my-4'>Upcoming Reservations</p>
    <Link className='bg-plum p-3 px-4 rounded-full font-agrandir font-bold text-base text-white' to="/user-profile">
    Go to your Dining Insights
    </Link>
    </div>
  {upcomingReservations.length >0? upcomingReservations.map((reservation) =>(
      <div className="bg-white w-full mb-2 p-10  shadow-xl rounded-2xl flex flex-col md:flex-row lg:flex-row card text-grey-darkest">
    <div className="w-full md:w-1/3 lg:w-1/3 md:h-[15rem] lg:h-[20rem] flex rounded-lg items-center justify-center bg-[#F5EDFC] relative overflow-hidden">
      
    <div className="absolute inset-0 flex items-center justify-center text-[10rem] font-bold text-plum opacity-20">
      {reservation?.restaurant_name
        ?.split(' ')
        .slice(0,2)
        .map(word => word[0])
        .join('')
        .toUpperCase()}
    </div>

  
  </div>

      <div className="w-full md:w-1/2 lg:w-1/2 flex flex-col px-2  select-none">
        <div className="">
          <h1 className="text-3xl mb-1 font-semibold text-grey-darkest">
            {reservation?.restaurant_name}
          </h1>

          <div className="text-grey-darkest py-8 flex flex-col space-y-4">
            <div>
              <h4 className="font-semibold flex gap-3 items-center ">
                <img
                  src="/assets/calender.png"
                  alt="ratings logo"
                  className="h-4 w-4 md:h-5 md:w-5"
                />
                <span className='text-base md:text-[1.25rem]'>Reservation Date:</span>
              </h4>

              <p className="px-8 text-sm md:text-base">
    {new Date(reservation?.reservation_date).toLocaleString()}
              </p>
            </div>

            <div className="stext-base">
              <h4 className="font-semibold flex gap-3 items-center ">
                <img
                  src="/assets/address.png"
                  alt="address logo"
                  className="h-4 w-4 md:h-5 md:w-5"
                />
                <span className='text-base md:text-[1.25rem]'>Address:</span>
              </h4>
              <p className="px-8 text-sm md:text-base">
              {reservation?.location}

              </p>
            </div>
            <div className="pr-2 text-base">
              <h4 className="font-semibold flex gap-3 items-center ">
                <img
                  src="/assets/dinners.png"
                  alt="address logo"
                  className="h-4 w-4"
                />
                <span className='text-base md:text-[1.25rem]'>Number of Dinners:</span>
              </h4>
              <p className="px-8 text-sm md:text-base">
              {reservation?.num_diners} <span className='mx-1'>persons</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden md:block lg:block  border-gray-300  my-6"></div>
      <div className="w-full flex justify-center items-center md:w-[150px] lg:w-[150px] mx-auto md:mx-6 lg:mx-6">
        <div className="flex flex-col justify-between h-full">
          <img
            src={
              reservation?.reservation_type === "YELP"
                ? "/assets/yelp_logo_new.png"
                : reservation?.reservation_type === "OPENTABLE"
                ? "/assets/opentable.png"
                : reservation?.reservation_type === "RESY"
                ? "/assets/resy_logo_new.png"
                : ""
            }
            alt={`${reservation.restraunt_type} logo`}
            width={100}
            height={64}
            className="mb-2"
          />

          <div className="flex-grow"></div>
          {new Date (reservation?.reservation_date) < new Date() &&  <div className="bg-grey-lighter  flex items-center justify-between transition hover:bg-grey-light cursor-pointer mt-2">
            <button className="rounded-full p-3 bg-plum text-white ">
              <span>Reserve again</span>
            </button>
            <i className="fas fa-chevron-right"></i>
          </div>}

          {new Date(reservation?.reservation_date) >= new Date() && (
              <CancelReservation
                reservation={reservation}
                onCancel={handleCancel}
              />
            )}

        </div>
      </div>
    </div>
    )): <h4 className='text-lg text-center md:text-left text-plum font-agrandir italic p-5 '>No Up Coming Reservation</h4>}

</div>
<div className='sm:my-8 md:my-12'>
<h1 className='font-bold text-4xl font-agrandir text-shipGrey my-4'>Past Reservations</h1>
  {pastReservations.length>0 ? pastReservations.map((reservation) => (
    <div className="bg-white w-full mb-2 p-10 shadow-xl rounded-2xl flex flex-col md:flex-row lg:flex-row text-grey-darkest">

      <div className="w-full md:w-1/3 lg:w-1/3 md:h-[15rem] lg:h-[20rem] flex items-center rounded-lg justify-center bg-[#F5EDFC] relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-[10rem] font-bold text-plum opacity-20">
          {reservation?.restaurant_name
            ?.split(' ')
            .slice(0, 2)
            .map(word => word[0])
            .join('')
            .toUpperCase()}
        </div>
      </div>

      {/* Reservation Details */}
      <div className="w-full md:w-1/2 lg:w-1/2 flex flex-col px-0 sm:px-4 xl:px-2 select-none">
        <div className="">
          <p className="text-4xl mb-1 font-bold text-shipGrey font-agrandir">
            {reservation?.restaurant_name}
          </p>

          <div className="text-grey-darkest py-8 flex flex-col space-y-4">
            {/* Reservation Date */}
            <div>
              <p className="font-semibold flex gap-3 items-center text-base">
                <img src="/assets/calender.png" alt="calendar logo" className="h-5 w-5" />
                <span className="font-roboto font-semibold text-xl text-shipGrey">Reservation Date:</span>
              </p>
              <p className="px-8">{new Date(reservation?.reservation_date).toLocaleString()}</p>
            </div>

            {/* Address */}
            <div className="text-base">
              <p className="font-semibold flex gap-3 items-center text-base">
                <img src="/assets/address.png" alt="address logo" className="h-5 w-5" />
                <span className="font-roboto font-semibold text-xl text-shipGrey">Address:</span>
              </p>
              <p className="px-8 text-sm md:text-base">{reservation?.location}</p>
            </div>

            {/* Number of Diners */}
            <div className="pr-2 text-base">
              <p className="font-semibold flex gap-3 items-center text-base">
                <img src="/assets/dinners.png" alt="dinners logo" className="h-4 w-4" />
                <span className="font-roboto font-semibold text-xl text-shipGrey">Number of Diners:</span>
              </p>
              <p className="px-8">
                {reservation?.num_diners} <span className="mx-1 text-sm md:text-base">persons</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Divider for Desktop */}
      <div className="hidden md:block lg:block border border-gray-300 my-6 h-full"></div>

      {/* Reservation Actions */}
      <div className="w-full flex justify-center items-center md:w-[330px]">
        <div className="flex flex-col justify-between items-center h-full">
          {/* Reservation Platform Logo */}
          <img
            src={
              reservation?.reservation_type === "YELP"
                ? "/assets/yelp_logo_new.png"
                : reservation?.reservation_type === "OPENTABLE"
                ? "/assets/opentable.png"
                : reservation?.reservation_type === "RESY"
                ? "/assets/resy_logo_new.png"
                : ""
            }
            alt={`${reservation?.restaurant_type} logo`}
            width={100}
            height={64}
            className="mb-2"
          />

          {/* Reserve Again & Leave Review Buttons */}
          {new Date(reservation?.reservation_date) < new Date() && (
            <div className="bg-grey-lighter flex flex-col md:flex-row items-center justify-center transition hover:bg-grey-light cursor-pointer mt-2 gap-3 p-2 rounded-lg">
              <button className="text-sm font-agrandir px-4 py-2 bg-plum text-white rounded-lg hover:bg-purple-700 transition-colors">
                Reserve Again
              </button>
              <button 
                onClick={() => handleLeaveReview(reservation)}
                className="flex gap-2 text-sm font-agrandir px-4 py-2 bg-plum text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <FaHeart size={17} color='#ffffff'></FaHeart>
                Leave Review
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )):<h4 className='text-lg text-center md:text-left text-plum font-agrandir italic p-5 '>No Past Reservation</h4>}

</div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setSelectedReservation(null);
        }}
        reservation={selectedReservation}
        onReviewSubmitted={handleReviewSubmitted}
      />

</>
  )
}
