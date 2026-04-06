import React from "react";
import {
  Document,
  Page,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  section: {
    marginTop: 10,
    fontSize: 14,
  },
  text: {
    marginBottom: 5,
  },
});

export default function ExamStrategyPDF() {
  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>Estrategia para el examen</Text>

        <Text style={styles.section}>Antes del examen</Text>
        <Text style={styles.text}>- Llega con antelación.</Text>
        <Text style={styles.text}>- Evita conversaciones que generen dudas.</Text>
        <Text style={styles.text}>- Lleva material preparado.</Text>
        <Text style={styles.text}>- Descansa bien.</Text>

        <Text style={styles.section}>Durante el examen</Text>
        <Text style={styles.text}>- Lee bien las preguntas.</Text>
        <Text style={styles.text}>- Empieza por lo que sabes.</Text>
        <Text style={styles.text}>- Controla el tiempo.</Text>
        <Text style={styles.text}>- Revisa al final.</Text>
      </Page>
    </Document>
  );
}