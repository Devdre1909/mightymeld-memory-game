import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import * as icons from "react-icons/gi";
import { Tile } from "./Tile";

export const possibleTileContents = [
  icons.GiHearts,
  icons.GiWaterDrop,
  icons.GiDiceSixFacesFive,
  icons.GiUmbrella,
  icons.GiCube,
  icons.GiBeachBall,
  icons.GiDragonfly,
  icons.GiHummingbird,
  icons.GiFlowerEmblem,
  icons.GiOpenBook,
];

export function StartScreen({ start }) {
  return (
    <>
      <div className="flex items-center justify-center h-screen w-full">
        <div className="w-[450px] h-[450px] flex items-center justify-center bg-pink-100 rounded-lg">
          <div className="flex flex-col items-center justify-center">
            <h1 className="font-bold text-3xl text-pink-500">Memory</h1>
            <p className="mt-7 text-pink-500">
              Flip over tiles looking for pairs
            </p>
            <button
              onClick={start}
              className="w-32 px-8 py-2 text-white bg-gradient-to-b from-pink-400 to-pink-600 rounded-full mt-8 focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 ease-in-out duration-300 outline-none"
            >
              Play
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export function PlayScreen({ end }) {
  const [tiles, setTiles] = useState(null);
  const [tryCount, setTryCount] = useState(0);
  const [points, setPoints] = useState({
    x: 0,
    y: 0,
  });

  const getTiles = (tileCount) => {
    // Throw error if count is not even.
    if (tileCount % 2 !== 0) {
      throw new Error("The number of tiles must be even.");
    }

    // Use the existing list if it exists.
    if (tiles) return tiles;

    const pairCount = tileCount / 2;

    // Take only the items we need from the list of possibilities.
    const usedTileContents = possibleTileContents.slice(0, pairCount);

    // Double the array and shuffle it.
    const shuffledContents = usedTileContents
      .concat(usedTileContents)
      .sort(() => Math.random() - 0.5)
      .map((content) => ({ content, state: "start" }));

    setTiles(shuffledContents);
    return shuffledContents;
  };

  const flip = (i) => {
    // Is the tile already flipped? We don’t allow flipping it back.
    if (tiles[i].state === "flipped") return;

    // How many tiles are currently flipped?
    const flippedTiles = tiles.filter((tile) => tile.state === "flipped");
    const flippedCount = flippedTiles.length;

    // Don't allow more than 2 tiles to be flipped at once.
    if (flippedCount === 2) return;

    // On the second flip, check if the tiles match.
    if (flippedCount === 1) {
      setTryCount((c) => c + 1);

      const alreadyFlippedTile = flippedTiles[0];
      const justFlippedTile = tiles[i];

      let newState = "start";

      if (alreadyFlippedTile.content === justFlippedTile.content) {
        confetti({
          ticks: 100,
        });
        newState = "matched";
      }

      // After a delay, either flip the tiles back or mark them as matched.
      setTimeout(() => {
        setTiles((prevTiles) => {
          const newTiles = prevTiles.map((tile) => ({
            ...tile,
            state: tile.state === "flipped" ? newState : tile.state,
          }));

          // If all tiles are matched, the game is over.
          if (newTiles.every((tile) => tile.state === "matched")) {
            setTimeout(end, 0);
          }

          return newTiles;
        });
      }, 1000);
    }

    setTiles((prevTiles) => {
      return prevTiles.map((tile, index) => ({
        ...tile,
        state: i === index ? "flipped" : tile.state,
      }));
    });
  };

  useEffect(() => {
    const handleKeyboardNavigation = (e) => {
      const presentPoint = points;

      const isArrowKey = [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
      ].includes(e.key);

      if (!isArrowKey) return;

      if (presentPoint.x === 0 && presentPoint.y === 0) {
        document.getElementById("1-1").focus();
        setPoints({ x: 1, y: 1 });
        return;
      }

      console.log('...')

      if (e.key === "ArrowUp") {
        presentPoint.y = presentPoint.y === 1 ? 4 : presentPoint.y - 1;
      }
      if (e.key === "ArrowDown") {
        presentPoint.y = presentPoint.y === 4 ? 1 : presentPoint.y + 1;
      }
      if (e.key === "ArrowLeft") {
        presentPoint.x = presentPoint.x === 1 ? 4 : presentPoint.x - 1;
      }
      if (e.key === "ArrowRight") {
        presentPoint.x = presentPoint.x === 4 ? 1 : presentPoint.x + 1;
      }

      const newFocus = document.getElementById(
        `${presentPoint.x}-${presentPoint.y}`
      );
      if (newFocus) {
        newFocus.focus();
        setPoints(presentPoint);
      }
    };

    document.addEventListener("keyup", handleKeyboardNavigation);

    return () => {
      document.removeEventListener("keyup", handleKeyboardNavigation);
    };
  }, [points]);

  return (
    <>
      <div className="flex items-center justify-center h-screen w-full">
        <div className="w-[400px] h-[400px]">
          <div className="flex items-start justify-center">
            <span className="text-sm text-indigo-500 mr-2">Tries</span>
            <span className="text-sm bg-indigo-200 text-indigo-500 font-semi px-2 rounded-md">
              {tryCount}
            </span>
          </div>

          <div className="bg-indigo-100 p-5 rounded-lg grid grid-cols-4 w-full h-full gap-4 mt-8">
            {getTiles(16).map((tile, i) => {
              const index = i + 1;
              const value = {
                x: index % 4 === 0 ? 4 : index % 4,
                y: Math.ceil(index / 4),
              };
              return (
                <Tile
                  id={`${value.x}-${value.y}`}
                  key={i}
                  flip={() => flip(i)}
                  {...tile}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
