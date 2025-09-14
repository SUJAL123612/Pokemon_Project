"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function FourthPage() {
  const router = useRouter();

  const [playerName, setPlayerName] = useState<string>("");
  const [playerPokemon, setPlayerPokemon] = useState<string | null>(null);
  const [playerType, setPlayerType] = useState<string>("");
  const [playerImage, setPlayerImage] = useState<string>("");

  const [trainers, setTrainers] = useState<any[]>([]);
  const [currentTrainer, setCurrentTrainer] = useState<number>(0);
  const [trainerType, setTrainerType] = useState<string>("");
  const [trainerImage, setTrainerImage] = useState<string>("");

  const [battleMessage, setBattleMessage] = useState<string>("");

  const [playerHP, setPlayerHP] = useState<number>(100);
  const [trainerHP, setTrainerHP] = useState<number>(100);

  // Type advantage chart
  const typeAdvantages: Record<string, string[]> = {
    fire: ["grass", "ice", "bug", "steel"],
    water: ["fire", "ground", "rock"],
    grass: ["water", "ground", "rock"],
    electric: ["water", "flying"],
    ground: ["fire", "electric", "rock", "steel", "poison"],
    rock: ["fire", "flying", "bug", "ice"],
    fighting: ["rock", "dark", "ice", "normal", "steel"],
    psychic: ["fighting", "poison"],
    dark: ["psychic", "ghost"],
    ghost: ["psychic", "ghost"],
    ice: ["dragon", "flying", "grass", "ground"],
    dragon: ["dragon"],
  };

  // Load data
  useEffect(() => {
    const storedName = localStorage.getItem("playerName");
    const storedPokemon = localStorage.getItem("selectedPokemon");
    if (storedName) setPlayerName(storedName);
    if (storedPokemon) {
      setPlayerPokemon(storedPokemon);
      fetchPokemonData(storedPokemon, true);
    }

    setTrainers([
      { name: "Trainer Brock", pokemon: "onix" },
      { name: "Trainer Misty", pokemon: "starmie" },
      { name: "Boss Lance", pokemon: "dragonite" },
    ]);
  }, []);

  // Reset HP + fetch trainer Pokémon when trainer changes
  useEffect(() => {
    setPlayerHP(100);
    setTrainerHP(100);
    setBattleMessage("");
    if (trainers[currentTrainer]) {
      fetchPokemonData(trainers[currentTrainer].pokemon, false);
    }
  }, [currentTrainer, trainers]);

  // Fetch Pokémon details
  const fetchPokemonData = async (pokemon: string, isPlayer: boolean) => {
    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}`
      );
      const data = await res.json();
      const type = data.types[0].type.name;
      const img = data.sprites.front_default;
      if (isPlayer) {
        setPlayerType(type);
        setPlayerImage(img);
      } else {
        setTrainerType(type);
        setTrainerImage(img);
      }
    } catch (err) {
      console.error("Error fetching Pokémon:", err);
    }
  };

  // Calculate damage
  const calculateDamage = (attacker: string, defender: string) => {
    if (typeAdvantages[attacker]?.includes(defender)) return 40; // strong
    if (typeAdvantages[defender]?.includes(attacker)) return 10; // weak
    return 20; // neutral
  };

  // Fight logic
  const fightTurn = () => {
    if (!playerPokemon || currentTrainer >= trainers.length) return;
    const trainer = trainers[currentTrainer];

    // Player attack
    const playerAttack = calculateDamage(playerType, trainerType);
    setTrainerHP((prev) => Math.max(prev - playerAttack, 0));
    setBattleMessage(
      `${playerName}'s ${playerPokemon} used ${playerType}! It dealt ${playerAttack} damage!`
    );

    setTimeout(() => {
      if (trainerHP - playerAttack > 0) {
        const trainerAttack = calculateDamage(trainerType, playerType);
        setPlayerHP((prev) => Math.max(prev - trainerAttack, 0));
        setBattleMessage(
          `${trainer.name}'s ${trainer.pokemon} used ${trainerType}! It dealt ${trainerAttack} damage!`
        );
      }
    }, 1000);
  };

  // Win condition
  useEffect(() => {
    if (trainerHP === 0) {
      if (currentTrainer < trainers.length - 1) {
        setBattleMessage(
          `✅ ${playerName}'s ${playerPokemon} defeated ${trainers[currentTrainer].pokemon}!`
        );
        setTimeout(() => setCurrentTrainer(currentTrainer + 1), 1500);
      } else {
        setBattleMessage("🎉 You defeated all trainers and became Champion!");
        setTimeout(() => router.push("/first_page"), 3000);
      }
    }
  }, [trainerHP]);

  // Lose condition
  useEffect(() => {
    if (playerHP === 0) {
      setBattleMessage(`${playerName}'s ${playerPokemon} fainted! 💀 Game Over.`);
      setTimeout(() => router.push("/third_page"), 2000);
    }
  }, [playerHP]);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="flex items-center space-x-4 mt-[-180px] mb-[50px]">
        <img src="logo.svg" alt="Logo" className="w-32 h-32" />
        <span className="text-red-500 text-5xl font-extrabold cursor-default">
          BATTLE ARENA
        </span>
      </div>
      <p className="text-xl mb-4">
        Player: <span className="font-semibold">{playerName}</span> with{" "}
        <span className="text-green-600 font-bold">{playerPokemon}</span>
      </p>

      {currentTrainer < trainers.length && playerHP > 0 ? (
        <>
          <p className="text-lg mb-2">
            Current Opponent:{" "}
            <span className="font-bold text-blue-600">
              {trainers[currentTrainer].name}
            </span>{" "}
            using{" "}
            <span className="text-purple-600">
              {trainers[currentTrainer].pokemon}
            </span>
          </p>

          {/* Pokémon images + names + types */}
          <div className="flex space-x-20 mt-4">
            <div className="text-center">
              {playerImage && (
                <img src={playerImage} alt={playerPokemon!} className="w-32 h-32 mx-auto" />
              )}
              <p className="font-bold">{playerPokemon}</p>
              <p className="text-sm text-gray-600">Type: {playerType}</p>
              <div className="w-40 bg-gray-300 rounded-full h-4">
                <div
                  className="bg-green-500 h-4 rounded-full"
                  style={{ width: `${playerHP}%` }}
                ></div>
              </div>
              <p>{playerHP} / 100</p>
            </div>

            <div className="text-center">
              {trainerImage && (
                <img src={trainerImage} alt={trainers[currentTrainer].pokemon} className="w-32 h-32 mx-auto" />
              )}
              <p className="font-bold">{trainers[currentTrainer].pokemon}</p>
              <p className="text-sm text-gray-600">Type: {trainerType}</p>
              <div className="w-40 bg-gray-300 rounded-full h-4">
                <div
                  className="bg-red-500 h-4 rounded-full"
                  style={{ width: `${trainerHP}%` }}
                ></div>
              </div>
              <p>{trainerHP} / 100</p>
            </div>
          </div>

          {/* Fight Button */}
          <button
            onClick={fightTurn}
            disabled={playerHP === 0 || trainerHP === 0}
            className="mt-6 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
          >
            Attack
          </button>
        </>
      ) : null}

      {/* Battle Message */}
      {battleMessage && (
        <p className="mt-6 text-lg text-gray-800 font-semibold">{battleMessage}</p>
      )}
    </div>
  );
}
