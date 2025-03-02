
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FileUpload } from './Fileupload';
const AppSwitcher = () => {
  return (
    <View style={{
      position: 'absolute',
      bottom: 80, // 相当于bottom-20 (假设1rem = 4px)
      left: 0,
      right: 0,
      alignItems: 'center',
      zIndex: 20,
    }}>
      <FileUpload/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: '#000',
  },
});

export default AppSwitcher;
