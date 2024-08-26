import { View, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import * as SQLite from "expo-sqlite";
import data from "../assets/word_data.json";
import { CounterContext } from "../contex/CounterContex";

export default function HomeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wordList, setWordList] = useState([]);
  const [wordListLearned, setWordListLearned] = useState([]);
  const [wordListUndecided, setWordListUndecided] = useState([]);
  const [wordListNotLearned, setWordListNotLearned] = useState([]);

  const { dbContext } = useContext(CounterContext);

  let db;

  useEffect(() => {
    async function setup() {
      db = await SQLite.openDatabaseAsync("wordsdb");

      await db.execAsync(`
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

      await updatebd();
    }

    setup();
  }, []);

  useEffect(() => {
    const learned = wordList.filter((word) => word.status === 2);
    const undecided = wordList.filter((word) => word.status === 1);
    const notLearned = wordList.filter((word) => word.status === 0);
    setWordListLearned(learned);
    setWordListUndecided(undecided);
    setWordListNotLearned(notLearned);

    dbContext(learned, undecided, notLearned);
  }, [wordList]);

  async function updatebd() {
    const dbAtualizado = await db.getAllAsync("SELECT * FROM words");
    if (dbAtualizado.length === 0) {
      for (let i = 0; i < data.length; i++) {
        let word = data[i];
        await db.runAsync(
          "INSERT INTO words (englishWord, translatedWord, sentence, translatedSentence, ipa, definition, status) VALUES (?, ?, ?, ?, ?, ?, ?);",
          [
            word.englishWord,
            word.translatedWord,
            word.sentence,
            word.translatedSentence,
            word.ipa,
            word.definition,
            word.status,
          ]
        );
      }
      const updatedWords = await db.getAllAsync("SELECT * FROM words");
      setWordList(updatedWords);
    } else {
      setWordList(dbAtualizado);
    }
  }

  async function updateStatus(status) {
    db = await SQLite.openDatabaseAsync("wordsdb");
    await db.runAsync("UPDATE words SET status = ? WHERE englishWord = ?", [
      status,
      wordListNotLearned[currentIndex].englishWord,
    ]);
    const updatedWords = await db.getAllAsync("SELECT * FROM words");
    setWordList(updatedWords);
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
    setCurrentIndex((prevIndex) => (prevIndex + 1) % wordList.length);
  };

  const previousWord = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + wordList.length) % wordList.length);
  };

  function learned() {
    updateStatus(2);
    console.log("aprendi");
  }
  function undecided() {
    updateStatus(1);
    console.log("indeciso");
  }
  function notLearned() {
    updateStatus(0);
    console.log("nao sei");
  }

  const word = wordListNotLearned[currentIndex];

  return (
    <View style={styles.Container}>
      <View style={styles.contents}>
        <Pressable onPress={() => console.log(wordListLearned)}>
          <Text>learned</Text>
        </Pressable>
        <Pressable onPress={() => console.log(word.status)}>
          <Text>status</Text>
        </Pressable>
        <View style={styles.wordContainer}>
          <Pressable
            style={[styles.buttonChangeWord, { opacity: currentIndex > 0 ? 1 : 0 }]}
            onPress={previousWord}
            disabled={currentIndex === 0}
          >
            <Text style={[{ fontSize: 30, color: "#FFFFFF" }]}>{"<"}</Text>
          </Pressable>
          <Text style={styles.englishWord}>{word.englishWord}</Text>
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
