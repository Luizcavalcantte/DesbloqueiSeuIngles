import React, { useContext } from "react";

import { CounterContext } from "../contex/CounterContex";
import MenuScreens from "../components/MenuScreens";

export default function LearnedScreen() {
  const { wordListLearned } = useContext(CounterContext);

  return <MenuScreens wordList={wordListLearned} />;
}
