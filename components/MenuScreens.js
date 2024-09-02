import React, { useState, useRef, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Animated } from "react-native";
import ButtonStatus from "./ButtonsStatus";
import { CounterContext } from "../contex/CounterContex";

export default function MenuScreens(props) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const animation = useRef(new Animated.Value(0)).current;
  const { arreyFunctionButtonStatus } = useContext(CounterContext);

  const handleItemPress = (index) => {
    if (selectedIndex === index) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setSelectedIndex(null));
    } else {
      setSelectedIndex(index);
      Animated.timing(animation, {
        toValue: 200,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const renderItem = ({ item, index }) => (
    <View>
      <TouchableOpacity style={styles.itemContainer} onPress={() => handleItemPress(index)}>
        <Text style={styles.englishWord}>{item.englishWord}</Text>
        <Text style={styles.separator}> - </Text>
        <Text style={styles.translatedWord}>{item.translatedWord}</Text>
      </TouchableOpacity>

      {selectedIndex === index && (
        <Animated.View style={[styles.detailsContainer, { height: animation }]}>
          <Text style={styles.detailText}>IPA: {item.ipa}</Text>
          <Text style={styles.detailText}>Exemplo: {item.sentence}</Text>
          <Text style={styles.detailText}>Tradução: {item.translatedSentence}</Text>
          <Text style={styles.detailText}>Definição: {item.definition}</Text>
          <ButtonStatus
            buttonFunctionNotLearned={() => {
              arreyFunctionButtonStatus[0].notLearned([...props.wordList].reverse(), index);
            }}
            buttonFunctionUndecided={() => {
              arreyFunctionButtonStatus[1].undecided([...props.wordList].reverse(), index);
            }}
            buttonFunctionLearned={() => {
              arreyFunctionButtonStatus[2].learned([...props.wordList].reverse(), index);
            }}
          />
        </Animated.View>
      )}
    </View>
  );

  return (
    <View style={{ backgroundColor: "#444", flex: 1 }}>
      <FlatList
        data={[...props.wordList].reverse()}
        renderItem={renderItem}
        keyExtractor={(item) => item.englishWord}
        contentContainerStyle={styles.container}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#444",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#222",
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
  detailsContainer: {
    overflow: "hidden",
    backgroundColor: "#333",
    borderRadius: 8,
    marginTop: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  detailText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 5,
  },
});
