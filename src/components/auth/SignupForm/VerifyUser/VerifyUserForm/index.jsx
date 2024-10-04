import Loader from "@/components/Loader";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const VerifyUserForm = () => {
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  const { toast } = useToast();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");

  const handleVerifyToken = async () => {
    try {
      const currentDate = new Date();
      const date = currentDate.toString();
      const response = await axios.post(
        "https://3.101.103.14/api/v1/auth/verify",
        {
          token: id,
        }
      );
      setVerified(true);
      setLoading(false);
      toast({
        title: "Verified successfully",
        description: date,
      });
    } catch (error) {
      setLoading(false);

      toast({
        title: error.response.data.detail,
      });
    }
  };

  useEffect(() => {
    handleVerifyToken();
  }, [id]);

  return (
    <>
      {loading ? (
        <div className="ml-[30%] -mt-[15%]">
          <Loader />
        </div>
      ) : (
        <div className="w-full md:w-11/12 lg:w-full xl:w-11/12">
          <div className="md:w-5/6 lg:w-11/12 xl:w-5/6 order-2 md:order-1 mt-12">
            {verified ? (
              <h1 className="text-center text-4xl md:text-5xl font-bold mb-8 md:mb-10">
                Verified Successfully
              </h1>
            ) : (
              <h1 className="text-center text-4xl md:text-5xl font-bold mb-8 md:mb-10">
                Verification Failed
              </h1>
            )}
            {verified ? (
              <p className="text-center m-8 text-green-700">
                You have been successfully verified, and we are pleased to
                welcome you to our website. You now have the privilege to fully
                enjoy our platform and make reservations at any of the
                restaurants available to you.
              </p>
            ) : (
              <p className="text-center m-8 text-red-600">
                Your verification has been Failed. You now have the privilege to
                partially enjoy our platform because you cannot make
                reservations at any of the restaurants available to you.
              </p>
            )}
            <form className="space-y-4 md:space-y-6">
              <Link to="/">
                <button
                  type="submit"
                  className="w-full md:w-3/4 lg:w-1/2 md:ml-[22%] lg:ml-[22%] text-white bg-purple-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 mx-auto"
                >
                  Continue to the website
                </button>
              </Link>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default VerifyUserForm;
