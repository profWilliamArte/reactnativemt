import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import CustomButton from "./CustomButton";
import { useRouter } from 'expo-router';

const Cardprod = ({ item, pedir, isInCart, eliminar  }) => {
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);

    const handlePressDetail = () => {
        router.push(`/detalle/${item.id}`);
    };

    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };
    const RUTA="https://autopanam.com/sistema/dist/img/prod/pro400/"+item.codpro+"-1.jpg";
    return (
        <View style={styles.card}>
         
                <View style={styles.header}>
                    <Image source={{ uri: item.thumbnail}} style={styles.image} />
                </View>
                <View style={styles.body}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.title}>{item.brand}</Text>
                    <Text style={[styles.price, styles.danger]}>${item.price}</Text>
                    
                </View>
           
                    <View style={styles.footer}>
                        <CustomButton
                            title="Ver Detalle"
                            onPress={openModal}
                            type="info"
                            outline
                            width={100}
                            margin={0}
                            fontSize={14}
                        />
                       {/* Mostrar botón de Agregar o Eliminar según isInCart */}
                {isInCart ? (
                    <CustomButton
                        title="Eliminar"
                        onPress={() => eliminar(item.id)} // Asumiendo que eliminar es una función que acepta el id del producto
                        type="danger"
                        outline
                        width={100}
                        margin={10}
                        fontSize={14}
                    />
                ) : (
                    <CustomButton
                        title="Agregar"
                        onPress={() => pedir(item)}
                        type="success"
                        outline
                        width={100}
                        margin={10}
                        fontSize={14}
                    />
                )}
                        


                    </View>
                
            {/* Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                    <Text style={[styles.modalTitle]}>{item.category.toUpperCase()}</Text>
                        <Image source={{ uri:  item.thumbnail }} style={styles.image} />
                        <Text style={styles.modalTitle}>{item.title}</Text>
                        <Text style={styles.brand}>CODIGO : {item.sku}</Text>
                        <Text style={[styles.modalSubtitulo]}>MARCA : {item.brand}</Text>
                        <Text style={[styles.modalSubtitulo]}>CATEGORIA : {item.category}</Text>
                        <Text style={[styles.modalSubtitulo]}>EXISTENCIA : {item.stock}</Text>
                        <Text style={[styles.modalDescription]}> {item.description}</Text>
                        <Text style={[styles.price, styles.danger]}>PRECIO : {item.price}$</Text>
                        {item.oferta && item.oferta > 0 ? ( 
                        <Text style={[styles.price, styles.danger]}>
                            Oferta: ${item.oferta}
                        </Text>
                            ) : null} 
                        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#2c3e50',
        borderRadius: 8,
        padding: 10,
        margin:5,
        marginVertical: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        width: '100%', // Cambia el ancho a un porcentaje

        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    header: {
        alignItems: 'center',
        padding: 0,
    },
    image: {
        width: '100%', // Mantiene el ancho al 100% del card
        height: 200,
        borderRadius: 8,
    },
    body: {
        alignItems: 'center',
        marginVertical: 2,
    },
    title: {
        fontSize: 12,
        color: '#fff',
        textAlign: 'center',
    },
    brand: {
        fontSize: 16,
        margin: 10,
    },
 
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    success: {
        color: '#4caf50',
    },
    danger: {
        color: '#e53935',
    },

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fondo semi-transparente más oscuro
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#ffffff',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
        padding: 10,
        textAlign: 'center',
        backgroundColor: '#2c3e50', 
        color: '#fff',
        paddingVertical: 12, 
        borderRadius: 5,
        width: '100%', 
    },
    modalSubtitulo: {
        fontSize: 14,
        textAlign: 'center',
        color: '#34495e', // Color de texto más oscuro
    },
    modalImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        resizeMode: 'cover', // Asegúrate de que la imagen cubra el área
    },
    modalDescription: {
        fontSize: 14,
        textAlign: 'center',
        color: '#34495e', // Color de texto más oscuro
    },
    closeButton: {
        backgroundColor: '#34495e', // Color rojo para el botón de cerrar
        padding: 12,
        marginTop: 20,
        borderRadius: 5,
        width: '80%', // Botón más ancho
        alignItems: 'center', // Centrar texto
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold', // Texto en negrita
    },
});

export default Cardprod;