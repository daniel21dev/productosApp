import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import 'react-native-gesture-handler';
import {AuthProvider} from './src/context/AuthContext';
import {ProductsProvider} from './src/context/ProductsContext';
import {Navigator} from './src/navigator/Navigator';

const AppState = ({children}: any) => {
  return (
    <AuthProvider>
      <ProductsProvider>{children}</ProductsProvider>
    </AuthProvider>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <AppState>
        <Navigator />
      </AppState>
    </NavigationContainer>
  );
};

export default App;
