
const TimingHours = () => {
  return (
    <div className=" grid grid-cols-8 space-x-4">
      <div className="col-span-1"></div>
      <div className="col-span-4 mr-4 border mt-4 rounded-lg p-4 shadow-lg">
        <h1 className="text-xl">
        <strong>Timing Hours</strong>
        </h1>
        <hr className="mb-4 mt-4" />
        <p className="text-purple-600">
          Dialog Timings
        </p>
        <p className="mt-2">
          Mon-Wed 11:30 am 11:00 am
        </p>
        <p className="mt-2">
          Thu-Fri 11:30 am 02:00 am
        </p>
        <p className="mt-2">
          Sat-Sun 11:00 am 12:00 am
        </p>
      </div>
    </div>
  )
}

export default TimingHours
