import {useEffect, useState} from 'react';
import cafeApi from '../api/cafeApi';
import {CategoriesResponse, Categoria} from '../interfaces/app-interfaces';

export const useCategories = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Categoria[]>([]);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    const {data} = await cafeApi.get<CategoriesResponse>('/categorias');
    setCategories(data.categorias);
    setIsLoading(false);
  };

  return {
    categories,
    isLoading,
  };
};
