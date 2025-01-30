import SignupForm from "@/components/auth/SignupForm";
const Signup = () => {
  return (
    <section className=" bg-bgGray flex items-center justify-center">
      <div className="container">
        <div className="flex justify-center">
          <div className="w-full md:w-11/12 lg:w-full xl:w-11/12">
            <div className>
                <SignupForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
