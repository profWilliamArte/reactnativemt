// CustomButton.tsx
import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors'; // Asegúrate de que la ruta sea correcta

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'; // Tipos de botón
  outline?: boolean; // Si es un botón de borde
  width?: string; // Cambiar a string para aceptar porcentajes
  margin?: number | string; // Margen del botón
  fontSize?: number; // Tamaño de la fuente
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  type = 'primary',
  outline = false,
  width, // Añadir la propiedad width
  margin, // Añadir la propiedad margin
  fontSize = 16, // Tamaño de fuente por defecto
}) => {
  // Estilos de botón según el tipo y si es outline
  const buttonStyles = outline
    ? {
        backgroundColor: 'transparent',
        borderColor: Colors.outline[type].borderColor,
        color: Colors.outline[type].color,
      }
    : {
        backgroundColor: Colors.button[type].backgroundColor,
        borderColor: Colors.button[type].borderColor,
        color: Colors.button[type].color,
      };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { 
          borderColor: buttonStyles.borderColor, 
          backgroundColor: buttonStyles.backgroundColor,
          width: width ? (typeof width === 'string' ? width : `${width}%`) : undefined, // Aplicar el ancho aquí
          marginVertical: margin, // Aplicar el margen aquí
        },
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <Text style={{ color: buttonStyles.color, fontWeight: 'bold', fontSize: fontSize }}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1, // Asegúrate de que el borde se aplique
  },
  pressed: {
    opacity: 0.7,
  },
});

export default CustomButton;