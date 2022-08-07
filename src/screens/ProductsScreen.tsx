import React, {useContext, useEffect, useState} from 'react';
import {FlatList, RefreshControl, StyleSheet, Text, View} from 'react-native';

import {TouchableOpacity} from 'react-native-gesture-handler';
import {StackScreenProps} from '@react-navigation/stack';

import {ProductsContext} from '../context/ProductsContext';
import {ProductsStackParams} from '../navigator/ProductsNavigator';

interface Props
  extends StackScreenProps<ProductsStackParams, 'ProductsScreen'> {}

export const ProductsScreen = ({navigation}: Props) => {
  const [refreshing, setrefreshing] = useState(false);
  const {products, loadProducts} = useContext(ProductsContext);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          activeOpacity={0.8}
          style={{marginRight: 10}}
          onPress={() => navigation.navigate('ProductScreen', {})}>
          <Text>Agregar</Text>
        </TouchableOpacity>
      ),
    });
  }, []);

  const loadProductsFromBackend = async () => {
    setrefreshing(true);
    await loadProducts();
    setrefreshing(false);
  };

  return (
    <View style={{flex: 1, marginHorizontal: 10}}>
      <FlatList
        data={products}
        keyExtractor={p => p._id}
        renderItem={({item}) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('ProductScreen', {
                id: item._id,
                name: item.nombre,
              })
            }>
            <Text style={styles.productName}>{item.nombre}</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.itemSeparetor} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadProductsFromBackend}
            progressViewOffset={10}
            progressBackgroundColor={'indigo'}
            style={{backgroundColor: 'white'}}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  productName: {
    fontSize: 20,
  },
  itemSeparetor: {
    borderBottomWidth: 2,
    marginVertical: 5,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
});
