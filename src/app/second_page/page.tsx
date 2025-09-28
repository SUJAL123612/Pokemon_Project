"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Name() {
  const [playerName, setPlayerName] = useState("");
  const router = useRouter();

  const handleOk = () => {
    if (!playerName.trim()) {
      alert("Please enter your name!");
      return;
    }
    localStorage.setItem("playerName", playerName); 
    router.push("/third_page"); 
  };

  return (
    <>
      <div className="w-full h-[592px] relative flex flex-col items-center mt-[-40px]">
        <div className="flex items-center space-x-4">
          <img src="logo.svg" alt="Logo" className="w-50 h-50" />
          <span className="text-red-500 text-[50px] font-extrabold leading-tight cursor-default">
            BATTLE ARENA
          </span>
        </div>
      </div>
      <div className="flex mt-[-300px] space-x-10 ml-[140px]">
        <div className="w-[350px] h-[250px]">
          <img
            src="pikachu.png"
            alt="Pikachu"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex flex-col space-y-4 relative z-10">
          <label htmlFor="player-1" className="text-lg font-semibold">
            Enter Player Name:
          </label>
          <input
            type="text"
            id="player-1"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="border border-gray-400 rounded px-3 py-2"
          />
          <button
            onClick={handleOk}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-400 hover:text-white/80 cursor-pointer"
          >
            OK
          </button>
        </div>
        <div className="w-[450px] h-[450px] ml-[-45px] mt-[-130px]">
          <img
            src="ash.png"
            alt="ASH"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </>
  );
}
