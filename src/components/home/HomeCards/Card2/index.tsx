const Card2 = () => {
  return (
    <div
      id="app"
      className="bg-white w-full p-1 h-60 shadow-xl rounded-2xl flex card text-grey-darkest"
    >
      <img
        className="w-1/2 h-full rounded-2xl"
        src="https://s3-eu-north-1.amazonaws.com/py3.visitsweden.com/images/Tak2-CMSTemplate_IrMZHla.width-1500.jpg"
        alt="Room Image"
      />
      <div className="w-full flex flex-col p-2">
        <div className="p-4 pb-0 flex-1">
          <h3 className="font-light mb-1 text-grey-darkest">Tower Hotel</h3>
          <div className="text-xs flex items-center mb-4">
            <i className="fas fa-map-marker-alt mr-1 text-grey-dark"></i>
            Soho, London
          </div>
          <span className="text-3xl sm:text-5xl text-grey-darkest">
            £63.00
            <span className="text-base sm:text-lg">/PPPN</span>
          </span>
          <div className="flex items-center mt-4">
            <div className="pr-2 text-xs">
              <i className="fas fa-wifi text-green"></i> Free WiFi
            </div>
            <div className="px-2 text-xs">
              <i className="text-grey-darker far fa-building"></i> 2mins to
              center
            </div>
          </div>
        </div>
        <div className="bg-grey-lighter p-3 flex items-center justify-between transition hover:bg-grey-light">
          Book Now
          <i className="fas fa-chevron-right"></i>
        </div>
      </div>
    </div>
  );
};
export default Card2;
