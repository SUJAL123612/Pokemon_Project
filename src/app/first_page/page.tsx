import Link from "next/link";

export default function Home() {
    return (
      <>
        <div className="w-full h-[592px] relative flex flex-col items-center">
          <div className="flex items-center space-x-4 -mt-[50px] ">
            <img
              src="logo.svg"
              alt="Logo"
              className="w-50 h-50"
            />
            <span className="text-red-500 text-[50px] font-extrabold leading-tight cursor-default">BATTLE ARENA</span>
          </div>
          <img
            src="poke.jpg"
            alt="Pokemon"
            className="w-full h-[500px] object-contain mt-[-70px] "
          />
          <Link className="text-black text-[30px] mt-[-50px] cursor-pointer ml-3 font-bold hover:text-black/70" href="/second_page">PLAY</Link>
        </div>
      </>
    );
  }
  