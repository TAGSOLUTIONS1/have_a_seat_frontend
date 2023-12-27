import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ReservationFormProps {
  formData: any;
}

const ReservationForm: React.FC<ReservationFormProps> = ({ formData }) => {
  const [id, setId] = useState<any>();
  const navigate = useNavigate();

  const [reservationFormData, setReservationFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    if (Array.isArray(formData) && formData.length > 0) {
      if (formData[0]?.restaurant_flag === "yelp") {
        setId(0);
      } else {
        setId(formData[0]?.diningAreas[0]?.diningAreaId);
      }
    }
  }, [formData]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setReservationFormData((prevData) => ({
      ...prevData,
      [name]: value,
      diningAreaId: id,
    }));
  };

  const handleSubmit = () => {
    const route = `/reservation-status?data=${encodeURIComponent(
      JSON.stringify(reservationFormData)
    )}`;
    navigate(route);
    console.log(reservationFormData);
    setReservationFormData({
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
    });
  };

  return (
    <div className="flex bg-white p-8 rounded shadow-md ">
      <div className="w-2/3 community-service-hours-form">
        <h2 className="text-3xl font-bold text-center pb-8">
          Reservation Form
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
          <label
            htmlFor="first_name"
            className="text-sm font-medium text-gray-700"
          >
            First Name:
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            required
            className="w-full px-3 py-2 rounded border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50"
            onChange={handleChange}
          />

          <label
            htmlFor="last_name"
            className="text-sm font-medium text-gray-700"
          >
            Last Name:
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            required
            className="w-full px-3 py-2 rounded border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50"
            onChange={handleChange}
          />

          <label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Number:
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            required
            className="w-full px-3 py-2 rounded border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50"
            onChange={handleChange}
          />

          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email:
          </label>
          <input
            type="text"
            id="email"
            name="email"
            required
            className="w-full px-3 py-2 rounded border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50"
            onChange={handleChange}
          />

          <button
            type="submit"
            className="inline-flex justify-center items-center px-4 py-2 text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-800"
          >
            Make a Reservation
          </button>
        </form>
      </div>
        <div className="w-1/3 ml-10">
          <img
            src="https://www.scaler.com/topics/stories/how-to-create-a-registration-form-in-html/assets/3.png"
            className="mt-24"
            width={"200px"}
            height={"300px"}
            alt=""
          />
        </div>
    </div>
  );
};

export default ReservationForm;
