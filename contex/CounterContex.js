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

  return (
    <CounterContext.Provider value={{ wordListLearned, wordListUndecided, wordListNotLearned, dbContext }}>
      {children}
    </CounterContext.Provider>
  );
};
