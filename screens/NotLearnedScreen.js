import React, { useContext } from "react";

import { CounterContext } from "../contex/CounterContex";
import MenuScreens from "../components/MenuScreens";

export default function NotLearnedScreen() {
  const { wordListNotLearned } = useContext(CounterContext);

  return <MenuScreens wordList={wordListNotLearned} />;
}
