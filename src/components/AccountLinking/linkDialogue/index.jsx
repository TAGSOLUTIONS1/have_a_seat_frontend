import { useState, useEffect } from "react";
import axios from "axios";
import { Base_Url } from "@/baseUrl";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

const LinkDialogue = () => {
  // Only supporting Resy linking on web for now
  const [resyLinked, setResyLinked] = useState(false);
  const [resyForm, setResyForm] = useState({ email: "", password: "" });
  const [resySaving, setResySaving] = useState(false);
  const [resyError, setResyError] = useState("");
  const [resySuccess, setResySuccess] = useState("");
  const [resyChecking, setResyChecking] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const savedResy = localStorage.getItem("resyDetails");
    if (user?.link_restaurant?.resy) {
      setResyLinked(true);
    }
    if (savedResy) {
      try {
        const parsed = JSON.parse(savedResy);
        setResyForm((prev) => ({ ...prev, email: parsed.email || "" }));
      } catch (e) {
        // ignore parse errors
      }
    }
  }, []);

  const verifyExistingResy = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return;
    }
    setResyChecking(true);
    setResyError("");
    setResySuccess("");
    try {
      const response = await axios.post(
        `${Base_Url}/api/v1/resy/user_verify`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response?.data?.success && response?.data?.data?.legacy_token) {
        setResyLinked(true);
        setResySuccess("Resy is linked.");
      } else {
        setResyLinked(false);
      }
    } catch (error) {
      console.error("Error verifying saved Resy credentials:", error);
      setResyLinked(false);
    } finally {
      setResyChecking(false);
    }
  };

  useEffect(() => {
    verifyExistingResy();
  }, []);

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

  const handleResyConnect = async (e) => {
    e.stopPropagation();
    setResyError("");
    setResySuccess("");
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setResyError("Please log in to connect Resy.");
      return;
    }
    if (!resyForm.email.trim() || !resyForm.password.trim()) {
      setResyError("Email and password are required.");
      return;
    }
    try {
      setResySaving(true);
      await axios.post(
        `${Base_Url}/api/v1/resy/save_user_data`,
        { email: resyForm.email.trim(), password: resyForm.password },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setResySuccess("Resy account connected.");
      setResyLinked(true);
      // Persist the new linked state locally
      localStorage.setItem(
        "user",
        JSON.stringify({
          link_restaurant: { resy: true },
        })
      );
      // Save email locally for display
      localStorage.setItem(
        "resyDetails",
        JSON.stringify({ email: resyForm.email.trim() })
      );
      // Re-verify to confirm link status
      await verifyExistingResy();
    } catch (error) {
      console.error("Error saving Resy user data:", error);
      // Extract a readable error message from backend/Resy response
      const apiDetail = error?.response?.data?.detail;
      const detailError =
        (typeof apiDetail?.error === "string" && apiDetail.error) ||
        (typeof apiDetail === "string" && apiDetail);
      const message =
        error?.response?.data?.message ||
        detailError ||
        "Credentials verification failed. Please check your email and password.";
      setResyError(message);
    } finally {
      setResySaving(false);
    }
  };

  return (
    <>
      <Dialog>
        <div className="flex gap-4 py-4">
          <div
            className="relative border-2 rounded-lg flex-1 pt-12 p-4"
          >
            <label htmlFor="checkbox1" className="cursor-pointer">
              <img
                src="assets/resy_logo_new.png"
                alt="Resy"
                className="w-full h-auto object-contain rounded-md"
              />
              {resyLinked && (
                <div className="absolute top-2 right-2">
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-200">
                    Linked
                  </span>
                </div>
              )}
            </label>
            {resyChecking && (
              <p className="text-xs text-blue-600 mt-2">Checking saved Resy credentials...</p>
            )}
            <div className="mt-4 space-y-2">
              <input
                type="email"
                placeholder="Resy email"
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                value={resyForm.email}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) =>
                  setResyForm((prev) => ({ ...prev, email: e.target.value }))
                }
              />
              <input
                type="password"
                placeholder="Resy password"
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                value={resyForm.password}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) =>
                  setResyForm((prev) => ({ ...prev, password: e.target.value }))
                }
              />
              <button
                className="w-full bg-purple-600 text-white rounded-md py-2 text-sm disabled:opacity-60"
                onClick={handleResyConnect}
                disabled={resySaving}
              >
                {resySaving ? "Connecting..." : resyLinked ? "Update Resy Details" : "Connect Resy"}
              </button>
              {resyError && (
                <p className="text-xs text-red-600">{resyError}</p>
              )}
              {resySuccess && (
                <p className="text-xs text-green-600">{resySuccess}</p>
              )}
            </div>
          </div>
        </div>
        {/* <div className="flex gap-4 ">
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
              src="/assets/google-logo.jpg"
              alt="Account Image 3"
              className="w-full h-auto -mt-8 object-contain rounded-md"
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
              src="/assets/toasttab-logo.png"
              alt="Account Image 3"
              className="w-full h-auto -mt-2 object-contain rounded-md"
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
        </div> */}
        <DialogContent
          className="sm:max-w-[1300px]"
          style={{ height: "calc(100vh - 48px)" }}
        >
          {/* {restrauntType === "yelp" ? (
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
          ):null} */}
          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LinkDialogue;
