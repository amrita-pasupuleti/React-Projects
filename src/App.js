import "./App.css";
import React, { useState, useEffect } from "react";
import supabase from "./supabase";

function App() {
  const [selectedButton, setSelectedButton] = useState("gc");

  // Function to handle button clicks and update the selectedButton state
  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
  };
  return (
    <div className="container">
      <div className="button-list">
        <ul>
          <li>
            <button onClick={() => handleButtonClick("gc")}>
              GPA Calculator
            </button>
          </li>
          <li>
            <button onClick={() => handleButtonClick("ttt")}>
              Tic-Tac-Toe
            </button>
          </li>
          <li>
            <button onClick={() => handleButtonClick("cc")}>
              Count Clicker
            </button>
          </li>
        </ul>
      </div>

      <div className="main-content">
        {selectedButton === "cc" && <Counter />}
        {selectedButton === "gc" && <Calculator />}
        {selectedButton === "ttt" && <TicTacToe />}
      </div>
    </div>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  const [showSave, setShowSave] = useState(false);

  const [scores, setScores] = useState([]);

  useEffect(function () {
    async function getScores() {
      let query = supabase.from("scores").select("*");

      const { data: scoresData } = await query.limit(500);

      setScores(scoresData);
    }
    getScores();
  }, []);

  return (
    <div className="counter-container">
      <p className="count">Count: {count}</p>
      <button className="num-btn" onClick={() => setCount((c) => c + 1)}>
        +1
      </button>
      <button className="reset-btn" onClick={() => setCount((c) => 0)}>
        Reset
      </button>

      <button className="save-btn" onClick={() => setShowSave((show) => !show)}>
        {showSave ? "Close" : "Save"}
      </button>

      {showSave ? <SaveCount setShowSave={setShowSave} count={count} /> : null}

      <div className="scores">
        <h1 className="scoresh1">Saved Scores</h1>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score) => (
              <tr key={score.id}>
                <td>{score.name}</td>
                <td>{score.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SaveCount({ count, setShowSave }) {
  const [name, setName] = useState("");
  const [setError] = useState("");

  const saveScore = async () => {
    if (name.trim() === "") {
      setError("Name is required.");
      return;
    }

    const { data: existingScores, error: existingScoresError } = await supabase
      .from("scores")
      .select()
      .eq("name", name);

    if (existingScoresError) {
      console.error("Error checking existing scores:", existingScoresError);
      return;
    }

    if (existingScores && existingScores.length > 0) {
      setError("Name is already taken.");
      return;
    }
  };

  return (
    <div className="scoreForm">
      <p>Save Your Score Here:</p>
      <label>
        Name:{" "}
        <input
          className="form"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <button className="savebtn" onClick={saveScore}>
        Save
      </button>
    </div>
  );
}

function Calculator() {
  const [courses, setCourses] = useState([
    { name: "Course 1", grade: "C" },
    { name: "Course 2", grade: "C" },
    { name: "Course 3", grade: "C" },
  ]);

  const [grades, setGrades] = useState({
    "A+": 4.0,
    A: 4.0,
    "A-": 3.7,
    "B+": 3.3,
    B: 3.0,
    "B-": 2.7,
    "C+": 2.3,
    C: 2.0,
    "C-": 1.7,
    D: 1.0,
    F: 0.0,
  });

  const addCourse = () => {
    setCourses([...courses, { name: "", grade: "" }]);
  };

  const handleCourseChange = (index, key, value) => {
    const updatedCourses = [...courses];
    updatedCourses[index][key] = value;
    setCourses(updatedCourses);
  };

  const handleGradeChange = (grade, value) => {
    setGrades((prevGrades) => ({
      ...prevGrades,
      [grade]: parseFloat(value),
    }));
  };

  const calculateGPA = () => {
    const totalCredits = courses.length;
    let totalGradePoints = 0;

    courses.forEach((course) => {
      const numericGrade = parseFloat(grades[course.grade.toUpperCase()]);
      totalGradePoints += numericGrade;
    });

    const gpa = totalGradePoints / totalCredits;
    return gpa.toFixed(2); // Round to two decimal places
  };

  return (
    <>
      <section className="title">
        <p>GPA Calculator</p>
      </section>

      <div className="calculator-container">
        <div className="grades-container">
          <h2>Grade Values</h2>
          {Object.entries(grades).map(([grade, value]) => (
            <div key={grade}>
              {grade}:
              <input
                style={{ color: "black" }}
                type="number"
                step="0.1"
                value={value}
                onChange={(e) => handleGradeChange(grade, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="courses-container">
          <h2>Courses</h2>

          {courses.map((course, index) => (
            <div key={index}>
              <input
                style={{ color: "black" }}
                type="text"
                placeholder={`Course ${index + 1} name`}
                value={course.name}
                onChange={(e) =>
                  handleCourseChange(index, "name", e.target.value)
                }
              />
              <select
                style={{ color: "black" }}
                value={course.grade}
                onChange={(e) =>
                  handleCourseChange(index, "grade", e.target.value)
                }
              >
                <option value="">Select Grade</option>
                <option className="gradeoption" value="A">
                  A
                </option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="F">F</option>
              </select>
            </div>
          ))}
          <button className="addCourse" onClick={addCourse}>
            Add Course
          </button>
        </div>

        <div className="gpa-container">
          <h2>GPA</h2>
          <p>{`Your GPA is: ${calculateGPA()}`}</p>
        </div>
      </div>
    </>
  );
}

function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);

  const handleClick = (index) => {
    if (board[index] || calculateWinner(board)) {
      return;
    }

    const newBoard = board.slice();
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const calculateWinner = (board) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const winner = calculateWinner(board);
  const status = winner
    ? `Winner: ${winner}`
    : `Next player: ${isXNext ? "X" : "O"}`;

  const renderSquare = (index) => {
    return (
      <button className="square" onClick={() => handleClick(index)}>
        {board[index]}
      </button>
    );
  };

  const restartGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  return (
    <div className="game">
      <div className="game-board">
        <div className="status">{status}</div>
        <div className="board-row">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="board-row">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="board-row">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
        <button className="restart-button" onClick={restartGame}>
          Restart Game
        </button>
      </div>
    </div>
  );
}

export default App;
