import React, { useContext } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { CounterContext } from "../contex/CounterContex";

export default function UndecidedScreen() {
  const { wordListUndecided } = useContext(CounterContext);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.englishWord}>{item.englishWord}</Text>
      <Text style={styles.separator}> - </Text>
      <Text style={styles.translatedWord}>{item.translatedWord}</Text>
    </View>
  );

  return (
    <FlatList
      data={wordListUndecided}
      renderItem={renderItem}
      keyExtractor={(item) => item.englishWord}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#777",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#444",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  englishWord: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  separator: {
    color: "#fff",
    fontSize: 18,
  },
  translatedWord: {
    color: "#fff",
    fontSize: 18,
    fontStyle: "italic",
  },
});
