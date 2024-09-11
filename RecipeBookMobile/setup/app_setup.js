import React from 'react';
import { SafeAreaView } from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Header from '../components/NavHeader.js';
import PageSetup from './page_setup'

const Stack = createNativeStackNavigator();

const appSetup = () => {

  return (
      <Stack.Navigator screenOptions={{header: Header}}>
        <Stack.Screen
          name="AppPages"
          component={PageSetup}
          options={{title: ''}}
        />
      </Stack.Navigator>
  );
}

export default appSetup;