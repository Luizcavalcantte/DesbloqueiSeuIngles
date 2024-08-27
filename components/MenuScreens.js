import React, { useState, useRef } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Animated } from "react-native";

export default function MenuScreens(props) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const animation = useRef(new Animated.Value(0)).current;

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
        toValue: 150,
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
        </Animated.View>
      )}
    </View>
  );

  return (
    <View style={{ backgroundColor: "#777", flex: 1 }}>
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
    backgroundColor: "#777",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#333",
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
    backgroundColor: "#444",
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
