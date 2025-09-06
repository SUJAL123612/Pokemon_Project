"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function FourthPage() {
    const router = useRouter();

    const [playerName, setPlayerName] = useState<string>("");
    const [playerPokemon, setPlayerPokemon] = useState<string | null>(null);
    const [trainers, setTrainers] = useState<any[]>([]);
    const [currentTrainer, setCurrentTrainer] = useState<number>(0);
    const [battleMessage, setBattleMessage] = useState<string>("");

    const [playerHP, setPlayerHP] = useState<number>(100);
    const [trainerHP, setTrainerHP] = useState<number>(100);

    // Load data from localStorage (player + Pokémon)
    useEffect(() => {
        const storedName = localStorage.getItem("playerName");
        const storedPokemon = localStorage.getItem("selectedPokemon");
        if (storedName) setPlayerName(storedName);
        if (storedPokemon) setPlayerPokemon(storedPokemon);

        // Example trainers (only one Pokémon each)
        setTrainers([
            { name: "Trainer Brock", pokemon: "onix" },
            { name: "Trainer Misty", pokemon: "starmie" },
            { name: "Boss Lance", pokemon: "dragonite" }, // 💀 Final Boss
        ]);
    }, []);

    // Reset HP when new trainer appears
    useEffect(() => {
        setPlayerHP(100);
        setTrainerHP(100);
        setBattleMessage("");
    }, [currentTrainer]);

    // Battle logic
    const fightTurn = () => {
        if (!playerPokemon || currentTrainer >= trainers.length) return;

        const trainer = trainers[currentTrainer];

        // Player attacks first
        const playerAttack = Math.floor(Math.random() * 20) + 10;
        setTrainerHP((prev) => Math.max(prev - playerAttack, 0));
        setBattleMessage(
            `${playerName}'s ${playerPokemon} used a powerful attack! It dealt ${playerAttack} damage!`
        );

        setTimeout(() => {
            if (trainerHP - playerAttack > 0) {
                const trainerAttack = Math.floor(Math.random() * 20) + 10;
                setPlayerHP((prev) => Math.max(prev - trainerAttack, 0));
                setBattleMessage(
                    `${trainer.name}'s ${trainer.pokemon} fought back and dealt ${trainerAttack} damage!`
                );
            }
        }, 1000);
    };

    // When trainer is defeated
    useEffect(() => {
        if (trainerHP === 0) {
            if (currentTrainer < trainers.length - 1) {
                setBattleMessage(
                    `✅ ${playerName}'s ${playerPokemon} defeated ${trainers[currentTrainer].pokemon}!`
                );
                setTimeout(() => setCurrentTrainer(currentTrainer + 1), 1500);
            } else {
                setBattleMessage("🎉 You defeated all trainers and became Champion!");
                // Redirect after 3 sec to home (second page)
                setTimeout(() => {
                    router.push("/second_page");
                }, 3000);
            }
        }
    }, [trainerHP]);

    // When trainer is defeated (Win condition)
    useEffect(() => {
        if (trainerHP === 0) {
            if (currentTrainer < trainers.length - 1) {
                setBattleMessage(
                    `✅ ${playerName}'s ${playerPokemon} defeated ${trainers[currentTrainer].pokemon}!`
                );
                setTimeout(() => setCurrentTrainer(currentTrainer + 1), 1500);
            } else {
                setBattleMessage("🎉 You defeated all trainers and became Champion!");
                // Redirect after 3 sec to home (first page)
                setTimeout(() => {
                    router.push("/first_page");
                }, 3000);
            }
        }
    }, [trainerHP]);

    // When player faints (Lose condition)
    useEffect(() => {
        if (playerHP === 0) {
            setBattleMessage(`${playerName}'s ${playerPokemon} fainted! 💀 Game Over.`);
            // Redirect back to third page after 2 sec
            setTimeout(() => {
                router.push("/third_page");
            }, 2000);
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
                        using <span className="text-purple-600">{trainers[currentTrainer].pokemon}</span>
                    </p>

                    {/* Health Bars */}
                    <div className="flex space-x-20 mt-4">
                        <div className="text-center">
                            <p className="font-bold">{playerPokemon}</p>
                            <div className="w-40 bg-gray-300 rounded-full h-4">
                                <div
                                    className="bg-green-500 h-4 rounded-full"
                                    style={{ width: `${playerHP}%` }}
                                ></div>
                            </div>
                            <p>{playerHP} / 100</p>
                        </div>

                        <div className="text-center">
                            <p className="font-bold">{trainers[currentTrainer].pokemon}</p>
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
                <p className="mt-6 text-lg text-gray-800 font-semibold">
                    {battleMessage}
                </p>
            )}
        </div>
    );
}
