import React from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DisplayHistory = () => {
  const navigate = useNavigate();
  const handleReturn = () => {
    navigate(-1);
  };
  return (
    <div
      className="flex flex-col h-screen w-screen bg-no-repeat overflow-y-scroll"
      style={{
        backgroundImage: "url('src/assets/images/bg-account.png')",
        backgroundSize: "cover", 
        backgroundPosition: "center",
        fontFamily: "'Jersey 20', sans-serif",
      }}
    >
      <div className="flex justify-center">
        <h1
          style={{ fontFamily: "'Jersey 20', sans-serif", fontSize: "40px" }}
          className="mt-10 text-gray-800 text-center font-bold mb-10 border-blue-500 pb-5 pt-0"
        >
          HISTORY
        </h1>
      </div>
      <div className="absolute top-[80px] left-[20px] sm:left-[50px] md:left-[100px] lg:left-[280px] pl-10 px-2">
        <button
          onClick={handleReturn}
          className="p-0 px-3 py-1 w-auto flex bg-[#FFCF50] text-white rounded-lg shadow-md transition"
        >
          <ChevronLeft />
          <p className="text-[14px] sm:text-[16px] md:text-[18px]">RETURN</p>
        </button>
      </div>
      <div className="w-full flex flex-col justify-center items-center gap-6 overflow-y">
        {[...Array(10)].map((_, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row bg-white/20 border border-white/30 shadow-2xl backdrop-blur-md w-[90%] sm:w-[700px] h-auto sm:h-[130px] rounded-lg justify-between p-4"
            style={{
              fontFamily: "'Jersey 20', sans-serif",
            }}
          >
            <div className="w-full sm:w-[50%]">
              <h1 className="text-black mt-2 sm:mt-4 text-[12px] sm:text-[14px] ml-2 sm:ml-6">
                WINNING COMBINATION
              </h1>
              <p className="py-1/2 ml-4 sm:ml-8 text-black text-[20px] sm:text-[30px]">
                09-45-43-11-14-28
              </p>
              <p className="text-black ml-4 sm:ml-6 text-[12px] sm:text-[14px]">
                DRAW DATE: 02-28-2025
              </p>
              <p className="text-black ml-4 sm:ml-6 text-[12px] sm:text-[14px]">
                DRAW TIME: 10:40 AM
              </p>
            </div>
            <div className="w-full sm:w-[50%] mt-4 sm:mt-0">
              <h1 className="text-black text-[12px] sm:text-[14px] ml-2 sm:ml-0">
                YOUR BET
              </h1>
              <p className="py-1/2 ml-4 sm:ml-2 text-black text-[20px] sm:text-[30px]">
                50-43-11-21-07-01
              </p>
              <p className="text-black text-[18px] sm:text-[24px] text-right sm:ml-[280px]">
                LOST
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayHistory;
