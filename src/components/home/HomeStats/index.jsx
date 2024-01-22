import { ChefHatIcon, Trophy, User, Users } from "lucide-react";

const HomeStats = () => {
  return (
    <section className="w-full h-screen mt-64 mb-28">
      <div className="relative w-full lg:p-0 lg:mx-auto h-[650px] bg-[url('/assets/reservation_bg.jpg')] bg-no-repeat bg-cover bg-center flex items-center justify-center">
        <div className="absolute w-full h-full bg-primary opacity-40"></div>
        <div className="flex flex-col md:flex-row lg:flex-row items-center justify-center">
          <div className="relative rounded-full overflow-hidden m-2 w-[130px] lg:w-auto md:w-auto">
            <div className="absolute inset-0 bg-purple-600 opacity-60 border-4 border-white rounded-full"></div>
            <div className="bg-transparent text-white text-center rounded-full w-32 md:w-44 h-32 md:h-44 flex items-center justify-center relative z-10">
              85,000+
            </div>
            <div className="bg-purple-600 rounded-full border-white border-2 w-12 h-12 md:w-14 md:h-14 p-2 absolute bottom-0 right-[43px] md:right-[60px] lg:right-[60px]">
              <User className="text-white ml-2 mt-2 md:ml-2 md:mt-2" />
            </div>
          </div>
          <div className="relative rounded-full overflow-hidden m-2 w-[130px] lg:w-auto md:w-auto">
            <div className="absolute inset-0 bg-purple-600 opacity-60 border-4 border-white rounded-full"></div>
            <div className="bg-transparent text-white text-center rounded-full w-32 md:w-44 h-32 md:h-44 flex items-center justify-center relative z-10">
              150+
            </div>
            <div className="bg-purple-600 rounded-full border-white border-2 w-12 h-12 md:w-14 md:h-14 p-2 absolute bottom-0 right-[43px] md:right-[60px] lg:right-[60px]">
              <ChefHatIcon className="text-white ml-2 mt-2 md:ml-2 md:mt-2" />
            </div>
          </div>
          <div className="relative rounded-full overflow-hidden m-2 w-[130px] lg:w-auto md:w-auto">
            <div className="absolute inset-0 bg-purple-600 opacity-60 border-4 border-white rounded-full"></div>
            <div className="bg-transparent text-white text-center rounded-full w-32 md:w-44 h-32 md:h-44 flex items-center justify-center relative z-10">
              72,000+
            </div>
            <div className="bg-purple-600 rounded-full border-white border-2 w-12 h-12 md:w-14 md:h-14 p-2 absolute bottom-0 right-[43px] md:right-[60px] lg:right-[60px]">
              <Users className="text-white ml-2 mt-2 md:ml-2 md:mt-2" />
            </div>
          </div>
          <div className="relative rounded-full overflow-hidden m-2 w-[130px] lg:w-auto md:w-auto">
            <div className="absolute inset-0 bg-purple-600 opacity-60 border-4 border-white rounded-full"></div>
            <div className="bg-transparent text-white text-center rounded-full w-32 md:w-44 h-32 md:h-44 flex items-center justify-center relative z-10">
              32+
            </div>
            <div className="bg-purple-600 rounded-full border-white border-2 w-12 h-12 md:w-14 md:h-14 p-2 absolute bottom-0 right-[43px] md:right-[60px] lg:right-[60px]">
              <Trophy className="text-white ml-2 mt-2 md:ml-2 md:mt-2" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeStats;
