import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export default function ButtonStatus(props) {
  return (
    <View style={styles.contentButtons}>
      <Pressable onPress={props.buttonFunctionNotLearned} style={styles.buttonStatus}>
        <Icon name="thumbs-down" size={30} color="#FF0000" />
        <Text style={styles.buttpnText}>Não Sei</Text>
      </Pressable>
      <Pressable onPress={props.buttonFunctionUndecided} style={styles.buttonStatus}>
        <Icon name="question-circle-o" size={30} color="#FFE600" />
        <Text style={styles.buttpnText}>Indeciso</Text>
      </Pressable>
      <Pressable onPress={props.buttonFunctionLearned} style={styles.buttonStatus}>
        <Icon name="thumbs-up" size={30} color="#00FF00" />
        <Text style={styles.buttpnText}>Aprendi</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  contentButtons: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonStatus: {
    flexDirection: "column",
    alignItems: "center",
  },
  buttpnText: {
    color: "#ffffff",
    margin: 0,
  },
});
