import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import * as SQLite from "expo-sqlite";

let db;

export default function App() {
  useEffect(() => {
    async function setup() {
      db = await SQLite.openDatabaseAsync("tarefas");
      await db.execAsync(`
       CREATE TABLE IF NOT EXISTS tarefa (
          id INTEGER PRIMARY KEY NOT NULL, 
          value TEXT NOT NULL 
        );
      `);
      updateTaskList();
    }
    setup();
  }, []);

  const [list, setList] = useState([]);
  const [textInput, setTextInput] = useState("");

  async function addTarefa() {
    if (textInput === "") {
      alert("input vazio");
    } else {
      await db.runAsync("INSERT INTO tarefa (value) VALUES (?)", [textInput]);
      setTextInput("");
      updateTaskList();
    }
  }

  

  async function deleteTarefa(id) {
    try {
      await db.runAsync("DELETE FROM tarefa WHERE id = ?", [id]);
      updateTaskList();
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  }

  async function updateTaskList() {
    const allRows = await db.getAllAsync("SELECT * FROM tarefa");
    let newArray = [];
    for (const row of allRows) {
      newArray.push({ id: row.id, value: row.value });
    }
    setList(newArray);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Todo List</Text>
      <TextInput
        placeholderTextColor="#9d96b6"
        color="#ffffff"
        placeholder="Adicionar Tarefa"
        style={styles.input}
        value={textInput}
        onChangeText={setTextInput}
      />
      <Button style={{ margin: 10 }} title="Adicionar" onPress={addTarefa} />
      {list.map((item, index) => (
        <View key={index} style={styles.taskContainer}>
          <Text style={{ color: "#ffffff", fontSize: 20 }}>{item.value}</Text>
          <Button title="Excluir" onPress={() => deleteTarefa(item.id)} />
        </View>
      ))}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#221c36",
    alignItems: "center",
  },
  titulo: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "bold",
    margin: 50,
  },
  input: {
    borderColor: "#9d96b6",
    borderWidth: 1,
    width: "80%",
    paddingHorizontal: 10,
    marginBottom: 10,
    textAlign: "center",
    placeholderTextColor: "#ffffff",
  },
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 10,
  },
});
