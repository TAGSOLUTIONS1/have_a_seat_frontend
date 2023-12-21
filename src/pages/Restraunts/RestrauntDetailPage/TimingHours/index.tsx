import { useState, useEffect } from "react";

interface MenuProps {
  restrauntDetail: any;
}

const TimingHours: React.FC<MenuProps> = ({ restrauntDetail }) => {
  const [timingData, setTimingData] = useState<any>();

  useEffect(() => {
    if (Object.keys(restrauntDetail).length !== 0) {
      setTimingData(restrauntDetail);
    }
  }, [restrauntDetail]);

  const formatTime = (time: string) => {
    const hours = time.slice(0, 2);
    const minutes = time.slice(2);
    const hour = parseInt(hours, 10) % 12 || 12;
    const period = parseInt(hours, 10) >= 12 ? "PM" : "AM";
    return `${hour}:${minutes} ${period}`;
  };

  const formatHoursOfOperation = (hoursOfOperation: string | undefined) => {
    if (hoursOfOperation) {
      const lines = hoursOfOperation.split("<br />");
      return lines.map((line, index) => <p key={index}>{line.trim()}</p>);
    }
    return <p>No timing data available</p>;
  };

  return (
    <div className="grid grid-cols-8 space-x-4">
      <div className="col-span-1"></div>
      <div className="col-span-4 mr-4 border mt-4 rounded-lg p-4 shadow-lg">
        <h1 className="text-xl">
          <strong>Timing Hours</strong>
        </h1>
        <hr className="mb-4 mt-4" />
        <p className="text-purple-600">Dialog Timings</p>

        {timingData?.restaurant_flag === "yelp" ? (
          timingData?.hours ? (
            timingData.hours[0].open.map((data: any, index: number) => {
              const startTime = formatTime(data.start);
              const endTime = formatTime(data.end);
              return (
                <p key={index} className="mt-2">
                  Everyday from {startTime} to {endTime}
                </p>
              );
            })
          ) : (
            <p>No timing data available</p>
          )
        ) : (
          <div>
            {formatHoursOfOperation(timingData?.restaurant?.hoursOfOperation)}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimingHours;
