// TelefonosStyles.js
import { StyleSheet } from 'react-native';
import { Colors } from "@/constants/Colors";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "stretch",
        padding: 20,
        backgroundColor: Colors.dark.background,
    },
    titulo: {
        fontSize: 26,
        textAlign: "center",
        color: Colors.dark.text,
    },
    subtitulo: {
        fontSize: 16,
        textAlign: "center",
        color: Colors.dark.text,
    },
});

export default styles;