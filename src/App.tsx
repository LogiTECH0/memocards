import { useEffect, useState } from "react";
import "./App.css";
type Record = {
  time: number;
  difficulty: "easy" | "medium" | "hard";
  date: string;
};
function App() {
  const [isActive, setActive] = useState(false);
  const [isVisible, setVisible] = useState(true);
  const [opened, setOpened] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [isHard, setHard] = useState(false);
  const [isEasy, setEasy] = useState(false);
  const [time, setTime] = useState(0);
  const [filter, setFilter] = useState<"all" | "easy" | "medium" | "hard">(
    "all",
  );
  const [sortOrder, setSortOrder] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const cards = [
    "/blueberries.png",
    "/cherries.png",
    "/coconut.png",
    "/grapes.png",
    "/green-apple.png",
    "/kiwi.png",
    "/lemon.png",
    "/lime.png",
    "/mango.png",
    "/peach.png",
    "/pear.png",
    "/pineapple.png",
    "/red-apple.png",
    "/strawberry.png",
    "/tangerine.png",
    "/watermelon.png",
  ];
  const [newCards, setNewCards] = useState<string[]>([]);
  const saveRecord = (time: number, difficulty: string) => {
    const records = JSON.parse(localStorage.getItem("records") || "[]");

    const newRecord = {
      time,
      difficulty,
      date: new Date().toLocaleString(),
    };

    const updated = [...records, newRecord];

    localStorage.setItem("records", JSON.stringify(updated));
  };
  const getRecords = () => {
    return JSON.parse(localStorage.getItem("records") || "[]");
  };
  const timeConvert = (time: number) => {
    const min = Math.trunc(time / 60);
    const sec = time - min * 60;
    return { min, sec };
  };
  const handleGame = (int: number) => {
    setTime(0);
    setEasy(false);
    setHard(false);
    const diff = int / 2;
    const selected: string[] = [];
    while (selected.length < diff) {
      const randomElement = cards[Math.floor(Math.random() * cards.length)];
      if (!selected.includes(randomElement)) selected.push(randomElement);
    }
    const gameCards = [...selected, ...selected].sort(
      () => Math.random() - 0.5,
    );
    setNewCards(gameCards);
    setVisible(false);
    setActive(true);
    if (int === 32) {
      setHard(true);
    } else if (int === 8) {
      setEasy(true);
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((e) => e + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const handleClick = (index: number) => {
    if (opened.length === 2) return;
    if (opened.includes(index) || matched.includes(index)) return;

    const newOpened = [...opened, index];
    setOpened(newOpened);

    if (newOpened.length === 2) {
      const [first, second] = newOpened;
      if (newCards[first] === newCards[second]) {
        const newMatched = [...matched, first, second];
        setMatched((prev) => [...prev, first, second]);
        setOpened([]);
        if (newMatched.length === newCards.length) {
          setTimeout(() => {
            setActive(false);
            setVisible(true);

            setOpened([]);
            setMatched([]);
            setNewCards([]);

            let difficulty = "medium";
            if (isEasy) {
              difficulty = "easy";
            }
            if (isHard) {
              difficulty = "hard";
            }
            saveRecord(time, difficulty);
            if (isMobile) {
              setShowLeaderboard(true);
            } else {
              alert(`Перемога за ${min}m ${sec}s 😎`);
            }
          }, 100);
        }
      } else {
        setTimeout(() => {
          setOpened([]);
        }, 1000);
      }
    }
  };
  const gameClasses = `game ${isHard ? "hardgame" : ""} ${isEasy ? "easygame" : ""}`;
  const { min, sec } = timeConvert(time);
  const records: Record[] = getRecords();
  const filtered = records.filter(
    (r: Record) => filter === "all" || r.difficulty === filter,
  );
  const displayed = filtered.sort((a, b) =>
    sortOrder ? a.time - b.time : b.time - a.time,
  );
  return (
    <>
      <div className="page">
        <div className="left">
          <div className="scroll-bg">
            <img src="/background.png" alt="" />
            <img src="/background.png" alt="" />
          </div>
        </div>
        <div id="root">
          <div className="app">
            <h1>MemoCards</h1>
            {isVisible && (
              <div className="buttons">
                <button className="easy" onClick={() => handleGame(8)}>
                  Easy
                </button>
                <button className="medium" onClick={() => handleGame(16)}>
                  Medium
                </button>
                <button className="hard" onClick={() => handleGame(32)}>
                  Hard
                </button>
              </div>
            )}

            {isActive && (
              <div>
                <h2 className="timer">
                  {min}m {sec}s
                </h2>
                <div className="game-container">
                  <div className={gameClasses}>
                    {newCards.map((card, index) => (
                      <div
                        className={`card ${opened.includes(index) || matched.includes(index) ? "open" : "closed"}`}
                        onClick={() => handleClick(index)}
                      >
                        <img
                          key={index}
                          className={
                            opened.includes(index) || matched.includes(index)
                              ? "visible"
                              : "hidden"
                          }
                          src={card}
                        ></img>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {!isMobile && (
          <div className="right">
            <div className="scroll-bg">
              <img src="/background.png" alt="" />
              <img src="/background.png" alt="" />
            </div>

            <div className="best">
              <h2>Your Best</h2>
              <div className="diffs">
                <button onClick={() => setFilter("easy")}>Easy</button>
                <button onClick={() => setFilter("medium")}>Medium</button>
                <button onClick={() => setFilter("hard")}>Hard</button>
              </div>
              <div className="board">
                {displayed.map((rec: Record, index: number) => (
                  <div key={index} className="record">
                    <span>{index + 1}. </span>
                    <span>{rec.difficulty.toUpperCase()} </span>
                    <span>
                      {Math.trunc(rec.time / 60)}m {rec.time % 60}s
                    </span>
                  </div>
                ))}
              </div>
              <div className="bottom-buttons">
                <button id="all" onClick={() => setFilter("all")}>
                  View All
                </button>
                <button id="sort" onClick={() => setSortOrder((prev) => !prev)}>
                  {sortOrder ? "↑" : "↓"}
                </button>
              </div>
            </div>
          </div>
        )}
        {isMobile && showLeaderboard && (
          <div className="overlay" onClick={() => setShowLeaderboard(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="best">
                <h2>Your Best</h2>

                <div className="diffs">
                  <button onClick={() => setFilter("easy")}>Easy</button>
                  <button onClick={() => setFilter("medium")}>Medium</button>
                  <button onClick={() => setFilter("hard")}>Hard</button>
                </div>

                <div className="board">
                  {displayed.map((rec, index) => (
                    <div key={index} className="record">
                      <span>{index + 1}. </span>
                      <span>{rec.difficulty.toUpperCase()} </span>
                      <span>
                        {Math.trunc(rec.time / 60)}m {rec.time % 60}s
                      </span>
                    </div>
                  ))}
                </div>

                <div className="bottom-buttons">
                  <button id="all" onClick={() => setFilter("all")}>
                    View All
                  </button>
                  <button id="sort" onClick={() => setSortOrder((p) => !p)}>
                    {sortOrder ? "↑" : "↓"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
