import ForgetForm from "@/components/auth/ForgetForm";

const ForgetPassword = () => {
  return (
    <section className="h-[870px] bg-gray-50 flex items-center justify-center">
      <div className="container">
        <div className="flex justify-center">
          <div className="w-full md:w-11/12 lg:w-full xl:w-11/12">
            <div className="bg-white rounded-lg shadow-lg p-7 md:p-10">
            <ForgetForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgetPassword;
