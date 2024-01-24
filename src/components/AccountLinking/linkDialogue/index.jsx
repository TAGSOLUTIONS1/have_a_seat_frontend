import { useState } from "react";
// import { useRef , useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

const LinkDialogue = () => {
  const [restrauntType, setRestrauntType] = useState(null);
  //   const iframeRef = useRef<any | null>(null);

  const openModalWindow = (url, width, height) => {
    var left = screen.width / 2 - width / 2;
    var top = screen.height / 2 - height / 2;
    var options =
      "width=" +
      width +
      ",height=" +
      height +
      ",top=" +
      top +
      ",left=" +
      left +
      ",resizable=no,scrollbars=no,status=yes";
    var modalWindow = window.open(url, "modal", options);
    modalWindow?.focus();
  };

  const handleOpenTableClick = () => {
    openModalWindow("https://www.opentable.com/", 1000, 550);
  };

  const handleResyClick = () => {
    openModalWindow("https://resy.com/?date=2024-01-16&seats=2", 1000, 550);
  };

  const handleTockClick = () => {
    openModalWindow("https://www.exploretock.com/signup?continue=%2F", 1000, 550);
  };

  const handleGoogleClick = () => {
    openModalWindow("https://www.google.com/", 1000, 550);
  };

  const handleToastTabClick = () => {
    openModalWindow("https://auth.toasttab.com/u/login/identifier?state=hKFo2SBqOVdWc2NOaFdtWFRfYTlTbG5Hb3NWSWVFM1dVYmEwSqFur3VuaXZlcnNhbC1sb2dpbqN0aWTZIEczalgyQm9ud0JRbzh4UkQ0bGpTVHJYZnJVR19ndlVFo2NpZNkgVUd2eWtZdzh3U1VwNWptbUhqVk5pcUtWcGswYjU2SWU", 1000, 550);
  };

  const handleRadioClick = (radioId, type) => {
    const radioElement = document.getElementById(radioId);
    if (radioElement) {
      radioElement.click();
      setRestrauntType(type);
    }
  };

  //   const handleIFrameMessage = (event: any) => {
  //     if (event.source === iframeRef?.current?.contentWindow) {
  //       if (event.data && event.data.type === "cookieData") {
  //         console.log("Cookies from iframe:", event.data.cookies);
  //       }
  //     }
  //   };

  //   useEffect(() => {
  //     window.addEventListener("message", handleIFrameMessage);
  //     return () => {
  //       window.removeEventListener("message", handleIFrameMessage);
  //     };

  //   }, []);

  //   const cookies = document.cookie;
  //   const cookieData = { type: "cookieData", cookies };

  //   window.parent.postMessage(cookieData, "*");

  return (
    <>
      <Dialog>
        <div className="flex gap-4 py-4">
          <div
            className="relative border-2 rounded-lg flex-1 pt-12 p-4"
            onClick={() => handleRadioClick("radio1", "resy")}
          >
            <label htmlFor="radio1" className="cursor-pointer">
              <img
                src="assets/resy_logo_new.png"
                alt="Account Image 1"
                className="w-full h-auto object-contain rounded-md"
              />
              <div className="absolute top-2 right-2">
                <input
                  type="radio"
                  id="radio1"
                  name="radio"
                  style={{ width: "20px", height: "20px" }}
                />
              </div>
            </label>
          </div>
          <DialogTrigger asChild>
            <div
              className="relative border-2 rounded-lg flex-1 pt-12 p-4"
              onClick={() => handleRadioClick("radio2", "yelp")}
            >
              <label htmlFor="radio2" className="cursor-pointer">
                <img
                  src="assets/yelp_logo_new.png"
                  alt="Account Image 2"
                  className="w-full h-auto object-contain rounded-md"
                />
                <div className="absolute top-2 right-2">
                  <input
                    type="radio"
                    id="radio2"
                    name="radio"
                    style={{ width: "20px", height: "20px" }}
                    onClick={() => handleRadioClick("radio2", "yelp")}
                  />
                </div>
              </label>
            </div>
          </DialogTrigger>
          <div
            className="relative border-2 flex-1 rounded-lg pt-12 p-4"
            onClick={() => handleRadioClick("radio3", "opentable")}
          >
            <label htmlFor="radio3" className="cursor-pointer">
              <img
                src="/assets/opentable.png"
                alt="Account Image 3"
                className="w-full h-auto mt-2 object-contain rounded-md"
              />
              <div className="absolute top-2 right-2">
                <input
                  type="radio"
                  id="radio3"
                  name="radio"
                  style={{ width: "20px", height: "20px" }}
                />
              </div>
            </label>
          </div>
        </div>
        <div className="flex gap-4 ">
        <div
          className="relative border-2 flex-1 rounded-lg pt-12 p-4"
          onClick={() => handleRadioClick("radio4", "tock")}
        >
          <label htmlFor="radio4" className="cursor-pointer">
            <img
              src="/assets/tock-logo.png"
              alt="Account Image 3"
              className="w-full h-auto  object-contain rounded-md"
            />
            <div className="absolute top-2 right-2">
              <input
                type="radio"
                id="radio4"
                name="radio"
                style={{ width: "20px", height: "20px" }}
              />
            </div>
          </label>
        </div>
        <div
          className="relative border-2 flex-1 rounded-lg pt-12 p-4"
          onClick={() => handleRadioClick("radio5", "google")}
        >
          <label htmlFor="radio5" className="cursor-pointer">
            <img
              src="/assets/google-logo.png"
              alt="Account Image 3"
              className="w-full h-auto object-contain rounded-md"
            />
            <div className="absolute top-2 right-2">
              <input
                type="radio"
                id="radio5"
                name="radio"
                style={{ width: "20px", height: "20px" }}
              />
            </div>
          </label>
        </div>
        <div
          className="relative border-2 flex-1 rounded-lg pt-12 p-4"
          onClick={() => handleRadioClick("radio6", "toasttab")}
        >
          <label htmlFor="radio6" className="cursor-pointer">
            <img
              src="/assets/toasttab-logo.jpg"
              alt="Account Image 3"
              className="w-full h-auto -mt-4 object-contain rounded-md"
            />
            <div className="absolute top-2 right-2">
              <input
                type="radio"
                id="radio6"
                name="radio"
                style={{ width: "20px", height: "20px" }}
              />
            </div>
          </label>
        </div>
        </div>
        <DialogContent
          className="sm:max-w-[1300px]"
          style={{ height: "calc(100vh - 48px)" }}
        >
          {restrauntType === "yelp" ? (
            <iframe
              //   ref={iframeRef}
              src="https://www.yelp.com/signup?return_url=https%3A%2F%2Fwww.yelp.com%2F"
              className="w-full mt-4 h-[610px]"
              frameBorder="0"
            ></iframe>
          ) : restrauntType === "opentable" ? (
            (handleOpenTableClick(), null)
          ) : restrauntType === "resy" ? (
            (handleResyClick(), null)
          ) : restrauntType === "tock" ? (
            (handleTockClick(), null)
          ): restrauntType === "google" ? (
            (handleGoogleClick(), null)
          ): restrauntType === "toasttab" ? (
            (handleToastTabClick(), null)
          ):null}
          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LinkDialogue;
