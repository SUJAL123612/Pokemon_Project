"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // ✅ add this

export default function ThirdPage() {
  const [pokemonName, setPokemonName] = useState<string>("");
  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null);
  const [pokemonImage, setPokemonImage] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<string>("");
  const router = useRouter(); // ✅ add this

  // Load player name from localStorage
  useEffect(() => {
    const storedName = localStorage.getItem("playerName");
    if (storedName) {
      setPlayerName(storedName);
    }
  }, []);

  // Fetch Pokémon by name
  const fetchPokemon = async () => {
    if (!pokemonName) return;
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`
      );
      if (!response.ok) throw new Error("Pokémon not found");
      const data = await response.json();
      setSelectedPokemon(data.name);
      setPokemonImage(data.sprites.front_default);
      setPokemonName("");
    } catch (error) {
      alert("Pokémon not found!");
    }
  };

  // Fetch random Pokémon
  const fetchRandomPokemon = async () => {
    try {
      const randomId = Math.floor(Math.random() * 898) + 1;
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${randomId}`
      );
      const data = await response.json();
      setSelectedPokemon(data.name);
      setPokemonImage(data.sprites.front_default);
      setPokemonName("");
    } catch (error) {
      alert("Error fetching random Pokémon!");
    }
  };

  // OK button action
  const handleOk = () => {
    if (!selectedPokemon) {
      alert("Please select a Pokémon first!");
      return;
    }
    alert(`${playerName} selected ${selectedPokemon}!`);
    localStorage.setItem("selectedPokemon", selectedPokemon); // ✅ save chosen Pokémon
    router.push("/fourth_page"); // ✅ navigate to 4th page
  };

  return (
    <div className="w-full h-screen flex flex-col items-center px-20">
      {/* Logo + Title */}
      <div className="flex items-center space-x-4 mt-[-20px]">
        <img src="logo.svg" alt="Logo" className="w-32 h-32" />
        <span className="text-red-500 text-5xl font-extrabold cursor-default">
          BATTLE ARENA
        </span>
      </div>

      {/* Main Section */}
      <div className="flex justify-between items-start w-full mt-16 pl-55">
        {/* Left Side - Input + Buttons */}
        <div className="flex-1 max-w-md">
          <h2 className="text-lg font-bold mb-2">
            Player: <span className="text-blue-600">{playerName}</span>
          </h2>
          <label className="block text-md font-semibold mb-2">
            Choose Your Pokémon:
          </label>
          <input
            type="text"
            value={pokemonName}
            onChange={(e) => setPokemonName(e.target.value)}
            placeholder="e.g. pikachu"
            className="border border-gray-400 rounded p-2 w-68"
          />
          <div className="flex space-x-4 mt-3">
            <button
              onClick={fetchPokemon}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Select
            </button>
            <button
              onClick={fetchRandomPokemon}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Random
            </button>
          </div>

          {/* Selected Pokémon Name */}
          {selectedPokemon && (
            <p className="text-green-600 font-bold mt-4">
              ✅ Selected Pokémon: {selectedPokemon}
            </p>
          )}
        </div>

        {/* Right Side - Pokémon Image */}
        <div className="flex-1 flex justify-center">
          {pokemonImage && (
            <img
              src={pokemonImage}
              alt={selectedPokemon || "Pokémon"}
              className="w-[300px] h-[300px] object-contain"
            />
          )}
        </div>
      </div>

      {/* START BATTLE Button (only visible when Pokémon is selected) */}
      {selectedPokemon && (
        <div className="ml-[-500px] mt-[-70px]">
          <button
            onClick={handleOk}
            className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg"
          >
            START BATTLE
          </button>
        </div>
      )}
    </div>
  );
}
