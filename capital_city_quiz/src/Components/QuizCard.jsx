export const QuizCard = (props) => {
  const { index, shuffledQuizBank, handleClick } = props;
  return (
    <>
      <div className="quiz-container">
        <h2>{shuffledQuizBank[index].name}</h2>
        <div className="options-container">
          {shuffledQuizBank[index].options.map((option, index) => (
            <button
              key={index}
              value={option}
              onClick={handleClick}
              className="option-button"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
