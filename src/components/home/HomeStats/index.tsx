import { ChefHatIcon, Trophy, User, Users } from "lucide-react";

const HomeStats = () => {

  return (
    <section className="w-full h-screen mt-64 mb-28">
      <div className="relative w-full lg:p-0 lg:mx-auto h-[650px] bg-[url('/assets/reservation_bg.jpg')] bg-no-repeat bg-cover bg-center flex items-center justify-center">
        <div className="absolute w-full h-full bg-primary opacity-40"></div>
        <div className="flex flex-col sm:flex-row md:flex-row lg:flex-row items-center justify-center">
          <div className="relative rounded-full overflow-hidden m-4">
            <div className="absolute inset-0 bg-purple-600 opacity-60 border-4 border-white rounded-full"></div>
            <div className="bg-transparent text-white sm:text-xl md:text-4xl text-center rounded-full sm:w-32 md:w-44 md:h-44 sm:h-32 flex items-center justify-center relative z-10">
              85,000+
            </div>
          </div>
          <div className="relative sm:top-16 sm:right-[106px]  md:top-24  md:right-[135px]">
            <div className="bg-purple-600 rounded-full border-white border-2 sm:w-12 sm:h-12 md:w-14 md:h-14  p-2">
              <User className="text-white sm:ml-0 sm:mt-0  md:mt-2 md:ml-2" />
            </div>
          </div>
          <div className="relative rounded-full overflow-hidden m-4">
            <div className="absolute inset-0 bg-purple-600 opacity-60 border-4 border-white rounded-full"></div>
            <div className="bg-transparent text-white sm:text-xl md:text-4xl text-center rounded-full sm:w-32 md:w-44 md:h-44 sm:h-32 flex items-center justify-center relative z-10">
             150+
            </div>
          </div>
          <div className="relative sm:top-16 sm:right-[106px]  md:top-24  md:right-[135px]">
            <div className="bg-purple-600 rounded-full border-white border-2 sm:w-12 sm:h-12 md:w-14 md:h-14  p-2">
              <ChefHatIcon className="text-white sm:ml-0 sm:mt-0  md:mt-2 md:ml-2" />
            </div>
          </div>
          <div className="relative rounded-full overflow-hidden m-4">
            <div className="absolute inset-0 bg-purple-600 opacity-60 border-4 border-white rounded-full"></div>
            <div className="bg-transparent text-white sm:text-xl md:text-4xl text-center rounded-full sm:w-32 md:w-44 md:h-44 sm:h-32 flex items-center justify-center relative z-10">
              72,000+
            </div>
          </div>
          <div className="relative sm:top-16 sm:right-[106px]  md:top-24  md:right-[135px]">
            <div className="bg-purple-600 rounded-full border-white border-2 sm:w-12 sm:h-12 md:w-14 md:h-14  p-2">
              <Users className="text-white sm:ml-0 sm:mt-0  md:mt-2 md:ml-2" />
            </div>
          </div>
          <div className="relative rounded-full overflow-hidden m-4">
            <div className="absolute inset-0 bg-purple-600 opacity-60 border-4 border-white rounded-full"></div>
            <div className="bg-transparent text-white sm:text-xl md:text-4xl text-center rounded-full sm:w-32 md:w-44 md:h-44 sm:h-32 flex items-center justify-center relative z-10">
              32+
            </div>
          </div>
          <div className="relative sm:top-16 sm:right-[106px]  md:top-24  md:right-[135px]">
            <div className="bg-purple-600 rounded-full border-white border-2 sm:w-12 sm:h-12 md:w-14 md:h-14  p-2">
              <Trophy className="text-white sm:ml-0 sm:mt-0  md:mt-2 md:ml-2" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeStats;