import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from "react-native";
import data from "./assets/word_data.json";
import Icon from "react-native-vector-icons/FontAwesome";
import * as SQLite from "expo-sqlite";

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  let db;

  useEffect(() => {
    async function setup() {
      db = await SQLite.openDatabaseAsync("wordsdb");

      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS words (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          original TEXT,
          translated TEXT,
          sentence TEXT,
          translated_sentence TEXT,
          ipa TEXT,
          definition TEXT,
          status INTEGER
        );
      `);
      const dbAtualizado = await db.getAllAsync("SELECT * FROM words");
      if (dbAtualizado.length === 0) {
        console.log("vazio");
        await db.isInTransactionAsync(async (tx) => {
          for (let i = 0; i < data.length; i++) {
            let word = data[i];

            const result = await tx.getAllAsync("SELECT * FROM words WHERE original = ?", [word.original]);
            if (result.length === 0) {
              await tx.runAsync(
                "INSERT INTO words (original, translated, sentence, translated_sentence, ipa, definition, status) VALUES (?, ?, ?, ?, ?, ?, ?);",
                [
                  word.original,
                  word.translated,
                  word.setence,
                  word.translated_sentence,
                  word.ipa,
                  word.definition,
                  word.status,
                ]
              );
            }
          }
        });
      } else {
        console.log(dbAtualizado.length);
      }
      console.log(dbAtualizado.length === 0);
    }

    setup();
  }, []);

  if (!data || data.length === 0) {
    return (
      <ActivityIndicator
        style={{ alignItems: "center", justifyContent: "center", flex: 1, backgroundColor: "#2c2f38" }}
        size="large"
        color="#fff"
      />
    );
  }

  const NextWord = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
  };

  const PreviousWord = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + data.length) % data.length);
  };

  const word = data[currentIndex];

  function naoSei() {
    word.status = 1;
    console.log(word.status);
    console.log("nao sei");
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Desbloquei Seu Inglês</Text>
        <View style={styles.wordContainer}>
          <Pressable
            style={[styles.btn, { opacity: currentIndex > 0 ? 1 : 0 }]}
            onPress={PreviousWord}
            disabled={currentIndex === 0}
          >
            <Text style={[{ fontSize: 30, color: "#FFFFFF" }]}>{"<"}</Text>
          </Pressable>
          <Text style={styles.palavraIngles}>{word.original}</Text>
          <Pressable style={styles.btn} onPress={NextWord}>
            <Text style={[{ fontSize: 30, color: "#FFFFFF" }]}>{">"}</Text>
          </Pressable>
        </View>

        <Text style={styles.ipa}>{word.ipa}</Text>
        <Text style={styles.palavraTraduzida}>{word.translated}</Text>
        <Text style={styles.exemplo}>{word.setence}</Text>
        <Text style={styles.traducaoExemplo}>{word.translated_sentence}</Text>
        <Text style={styles.definicao}>{word.definition}</Text>
      </View>
      <View style={styles.contentButtons}>
        <Pressable onPress={naoSei} style={styles.buttonStatus}>
          <Icon name="thumbs-down" size={30} color="#FF0000" />
          <Text style={styles.ipa}>Não Aprendi</Text>
        </Pressable>
        <Pressable onPress={() => console.log()} style={styles.buttonStatus}>
          <Icon name="question-circle-o" size={30} color="#FFE600" />
          <Text style={styles.ipa}>Indeciso</Text>
        </Pressable>
        <Pressable onPress={() => console.log(word.status)} style={styles.buttonStatus}>
          <Icon name="thumbs-up" size={30} color="#00FF00" />
          <Text style={styles.ipa}>Aprendi</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2c2f38",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "bold",
    marginVertical: 50,
  },
  palavraIngles: {
    fontWeight: "bold",
    color: "#799afc",
    fontSize: 50,
    textAlign: "center",
    width: "60%",
  },
  palavraTraduzida: { color: "#b1c4fc", fontSize: 40, marginTop: 10 },
  ipa: {
    color: "#ffffff",
    margin: 0,
  },
  exemplo: { color: "#799afc", fontSize: 20, marginTop: 100 },
  traducaoExemplo: { color: "#b1c4fc", fontSize: 20 },
  content: {
    alignItems: "center",
  },
  definicao: {
    color: "#ffffff",
    marginTop: 30,
  },
  btn: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  wordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "95%",
  },
  contentButtons: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 100,
  },
  buttonStatus: {
    flexDirection: "column",
    tecolor: "#fff",
    alignItems: "center",
  },
});
