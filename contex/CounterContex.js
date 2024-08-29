import React, { createContext, useState } from "react";

export const CounterContext = createContext();

export const CounterProvider = ({ children }) => {
  const [wordListLearned, setWordListLearned] = useState([]);
  const [wordListUndecided, setWordListUndecided] = useState([]);
  const [wordListNotLearned, setWordListNotLearned] = useState([]);
  function dbContext(x, y, z) {
    setWordListLearned(x);
    setWordListUndecided(y);
    setWordListNotLearned(z);
  }

  const [functionLearned, setFunctionLearned] = useState(null);
  const [functionUndecided, setFunctionUndecided] = useState(null);
  const [functionNotLearned, setFunctionNotLearned] = useState(null);
  const [arreyFunctionButtonStatus, setArreyFunctionButtonStatus] = useState([]);
  function functionContextButtonStatus(notLearned, undecided, learned) {
    setArreyFunctionButtonStatus([{ notLearned }, { undecided }, { learned }]);
  }

  return (
    <CounterContext.Provider
      value={{
        wordListLearned,
        wordListUndecided,
        wordListNotLearned,
        dbContext,
        functionLearned,
        functionUndecided,
        functionNotLearned,
        functionContextButtonStatus,
        arreyFunctionButtonStatus,
      }}
    >
      {children}
    </CounterContext.Provider>
  );
};
