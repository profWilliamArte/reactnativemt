import React, { useState, useCallback } from 'react';
import { TextInput } from 'react-native';
import { debounce } from 'lodash'; // Importa debounce de lodash

const CantidadInput = ({ id, onChange }) => {
    const [valor, setValor] = useState('1'); // Estado local para la cantidad

    // Función que se ejecuta después de que el usuario deja de escribir
    const manejarCambio = useCallback(debounce((nuevoValor) => {
        onChange(id, nuevoValor); // Llama a la función onChange pasada como prop
    }, 300), [id, onChange]); // Dependencias para useCallback

    // Maneja el cambio en el TextInput
    const handleInputChange = (text) => {
        setValor(text); // Actualiza el estado local
        manejarCambio(text); // Llama a la función debounce
    };

    return (
        <TextInput
            value={valor} // Muestra el valor actual
            onChangeText={handleInputChange} // Maneja el cambio de texto
            keyboardType="numeric" // Solo permite números
            placeholder="Cantidad" // Texto de marcador
        />
    );
};

export default CantidadInput; // Exporta el componente