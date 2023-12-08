import { ArrowRight } from "lucide-react";

const BestSeller = () => {
  return (
    <div className="w-full flex items-center mt-28 justify-center space-x-8">
      <div className="relative">
        <img
          src="/assets/offer_slider_1.png"
          className="rounded h-[280px]"
          alt=""
        />
        <div className=" ml-8 absolute inset-0 flex flex-col mt-8 justify-left items-left text-white ">
          <h1 className="text-2xl font-bold mb-4 text-purple-600 italic">
            Weekly Best Seller
          </h1>
          <p className="text-3xl mb-4 text-gray-600 font-bold">
            Spade's Cafe
          </p>
          <p className="text-lg text-gray-600 ">
            Neque porro quisquam est qui dolor <br /> ipsum quia dolor sit ametsed.
          </p>
          <p className="text-lg underline mt-4 text-gray-600">
            <span className="flex cursor-pointer ">
              Visit Now <ArrowRight className="mt-2 h-5" />
            </span>
          </p>
        </div>
      </div>
      <div className="relative">
        <img
          src="/assets/offer_slider_2.png"
          className="rounded h-[280px]"
          alt=""
        />
        <div className=" ml-8 absolute inset-0 flex flex-col mt-8 justify-left items-left text-white ">
          <h1 className="text-2xl font-bold mb-4 text-purple-600 italic">
            Daily Offers
          </h1>
          <p className="text-3xl mb-4 text-gray-600 font-bold">
            StarBucks 
          </p>
          <p className="text-lg text-gray-600 ">
            Neque porro quisquam est qui dolor <br /> ipsum quia dolor sit ametsed.
          </p>
          <p className="text-lg underline mt-4 text-gray-600">
            <span className="flex cursor-pointer ">
              Visit Now <ArrowRight className="mt-2 h-5" />
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BestSeller;
