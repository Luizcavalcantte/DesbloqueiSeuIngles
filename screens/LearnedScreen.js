import React, { useContext } from "react";
import { View, Text } from "react-native";
import { CounterContext } from "../contex/CounterContex";

export default function LearnedScreen() {
  const { bdTeste } = useContext(CounterContext);
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {bdTeste.map((item, index) => (
        <View key={index}>
          <Text style={{ color: "#000", fontSize: 20 }}>{item.englishWord}</Text>
        </View>
      ))}
    </View>
  );
}
