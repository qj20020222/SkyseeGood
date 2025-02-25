/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import  Home  from "./src/Home"
import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import client from "@/services/graphql/apolloClient";
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { ApolloProvider } from '@apollo/client';
type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
  
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
    
  );
}
 
function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  console.log('Current mode is:', isDarkMode ? 'Dark' : 'Light');
  const backgroundStyle = {
    flex:1,
    backgroundColor: '#1D2235',
  };

  return (
  <ApolloProvider client={client}>
    <SafeAreaView style={{...backgroundStyle, paddingTop: 0}}>
     <StatusBar
        barStyle={'light-content'}
        backgroundColor='#1D2235'
        translucent={true}
      />
      <Home/>
    </SafeAreaView>
  </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
