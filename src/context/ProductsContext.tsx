import React, {createContext, useState, useEffect} from 'react';
import {Asset, ImagePickerResponse} from 'react-native-image-picker';
import cafeApi from '../api/cafeApi';
import {Producto, ProductosResponse} from '../interfaces/app-interfaces';

type ProductsContextProps = {
  products: Producto[];
  loadProducts: () => Promise<void>;
  addProduct: (categoryId: string, productName: string) => Promise<Producto>;
  updateProduct: (
    categoryId: string,
    productName: string,
    productId: string,
  ) => Promise<Producto>;
  deleteProduct: (id: string) => Promise<void>;
  loadProductById: (id: string) => Promise<Producto>;
  uploadImage: (data: any, id: string) => Promise<void>; // TODO: cambiar ANY
};

export const ProductsContext = createContext({} as ProductsContextProps);

export const ProductsProvider = ({children}: any) => {
  const [products, setProducts] = useState<Producto[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const {data} = await cafeApi.get<ProductosResponse>('/productos?limite=50');
    // setProducts([...products, ...data.productos]);
    setProducts([...data.productos]);
  };

  const addProduct = async (
    categoryId: string,
    productName: string,
  ): Promise<Producto> => {
    const {data} = await cafeApi.post<Producto>('/productos', {
      nombre: productName,
      categoria: categoryId,
    });
    setProducts([...products, data]);
    return data;
  };

  const updateProduct = async (
    categoryId: string,
    productName: string,
    productId: string,
  ): Promise<Producto> => {
    const {data} = await cafeApi.put<Producto>(`/productos/${productId}`, {
      nombre: productName,
      categoria: categoryId,
    });
    setProducts(products.map(p => (p._id === productId ? data : p)));
    return data;
  };

  const deleteProduct = async (id: string) => {};

  const loadProductById = async (id: string): Promise<Producto> => {
    const {data} = await cafeApi.get<Producto>('/productos/' + id);
    return data;
  };

  // TODO: cambiar ANY
  const uploadImage = async ({uri, type, fileName}: Asset, id: string) => {
    const fileToUpload = {
      uri,
      type,
      name: fileName,
    };

    const formData = new FormData();
    formData.append('archivo', fileToUpload);

    try {
      const resp = await cafeApi.put(`/uploads/productos/${id}`, formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });
      console.log(resp);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        loadProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        loadProductById,
        uploadImage,
      }}>
      {children}
    </ProductsContext.Provider>
  );
};
