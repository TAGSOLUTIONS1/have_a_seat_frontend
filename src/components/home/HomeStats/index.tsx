// import { ChefHatIcon, Trophy, User, Users } from "lucide-react";

// const HomeStats = () => {
//   return (
//     <section className="w-full h-screen mt-64 mb-28">
//       <div className="relative w-full lg:p-0 lg:mx-auto h-[650px] bg-[url('/assets/reservation_bg.jpg')] bg-no-repeat bg-cover bg-center flex items-center justify-center">
//         <div className="absolute w-full h-full bg-primary opacity-40"></div>
//         <div className="flex items-center justify-center">
//           <div className="relative rounded-full overflow-hidden m-4">
//             <div className="absolute inset-0 bg-purple-600 opacity-60 border-4 border-white rounded-full"></div>
//             <div className="bg-transparent text-white text-4xl text-center rounded-full w-56 h-56 flex items-center justify-center relative z-10">
//               85,000+
//             </div>
//           </div>
//           <div className="relative top-28 right-[155px]">
//             <div className="bg-purple-600 rounded-full h-16 border-white border-2 w-16 p-2">
//               <User className="text-white mt-2 ml-2 " />
//             </div>
//           </div>
//           <div className="relative rounded-full overflow-hidden m-4">
//             <div className="absolute inset-0 bg-purple-600 opacity-60 border-4 border-white rounded-full"></div>
//             <div className="bg-transparent text-white text-4xl text-center rounded-full w-56 h-56 flex items-center justify-center relative z-10">
//               150+
//             </div>
//           </div>
//           <div className="relative top-28 right-[155px]">
//             <div className="bg-purple-600 rounded-full h-16 border-white border-2 w-16 p-2">
//               <ChefHatIcon className="text-white mt-2 ml-2 " />
//             </div>
//           </div>
//           <div className="relative rounded-full overflow-hidden m-4">
//             <div className="absolute inset-0 bg-purple-600 opacity-60 border-4 border-white rounded-full"></div>
//             <div className="bg-transparent text-white text-4xl text-center rounded-full w-56 h-56 flex items-center justify-center relative z-10">
//               72,000+
//             </div>
//           </div>
//           <div className="relative top-28 right-[155px]">
//             <div className="bg-purple-600 rounded-full h-16 border-white border-2 w-16 p-2">
//               <Users className="text-white mt-2 ml-2 " />
//             </div>
//           </div>
//           <div className="relative rounded-full overflow-hidden m-4">
//             <div className="absolute inset-0 bg-purple-600 opacity-60 border-4 border-white rounded-full"></div>
//             <div className="bg-transparent text-white text-4xl text-center rounded-full w-56 h-56 flex items-center justify-center relative z-10">
//               30+
//             </div>
//           </div>
//           <div className="relative top-28 right-[155px]">
//             <div className="bg-purple-600 rounded-full h-16 border-white border-2 w-16 p-2">
//               <Trophy className="text-white mt-2 ml-2 " />
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HomeStats;

import { ChefHatIcon, Trophy, User, Users } from "lucide-react";

const HomeStats = () => {
  return (
    <section className="w-full h-screen mt-12 lg:mt-64 mb-28 relative">
      <div className="absolute w-full h-full bg-[url('/assets/reservation_bg.jpg')] bg-no-repeat bg-cover bg-center flex items-center justify-center">
        <div className="absolute w-full h-full bg-primary opacity-40"></div>
        <div className="flex flex-wrap justify-center lg:justify-around">
          <div className="relative rounded-full overflow-hidden m-2 lg:m-4">
            <div className="absolute inset-0 bg-purple-600 opacity-60 border-2 lg:border-4 border-white rounded-full"></div>
            <div className="bg-transparent text-white text-xl lg:text-4xl text-center rounded-full w-24 lg:w-56 h-24 lg:h-56 flex items-center justify-center relative z-10">
              85,000+
            </div>
          </div>
        </div>
        {/* <div className="absolute top-[460px] left-1/4 transform -translate-x-1/2">
          <div className="bg-purple-600 rounded-full h-8 lg:h-16 border-white border-2 w-8 lg:w-16 p-1 lg:p-2 -mt-4 lg:-mt-6">
            <User className="text-white mt-1 lg:mt-2 ml-1 lg:ml-2" />
          </div>
        </div> */}
        <div className="flex flex-wrap justify-center lg:justify-around">
          <div className="relative rounded-full overflow-hidden m-2 lg:m-4">
            <div className="absolute inset-0 bg-purple-600 opacity-60 border-2 lg:border-4 border-white rounded-full"></div>
            <div className="bg-transparent text-white text-xl lg:text-4xl text-center rounded-full w-24 lg:w-56 h-24 lg:h-56 flex items-center justify-center relative z-10">
              85,000+
            </div>
          </div>
        </div>
        {/* <div className="absolute top-[460px] left-[620px] transform -translate-x-1/2">
          <div className="bg-purple-600 rounded-full h-8 lg:h-16 border-white border-2 w-8 lg:w-16 p-1 lg:p-2 -mt-4 lg:-mt-6">
            <User className="text-white mt-1 lg:mt-2 ml-1 lg:ml-2" />
          </div>
        </div> */}
        <div className="flex flex-wrap justify-center lg:justify-around">
          <div className="relative rounded-full overflow-hidden m-2 lg:m-4">
            <div className="absolute inset-0 bg-purple-600 opacity-60 border-2 lg:border-4 border-white rounded-full"></div>
            <div className="bg-transparent text-white text-xl lg:text-4xl text-center rounded-full w-24 lg:w-56 h-24 lg:h-56 flex items-center justify-center relative z-10">
              85,000+
            </div>
          </div>
        </div>
        {/* <div className="absolute top-[460px] right-[555px] transform -translate-x-1/2">
          <div className="bg-purple-600 rounded-full h-8 lg:h-16 border-white border-2 w-8 lg:w-16 p-1 lg:p-2 -mt-4 lg:-mt-6">
            <User className="text-white mt-1 lg:mt-2 ml-1 lg:ml-2" />
          </div>
        </div> */}
        <div className="flex flex-wrap justify-center lg:justify-around">
          <div className="relative rounded-full overflow-hidden m-2 lg:m-4">
            <div className="absolute inset-0 bg-purple-600 opacity-60 border-2 lg:border-4 border-white rounded-full"></div>
            <div className="bg-transparent text-white text-xl lg:text-4xl text-center rounded-full w-24 lg:w-56 h-24 lg:h-56 flex items-center justify-center relative z-10">
              85,000+
            </div>
          </div>
        </div>
        {/* <div className="absolute top-[460px] right-[300px] transform -translate-x-1/2">
          <div className="bg-purple-600 rounded-full h-8 lg:h-16 border-white border-2 w-8 lg:w-16 p-1 lg:p-2 -mt-4 lg:-mt-6">
            <User className="text-white mt-1 lg:mt-2 ml-1 lg:ml-2" />
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default HomeStats;




