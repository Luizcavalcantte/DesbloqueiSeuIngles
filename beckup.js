import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import * as SQLite from "expo-sqlite";
import data from "../assets/word_data.json";
import { CounterContext } from "../contex/CounterContex";
import ButtonStatus from "../components/ButtonsStatus";
import MenuScreens from "../components/MenuScreens";

import { Audio } from "expo-av";
import { fetchAudio } from "../api";

export default function HomeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wordList, setWordList] = useState([]);
  const [wordListLearned, setWordListLearned] = useState([]);
  const [wordListUndecided, setWordListUndecided] = useState([]);
  const [wordListNotLearned, setWordListNotLearned] = useState([]);

  const { dbContext, functionContextButtonStatus } = useContext(CounterContext);

  const [textInput, setTextInput] = useState("");
  const [inputVisible, setInputVisible] = useState(false);
  const [searchWords, setSearchWords] = useState([]);
  const [audioUrl, setAudioUrl] = useState(null);

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
    functionContextButtonStatus(notLearned, undecided, learned);
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

  useEffect(() => {
    search();
  }, [textInput]);

  async function playSound(text) {
    try {
      const url = await fetchAudio(text, "en-US");
      setAudioUrl(url);

      if (audioUrl) {
        const { sound } = await Audio.Sound.createAsync({ uri: url });
        await sound.playAsync();
      }
    } catch (error) {
      console.error("Error fetching or playing audio:", error);
    }
  }

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

  async function updateStatus(status, sender, index) {
    db = await SQLite.openDatabaseAsync("wordsdb");
    await db.runAsync("UPDATE words SET status = ? WHERE englishWord = ?", [status, sender[index].englishWord]);
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
    setSearchWords([]);
    setTextInput("");
    setInputVisible(false);
  };

  const previousWord = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + wordList.length) % wordList.length);
    setSearchWords([]);
    setTextInput("");
    setInputVisible(false);
  };

  function notLearned(sender, index) {
    updateStatus(0, sender, index);
  }

  function undecided(sender, index) {
    updateStatus(1, sender, index);
  }

  function learned(sender, index) {
    updateStatus(2, sender, index);
  }

  const word = wordListNotLearned[currentIndex];

  async function moveItemNotLearned() {
    const updatedWordListNotLearned = [...wordListNotLearned];

    const [item] = updatedWordListNotLearned.splice(currentIndex, 1);

    db = await SQLite.openDatabaseAsync("wordsdb");
    await db.runAsync("DELETE FROM words WHERE englishWord = ?", [item.englishWord]);
    await db.runAsync(
      "INSERT INTO words (englishWord, translatedWord, sentence, translatedSentence, ipa, definition, status) VALUES (?, ?, ?, ?, ?, ?, ?);",
      [
        item.englishWord,
        item.translatedWord,
        item.sentence,
        item.translatedSentence,
        item.ipa,
        item.definition,
        item.status,
      ]
    );
    updatebd();
  }

  function search() {
    if (textInput == "" || inputVisible == false) {
      setInputVisible(true);
    } else {
      const palavraFiltrada = wordList.filter(
        (words) => words.englishWord.toLowerCase() == textInput.toLocaleLowerCase()
      );
      setSearchWords(palavraFiltrada);
    }
  }

  function hideItens() {
    Keyboard.dismiss;
    setSearchWords([]);
    setTextInput("");
    setInputVisible(false);
  }

  function renderItem({ item }) {
    return <MenuScreens styles={{ backgroundColor: "#fff" }} wordList={searchWords} />;
  }

  return (
    <TouchableWithoutFeedback onPress={hideItens}>
      <View style={styles.Container}>
        {inputVisible && (
          <TextInput
            style={styles.search}
            placeholderTextColor="#fff"
            color="#ffffff"
            placeholder="Pesquisar"
            value={textInput}
            onChangeText={(text) => {
              setTextInput(text);
              search();
            }}
          ></TextInput>
        )}

        <Pressable style={styles.buttonSearch} onPress={search}>
          <Icon name="search" size={30} color="#fff" />
        </Pressable>

        <View style={styles.contents}>
          {searchWords.length > 0 && inputVisible == true && (
            <FlatList
              style={styles.searchResults}
              data={searchWords}
              renderItem={renderItem}
              keyExtractor={(item) => item.englishWord}
            />
          )}

          <View style={styles.containerChangeWord}>
            <Pressable
              style={[styles.buttonChangeWord, { opacity: currentIndex > 0 ? 1 : 0 }]}
              onPress={previousWord}
              disabled={currentIndex === 0}
            >
              <Text style={[{ fontSize: 30, color: "#FFFFFF" }]}>{"<"}</Text>
            </Pressable>

            <Pressable style={styles.buttonChangeWord} onPress={nextWord}>
              <Text style={[{ fontSize: 30, color: "#FFFFFF" }]}>{">"}</Text>
            </Pressable>
          </View>
          <Text style={styles.englishWord}>{word.englishWord}</Text>
          <Pressable
            style={styles.soundButton1}
            onPress={() => {
              playSound(word.englishWord);
            }}
          >
            <Icon name="volume-up" size={30} color="#fff" />
          </Pressable>

          <Text style={styles.ipa}>{word.ipa}</Text>
          <Text style={styles.translatedWord}>{word.translatedWord}</Text>
          <Pressable
            style={styles.soundButton2}
            onPress={() => {
              playSound(word.sentence);
            }}
          >
            <Icon name="volume-up" size={30} color="#fff" />
          </Pressable>
          <Text style={styles.example}>{word.sentence}</Text>

          <Text style={styles.translationExample}>{word.translatedSentence}</Text>
          <Text style={styles.definition}>{word.definition}</Text>
        </View>
        <ButtonStatus
          buttonFunctionNotLearned={() => {
            moveItemNotLearned();
          }}
          buttonFunctionUndecided={() => {
            undecided(wordListNotLearned, currentIndex);
          }}
          buttonFunctionLearned={() => {
            learned(wordListNotLearned, currentIndex);
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  Container: {
    paddingHorizontal: 10,
    backgroundColor: "#444",
    flex: 1,
    alignItems: "center",

    paddingBottom: 50,
  },
  contents: {
    flex: 1,
    alignItems: "center",

    marginTop: 120,
  },
  containerChangeWord: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    top: "5%",
  },
  englishWord: {
    position: "absolute",
    top: "2%",
    fontWeight: "bold",
    color: "#799afc",
    fontSize: 50,
  },
  buttonChangeWord: {
    height: 400,
    width: 100,
    alignItems: "center",
  },
  ipa: {
    color: "#ffffff",
    marginTop: 110,
  },
  translatedWord: {
    color: "#b1c4fc",
    fontSize: 40,
    marginTop: 10,
  },
  example: {
    color: "#799afc",
    fontSize: 20,
  },
  soundButton2: {
    marginTop: 50,
  },
  translationExample: {
    color: "#b1c4fc",
    fontSize: 20,
  },

  definition: {
    color: "#ffffff",
    marginTop: 30,
  },

  search: {
    position: "absolute",
    width: "80%",
    top: 10,
    paddingLeft: 10,
    borderColor: "#888",
    borderWidth: 2,
    padding: 3,
    borderRadius: 8,
  },
  buttonSearch: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  searchResults: {
    position: "absolute",
    width: "100%",
    top: -50,
    zIndex: 1,
  },
  soundButton1: {
    position: "absolute",
    top: 75,
  },
});
