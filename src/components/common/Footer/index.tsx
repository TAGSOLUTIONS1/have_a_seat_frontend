const Footer = () => {
  return (
    <>
      <section className="w-full h-full">
        <div className=" relative h-96 w-full p-6 bg-[url('/assets/footer_bg.jpg')] bg-no-repeat bg-cover bg-center">
          <div className="absolute inset-0 bg-primary opacity-50"></div>
          <div className="absolute z-10 max-w-screen-xl left-0 right-0 mx-auto p-6"></div>
        </div>
      </section>
    </>
  );
};
export default Footer;
