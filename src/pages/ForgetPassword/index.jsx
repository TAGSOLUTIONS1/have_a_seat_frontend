import ForgetForm from "@/components/auth/ForgetForm";

const ForgetPassword = () => {
  return (
    <section className="h-[870px] bg-bgGray flex items-center justify-center">
      <div className="container">
        <div className="flex justify-center">
          <div className="w-full md:w-11/12 lg:w-full xl:w-11/12">
            <ForgetForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgetPassword;
