import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  return (
    <section className="h-[770px] bg-bgGray flex items-center justify-center">
      <div className="container mt-0">
        <div className="flex justify-center">
          <div className="w-full md:w-11/12 lg:w-full xl:w-11/12">
              <div className="">
                <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
