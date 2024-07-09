import { useEffect, useState } from "react";
import "./App.css";
import ReactLoading from "react-loading";
import { ErrorPage } from "./Components/ErrorPage.jsx";
import { getCountryAndCapitalCity, getCountryAndCities } from "./utils/app.js";
import axios from "axios";
import { QuizCard } from "./Components/QuizCard.jsx";

function App() {
  const [quizBank, setQuizBank] = useState([]);
  const [shuffledQuizBank, setShuffledQuizBank] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    axios
      .all([getCountryAndCapitalCity, getCountryAndCities])
      .then(
        axios.spread((res1, res2) => {
          //filter our the contries without capital names
          const countryAndCapitalCityBank = res1.data.data.filter(
            (obj) => obj.capital.length > 0
          );
          const countryAndCitiesBank = res2.data.data;

          const combinedArray = countryAndCapitalCityBank.map((obj) => {
            const matchingCountry = countryAndCitiesBank.find(
              (item) => item.country === obj.name
            );

            if (matchingCountry) {
              return {
                ...obj,
                options: matchingCountry.cities.filter(
                  (city) => city !== obj.capital
                ),
              };
            }
          });
          return combinedArray;
        })
      )
      .then((combinedArray) => {
        setQuizBank(combinedArray.filter((item) => item !== undefined));
        setLoading(false);
      })
      .catch((err) => {
        setError({ err });
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (quizBank.length) {
      const quizBankWithShuffledOptions = quizBank.map((question) => {
        return {
          ...question,
          options: question.options
            .slice(0, 3)
            .concat(question.capital)
            .sort(() => 0.5 - Math.random()),
        };
      });
      setShuffledQuizBank(
        quizBankWithShuffledOptions.sort(() => 0.5 - Math.random())
      );
    }
  }, [quizBank]);

  const handleClick = (e) => {
    if (e.target.value === shuffledQuizBank[index].capital) {
      setIsAnswerCorrect(true);
    }
  };

  const handleNext = () => {
    setIndex(Math.floor(Math.random() * quizBank.length));
    setIsAnswerCorrect(false);
  };

  if (error) {
    return <ErrorPage></ErrorPage>;
  }

  return (
    <>
      {isLoading && <ReactLoading type="spin"></ReactLoading>}
      {shuffledQuizBank.length && (
        <>
          <h1>Country Capital Quiz</h1>
          <QuizCard
            index={index}
            shuffledQuizBank={shuffledQuizBank}
            handleClick={handleClick}
          ></QuizCard>
          {isAnswerCorrect}
          <button
            disabled={!isAnswerCorrect}
            onClick={handleNext}
            className={`next ${isAnswerCorrect ? "green" : "grey"}`}
          >
            Next
          </button>
        </>
      )}
    </>
  );
}

export default App;
