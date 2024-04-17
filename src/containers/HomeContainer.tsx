import React from "react";
import { Link, useNavigate } from "react-router-dom";

const HomeContainer: React.FC = () => {
  const navigate = useNavigate();
  const handleClick = (value) => {
    navigate(`/${value}`);
  };

  return (
    <div className="relative bg-black w-full h-screen">
      <div className="w-full h-full flex justify-center items-center">
        <button
          className="bg-black text-white py-4 px-20 mr-10 border-2 border-white rounded text-4xl"
          onClick={() => handleClick("global")}
        >
          Global Control
        </button>
        <button
          className="bg-black text-white py-4 px-20 border-2 border-white rounded text-4xl"
          onClick={() => handleClick("demo")}
        >
          Demo Control
        </button>
      </div>

      <div className="absolute top-[30px] left-[30px]">
        <img src="./logo.png" alt="Coates logo" />
      </div>

      <div className="absolute top-[660px] left-[30px]">
        <Link to="/">
          <img className="w-12 h-auto" src="./home.png" />
        </Link>
      </div>
    </div>
  );
};

export default HomeContainer;
