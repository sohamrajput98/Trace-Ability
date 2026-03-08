import React from 'react';

export const DataProcessingLoader = () => {
  return (
    <div className="flex justify-center items-center scale-75">
      <div className="loader-dots">
        <div className="circle-dot">
          <div className="dot"></div>
          <div className="outline"></div>
        </div>
        <div className="circle-dot">
          <div className="dot"></div>
          <div className="outline"></div>
        </div>
        <div className="circle-dot">
          <div className="dot"></div>
          <div className="outline"></div>
        </div>
        <div className="circle-dot">
          <div className="dot"></div>
          <div className="outline"></div>
        </div>
      </div>
    </div>
  );
};