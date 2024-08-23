import { View, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import * as SQLite from "expo-sqlite";
import data from "../assets/word_data.json";

export default function HomeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wordList, setWordList] = useState([]);
  const [wordListLearned, setWordListLearned] = useState([]);
  const [wordListUndecided, setWordListUndecided] = useState([]);
  const [wordListNotLearned, setWordListNotLearned] = useState([]);
  const [db, setDb] = useState(null);

  useEffect(() => {
    async function setup() {
      const database = await SQLite.openDatabaseAsync("wordsdb");
      setDb(database);

      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS words (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          englishWord TEXT,
          translatedWord TEXT,
          sentence TEXT,
          translatedSentence TEXT,
          ipa TEXT,
          definition TEXT,
          status INTEGER
        );
      `);

      updatebd(database);
    }

    setup();
  }, []);

  async function updatebd(database) {
    const dbAtualizado = await database.getAllAsync("SELECT * FROM words");
    if (dbAtualizado.length === 0) {
      for (let i = 0; i < data.length; i++) {
        let wordItem = data[i];
        await database.runAsync(
          "INSERT INTO words (englishWord, translatedWord, sentence, translatedSentence, ipa, definition, status) VALUES (?, ?, ?, ?, ?, ?, ?);",
          [
            wordItem.englishWord,
            wordItem.translatedWord,
            wordItem.sentence,
            wordItem.translatedSentence,
            wordItem.ipa,
            wordItem.definition,
            wordItem.status,
          ]
        );
      }
    }

    const updatedWords = await database.getAllAsync("SELECT * FROM words");
    setWordList(updatedWords);
    createFilteredList(updatedWords);
  }

  async function updateStatus(status) {
    if (!db || wordList.length === 0) return; // Ensure db is initialized and list is not empty

    const word = wordList[currentIndex];
    await db.runAsync("UPDATE words SET status = ? WHERE id = ?", [status, word.id]);
    const updatedWords = await db.getAllAsync("SELECT * FROM words");
    setWordList(updatedWords);
    createFilteredList(updatedWords);

    // Update currentIndex to ensure it stays within bounds of the new list
    setCurrentIndex((prevIndex) => {
      // Find the new index in the filtered list
      const notLearned = updatedWords.filter((word) => word.status === 0);
      const newIndex = notLearned.findIndex((word) => word.id === wordList[prevIndex]?.id);
      return newIndex !== -1 ? newIndex : 0;
    });
  }

  function createFilteredList(words) {
    const learned = words.filter((word) => word.status === 2);
    const undecided = words.filter((word) => word.status === 1);
    const notLearned = words.filter((word) => word.status === 0);

    setWordListLearned(learned);
    setWordListUndecided(undecided);
    setWordListNotLearned(notLearned);

    // Ensure currentIndex is valid for the notLearned list
    setCurrentIndex((prevIndex) => Math.min(prevIndex, notLearned.length - 1));
  }

  if (!wordListNotLearned || wordListNotLearned.length === 0) {
    return (
      <ActivityIndicator
        style={{ alignItems: "center", justifyContent: "center", flex: 1, backgroundColor: "#2c2f38" }}
        size="large"
        color="#fff"
      />
    );
  }

  const nextWord = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % wordListNotLearned.length);
  };

  const previousWord = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + wordListNotLearned.length) % wordListNotLearned.length);
  };

  function learned() {
    updateStatus(2);
  }

  function undecided() {
    updateStatus(1);
  }

  function notLearned() {
    updateStatus(0);
  }

  const word = wordListNotLearned[currentIndex];

  return (
    <View style={styles.Container}>
      <View style={styles.contents}>
        <Pressable onPress={() => console.log(wordListNotLearned[currentIndex])}>
          <Text>0</Text>
        </Pressable>
        <View style={styles.wordContainer}>
          <Pressable
            style={[styles.buttonChangeWord, { opacity: currentIndex > 0 ? 1 : 0 }]}
            onPress={previousWord}
            disabled={currentIndex === 0}
          >
            <Text style={[{ fontSize: 30, color: "#FFFFFF" }]}>{"<"}</Text>
          </Pressable>
          <Text style={styles.englishWord}>{wordListNotLearned[currentIndex].englishWord}</Text>
          <Pressable style={styles.buttonChangeWord} onPress={nextWord}>
            <Text style={[{ fontSize: 30, color: "#FFFFFF" }]}>{">"}</Text>
          </Pressable>
        </View>
        <Text style={styles.ipa}>{word.ipa}</Text>
        <Text style={styles.translatedWord}>{word.translatedWord}</Text>
        <Text style={styles.example}>{word.sentence}</Text>
        <Text style={styles.translationExample}>{word.translatedSentence}</Text>
        <Text style={styles.definition}>{word.definition}</Text>
      </View>
      <View style={styles.contentButtons}>
        <Pressable onPress={notLearned} style={styles.buttonStatus}>
          <Icon name="thumbs-down" size={30} color="#FF0000" />
          <Text style={styles.ipa}>Não Aprendi</Text>
        </Pressable>
        <Pressable onPress={undecided} style={styles.buttonStatus}>
          <Icon name="question-circle-o" size={30} color="#FFE600" />
          <Text style={styles.ipa}>Indeciso</Text>
        </Pressable>
        <Pressable onPress={learned} style={styles.buttonStatus}>
          <Icon name="thumbs-up" size={30} color="#00FF00" />
          <Text style={styles.ipa}>Aprendi</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    paddingHorizontal: 10,
    backgroundColor: "#777777",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  contents: {
    alignItems: "center",
  },
  wordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "85%",
  },
  englishWord: {
    fontWeight: "bold",
    color: "#799afc",
    fontSize: 50,
    textAlign: "center",
    width: "60%",
  },
  buttonChangeWord: {
    alignItems: "center",
    justifyContent: "center",
  },
  ipa: {
    color: "#ffffff",
    margin: 0,
  },
  translatedWord: {
    color: "#b1c4fc",
    fontSize: 40,
    marginTop: 10,
  },
  example: {
    color: "#799afc",
    fontSize: 20,
    marginTop: 100,
  },
  translationExample: {
    color: "#b1c4fc",
    fontSize: 20,
  },
  definition: {
    color: "#ffffff",
    marginTop: 30,
  },
  contentButtons: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 100,
  },
  buttonStatus: {
    flexDirection: "column",
    alignItems: "center",
  },
});
