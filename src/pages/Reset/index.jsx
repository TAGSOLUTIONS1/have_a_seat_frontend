import ResetForm from "@/components/auth/ResetForm";

const ResetPassword = () => {
  return (
    <section className="h-[870px] bg-gray-50 flex items-center justify-center">
      <div className="container">
        <div className="flex justify-center">
          <div className="w-full md:w-11/12 lg:w-full xl:w-11/12">
            <div className="bg-white rounded-lg shadow-lg p-7 md:p-10">
              <div className="flex justify-center">
                <ResetForm />
                <div className="md:w-5/6 lg:w-11/12 xl:w-5/6 order-1 md:order-2 ml-28 hidden md:block">
                  <img
                    src="/assets/reset-password.png"
                    className="img-fluid w-96 h-76 rounded-md"
                    alt="Sample image"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;