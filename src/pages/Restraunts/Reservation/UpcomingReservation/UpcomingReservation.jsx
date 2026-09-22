
export default function UpcomingReservation() {
  return (
    <div className="p-20">
      <div className="bg-white w-full mb-2 p-10  shadow-xl rounded-2xl flex flex-col md:flex-row lg:flex-row card text-grey-darkest">
        <div className="w-full md:w-1/3 lg:w-1/3 md:h-[15rem] lg:h-[20rem]">
          <img
            className="h-1/3 md:h-full lg:h-full w-full rounded-2xl object-cover"
            src={
              data?.restraunt_type === "yelp"
                ? data?.image_url
                : data?.restraunt_type === "resy" &&
                  Array.isArray(data?.images) &&
                  data?.images.length > 0
                ? data?.images[0]
                : data?.photos?.profile?.medium?.url
            }
            alt={data?.name}
          />
        </div>
        <div className="w-full md:w-1/2 lg:w-1/2 flex flex-col px-2  select-none">
          <div className=" p-5 flex-1">
            <h1 className="text-3xl mb-1 font-semibold text-grey-darkest">
              Alice Resturant
            </h1>

            <div className="text-grey-darkest py-8 flex flex-col space-y-4">
              <div>
                <h4 className="font-semibold flex gap-3 items-center text-[1.25rem]">
                  <img
                    src="/assets/calender.png"
                    alt="ratings logo"
                    className="h-5 w-5"
                  />
                  <span>Reserved Date:</span>
                </h4>

                <p className="px-8">
                  4<span className="text-sm sm:text-base">/5</span>
                </p>
              </div>

              <div className="stext-base">
                <h4 className="font-semibold flex gap-3 items-center text-[1.25rem]">
                  <img
                    src="/assets/address.png"
                    alt="address logo"
                    className="h-5 w-5"
                  />
                  <span>Address:</span>
                </h4>
                <p className="px-8"></p>
              </div>
              <div className="pr-2 text-base">
                <h4 className="font-semibold flex gap-3 items-center text-[1.25rem]">
                  <img
                    src="/assets/dinners.png"
                    alt="address logo"
                    className="h-5 w-5"
                  />
                  <span>Number of Dinners:</span>
                </h4>
                <p className="px-8"></p>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden md:block lg:block  border-gray-300  my-6"></div>
        <div className="w-full flex justify-center items-center md:w-[150px] lg:w-[150px] mx-auto md:mx-6 lg:mx-6">
          <div className="flex flex-col justify-between h-full">
            <img
              src={
                data.restraunt_type === "yelp"
                  ? "/assets/yelp_logo_new.png"
                  : data.restraunt_type === "open_table"
                  ? "/assets/opentable.png"
                  : data.restraunt_type === "resy"
                  ? "/assets/resy_logo_new.png"
                  : ""
              }
              alt={`${data.restraunt_type} logo`}
              width={100}
              height={64}
              className="mb-2"
            />

            {/* <div className="flex-grow"></div>
            <div className="bg-grey-lighter  flex items-center justify-between transition hover:bg-grey-light cursor-pointer mt-2">
              <button className="rounded-full p-3 bg-purple-600 text-white ">
                Reserve a Table
              </button>
              <i className="fas fa-chevron-right"></i>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
