import Date from "./Date";
import PersonCard from "./Person";
import Time from "./Time";


const OverviewCard2 = () => {
  return (
    <div className="p-6 border rounded-lg shadow-lg">
      <h1 className="m-2 text-center text-lg">
        <strong>Make a reservation</strong>{" "}
      </h1>
      <hr className="mt-4 mb-4" />
      <Date/>
      <hr className="mt-4 mb-4" />
      <Time/>
      <hr className="mt-4 mb-4" />
      <PersonCard/>
      <button className="w-full bg-purple-600 mt-12 text-white rounded-lg py-2 mb-4 focus:outline-none">
        Make a reservation
      </button>
    </div>
  );
};

export default OverviewCard2;
