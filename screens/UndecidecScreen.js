import React, { useContext, useState, useRef } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { CounterContext } from "../contex/CounterContex";

export default function UndecidedScreen() {
  const { wordListUndecided } = useContext(CounterContext);
  const [selectedIndex, setSelectedIndex] = useState(null); // Estado para rastrear o item selecionado
  const animation = useRef(new Animated.Value(0)).current; // Estado animado para controlar a altura da aba

  // Função para lidar com o clique em um item
  const handleItemPress = (index) => {
    if (selectedIndex === index) {
      // Se o item já estiver selecionado, anima a aba para fechá-la
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setSelectedIndex(null));
    } else {
      // Se um novo item for selecionado, fecha a aba atual e abre a nova
      setSelectedIndex(index);
      Animated.timing(animation, {
        toValue: 150, // Define a altura da aba expandida
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
          <Text style={styles.detailText}>Definição: {item.definition}</Text>
          <Text style={styles.detailText}>Exemplo: {item.sentence}</Text>
          <Text style={styles.detailText}>Tradução: {item.translatedSentence}</Text>
        </Animated.View>
      )}
    </View>
  );

  return (
    <FlatList
      data={[...wordListUndecided].reverse()} // Lista invertida
      renderItem={renderItem}
      keyExtractor={(item) => item.englishWord}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  englishWord: {
    color: "#333",
    fontSize: 18,
    fontWeight: "bold",
  },
  separator: {
    color: "#888",
    fontSize: 18,
  },
  translatedWord: {
    color: "#666",
    fontSize: 18,
    fontStyle: "italic",
  },
  detailsContainer: {
    overflow: "hidden",
    backgroundColor: "#e8e8e8",
    borderRadius: 8,
    marginTop: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  detailText: {
    color: "#333",
    fontSize: 16,
    marginBottom: 5,
  },
});
