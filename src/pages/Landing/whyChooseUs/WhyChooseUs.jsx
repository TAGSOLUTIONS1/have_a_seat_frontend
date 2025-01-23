import StepComponent from "./StepComponent";

const WhyChooseUs = () => {
  return (
    <section className=" p-10 md:p-20 font-inter" id="why">
      <div className="max-w-[1200px] mx-auto justify-between flex flex-col gap-5 md:flex-row items-center ">
        <div className="">
          <StepComponent />
        </div>
    
       <div className="">
        <img src="/assets/why.png" alt="" className="h-[400px] md:h-[530px] xl:h-[570px] mx-auto" />
       </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
