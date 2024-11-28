import { whyUs } from "../../../components/constants/constants";
const WhyChooseUs = () => {
  return (
    <section className="bg-lightGrey p-20 font-inter" id="why">
      <div className="max-w-[1200px] mx-auto text-center">
        <div className="flex flex-col gap-7">
          <h2 className="text-plum text-[30px] md:text-[44px]  font-bold">
            Why choose us
          </h2>
          <p className="text-shipGrey text-xl ">
            From search to booking, we make reserving a table quick and
            effortless
          </p>
        </div>

        <div className="pt-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Item 1 */}
            {whyUs.map((why, index) => (
              <div className="text-center" key={why}>
                <div className="flex justify-center items-center  rounded-full w-[160px] h-[160px] border border-plum mx-auto mb-4">
                  <img src={why.icon} alt="icon " />
                </div>
                <h3 className="text-plum font-bold text-xl">
                  {index + 1}. {why.title}
                </h3>
                <p className="text-shipGrey text-lg mt-1">{why.descrp}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
