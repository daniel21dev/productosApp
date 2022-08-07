import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Button,
  Image,
} from 'react-native';

import {Picker} from '@react-native-picker/picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import {StackScreenProps} from '@react-navigation/stack';
import {ProductsStackParams} from '../navigator/ProductsNavigator';
import {useCategories} from '../hooks/useCategories';
import {useForm} from '../hooks/useForm';
import {ProductsContext} from '../context/ProductsContext';

interface Props
  extends StackScreenProps<ProductsStackParams, 'ProductScreen'> {}

export const ProductScreen = ({route, navigation}: Props) => {
  const {id = '', name = ''} = route.params;

  const [tempUri, setTempUri] = useState<string>();

  const {categories} = useCategories();
  const {loadProductById, addProduct, updateProduct, uploadImage} =
    useContext(ProductsContext);

  const {_id, categoriaId, nombre, img, onChange, setFormValue} = useForm({
    _id: id,
    categoriaId: '',
    nombre: name,
    img: '',
  });

  useEffect(() => {
    navigation.setOptions({title: nombre ? nombre : 'Sin nombre del Producto'});
  }, [nombre]);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    if (id.length === 0) return;
    const product = await loadProductById(id);
    setFormValue({
      _id: id,
      nombre,
      img: product.img || '',
      categoriaId: product.categoria._id,
    });
  };

  const saveOrUpdate = async () => {
    if (id.length > 0) {
      updateProduct(categoriaId, nombre, id);
    } else {
      const tempCategoriaId = categoriaId || categories[0]._id;
      const newProduct = await addProduct(tempCategoriaId, nombre);
      onChange(newProduct._id, '_id');
    }
  };

  const takePhoto = async () => {
    launchCamera(
      {mediaType: 'photo', quality: 0.5, cameraType: 'back'},
      async resp => {
        if (resp.didCancel) return;
        if (resp?.assets?.length && resp?.assets?.length > 0) {
          setTempUri(resp.assets[0].uri);
          await uploadImage(resp.assets[0], _id);
        }
      },
    );
  };

  const takePhotoFromGallery = async () => {
    launchImageLibrary({mediaType: 'photo', quality: 0.5}, async resp => {
      if (resp.didCancel) return;
      if (resp?.assets?.length && resp?.assets?.length > 0) {
        setTempUri(resp.assets[0].uri);
        await uploadImage(resp.assets[0], _id);
      }
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.label}>Nombre del producto</Text>
        <TextInput
          placeholder="producto"
          style={styles.textInput}
          value={nombre}
          onChangeText={value => onChange(value, 'nombre')}
        />
        {/* Picker */}
        <Text style={styles.label}>Seleccione la categoria</Text>

        <Picker
          selectedValue={categoriaId}
          onValueChange={itemValue => onChange(itemValue, 'categoriaId')}>
          {categories.map(c => (
            <Picker.Item label={c.nombre} value={c._id} key={c._id} />
          ))}
        </Picker>

        <Button title="Guardar" onPress={saveOrUpdate} color="indigo" />

        {_id.length > 0 && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 10,
            }}>
            <Button title="Cámara" onPress={takePhoto} color="indigo" />
            <View style={{width: 10}} />
            <Button
              title="Galeria"
              onPress={takePhotoFromGallery}
              color="indigo"
            />
          </View>
        )}

        {img.length > 0 && !tempUri && (
          <Image
            source={{uri: img}}
            style={{width: '100%', height: 300, marginTop: 20}}
          />
        )}

        {tempUri && (
          <Image
            source={{uri: tempUri}}
            style={{width: '100%', height: 300, marginTop: 20}}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, marginTop: 10, marginHorizontal: 20},
  label: {fontSize: 18},
  textInput: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 2,
    borderColor: 'rgba(0,0,0,0.2)',
    height: 45,
    marginTop: 5,
    marginVertical: 15,
  },
});
