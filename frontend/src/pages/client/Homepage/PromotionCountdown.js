import React, { useState, useEffect } from "react";
import { FaClock, FaTag, FaPlane } from "react-icons/fa";

const PromotionCountdown = () => {
  // Set end date for the promotion (1 week from current date for this example)
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 7);

  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [currentTime, setCurrentTime] = useState(
    {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }
  )

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime({
        days: now.getDate(),
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds(),
      });
    };

    // Update time every second
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endDate - new Date();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        // Promotion has ended
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Calculate initially
    calculateTimeLeft();

    // Set up interval to update countdown
    const timer = setInterval(calculateTimeLeft, 1000);

    // Clear interval on unmount
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="promotion-countdown-container">
      <div className="promotion-content">
        <div className="promotion-header">
          <FaTag className="promotion-icon" />
          <h2 className="promotion-title">Summer Sale</h2>
        </div>
        <p className="promotion-description">
          Enjoy up to 30% off on international flights. Book before the timer
          runs out!
        </p>

        <div className="countdown-timer">
          <div className="timer-unit">
            <div className="timer-value">
              {/* {String(timeLeft.days).padStart(2, "0")} */}
              {String(currentTime.days).padStart(2, "0")}
            </div>
            <div className="timer-label">Days</div>
          </div>
          <div className="timer-separator">:</div>
          <div className="timer-unit">
            <div className="timer-value">
              {/* {String(timeLeft.hours).padStart(2, "0")} */}
            {String(currentTime.hours).padStart(2, "0")}
            </div>
            <div className="timer-label">Hours</div>
          </div>
          <div className="timer-separator">:</div>
          <div className="timer-unit">
            <div className="timer-value">
              {/* {String(timeLeft.minutes).padStart(2, "0")} */}
            {String(currentTime.minutes).padStart(2, "0")}
            </div>
            <div className="timer-label">Minutes</div>
          </div>
          <div className="timer-separator">:</div>
          <div className="timer-unit">
            <div className="timer-value">
              {/* {String(timeLeft.seconds).padStart(2, "0")} */}
            {String(currentTime.seconds).padStart(2, "0")}
            </div>
            <div className="timer-label">Seconds</div>
          </div>
        </div>

        <button className="promotion-button">
          <FaPlane className="button-icon" />
          <span>Book Now with Discount</span>
        </button>
      </div>
    </div>
  );
};

export default PromotionCountdown;
