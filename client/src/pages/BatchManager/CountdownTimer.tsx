import React, { useEffect, useState } from "react";

interface CountdownTimerProps {
  endTime: string | Date;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ endTime }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(endTime) - +new Date();
    return difference > 0 ? Math.floor(difference / 1000) : 0;
  };

  const [secondsLeft, setSecondsLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;

    return `${h > 0 ? `${h}h ` : ""}${m}m ${s}s`;
  };

  return (
    <span className={secondsLeft === 0 ? "text-red-600 font-bold" : ""}>
      ⏳ {formatTime(secondsLeft)}
    </span>
  );
};

export default CountdownTimer;
