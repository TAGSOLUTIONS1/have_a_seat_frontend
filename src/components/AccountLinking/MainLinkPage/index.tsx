import LinkPageDialogue from "../linkPageDialogue";

const MainLinkingPage = () => {
  return (
    <div className="ml-36">
      <div className="grid grid-cols-7 gap-7">
        <div className=" col-span-2 mt-16">
          <div className=" bg-white shadow-lg rounded-lg card">
            <div className="card-body">
              <div className="flex flex-col items-center text-center">
                <img
                  src="https://bootdey.com/img/Content/avatar/avatar7.png"
                  alt="Admin"
                  className="rounded-circle mt-8"
                  width="150"
                />
                <div className="mt-3 mb-4">
                  <h4 className="text-lg">Hashim Ali</h4>
                  <p className=" mb-1">Full Stack Developer</p>
                  <p className="text-sm">Bay Area, San Francisco, CA</p>
                  <div>
                    <div className="flex items-center">
                      <div className="w-full text-center">
                        <LinkPageDialogue />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-4 mt-16">
          <div className="bg-white shadow-lg rounded-lg px-8 pt-12 pb-8">
            <div className="mb-4">
              <div className="flex items-center">
                <div className="w-1/3">
                  <h6 className="mb-0">Full Name</h6>
                </div>
                <div className="w-2/3">Kenneth Valdez</div>
              </div>
            </div>
            <hr className="my-4" />
            <div className="mb-4">
              <div className="flex items-center">
                <div className="w-1/3">
                  <h6 className="mb-0">Email</h6>
                </div>
                <div className="w-2/3 ">fip@jukmuh.al</div>
              </div>
            </div>
            <hr className="my-4" />
            <div className="mb-4">
              <div className="flex items-center">
                <div className="w-1/3">
                  <h6 className="mb-0">Phone</h6>
                </div>
                <div className="w-2/3">(239) 816-9029</div>
              </div>
            </div>
            <hr className="my-4" />
            <div className="mb-4">
              <div className="flex items-center">
                <div className="w-1/3">
                  <h6 className="mb-0">Mobile</h6>
                </div>
                <div className="w-2/3 ">(320) 380-4539</div>
              </div>
            </div>
            <hr className="my-4" />
            <div className="mb-4">
              <div className="flex items-center">
                <div className="w-1/3">
                  <h6 className="mb-0">Address</h6>
                </div>
                <div className="w-2/3">Bay Area, San Francisco, CA</div>
              </div>
            </div>
            {/* <hr className="my-4" /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLinkingPage;
