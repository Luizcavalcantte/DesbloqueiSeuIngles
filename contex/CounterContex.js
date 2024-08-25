import React, { createContext, useState } from "react";

export const CounterContext = createContext();

export const CounterProvider = ({ children }) => {
  const [bdTeste, setbdTeste] = useState([]);

  function funcTeste(x) {
    setbdTeste(x);
  }

  return <CounterContext.Provider value={{ bdTeste, funcTeste }}>{children}</CounterContext.Provider>;
};
