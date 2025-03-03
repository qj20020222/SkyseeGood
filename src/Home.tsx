import NewsFeed from "@/components/feed";
import { NewsArticle } from "./types/newsArticle";
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useLazyQuery, useQuery } from '@apollo/client';
import { FIND_ARTICLE_BY_ID, FIND_BY_URL_ARRAY, FIND_BY_TOPIC } from './services/graphql/news/Apollo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from "react";
import AppSwitcher from "@/components/AppSwitcher";
import { DeviceEventEmitter } from 'react-native';

export default function Home(){ 
  const [articles, setArticles] = useState<any[]>([]);
  const [values, setValues] = useState([]);
  const [dataJson, setdataJson] = useState<string[]>([]);
  
  console.log('correct')
  
  const { loading, error, data,refetch } = useQuery(FIND_BY_URL_ARRAY, {
    variables: {urls: values},
    onError: (err) => {
      console.log('完整错误对象:', err);
      console.log('网络错误详情:', err.networkError);  
    }
  })
   
  console.log(data)

  useEffect(() => {
    if (values.length > 0) {
      refetch({ urls: values }).then(result => {
        console.log("重新获取数据结果:", result);
      });
    }
  }, [values, refetch]);

  // 获取存储的值
  useEffect(() => {
    const getAllValues = async () => {
      try {
        const dataJson = await AsyncStorage.getItem('my-key');
        if (dataJson) {
          let parsedIds = JSON.parse(dataJson);
          //const stringIds = parsedIds.map((id: { toString: () => any; }) => id.toString());
          setValues(parsedIds);
          //setdataJson(dataJson); const stringIds = JSON.map(id => id.toString());
          console.log("主页读取了", dataJson)
          console.log(values)
        } else {
          setValues([])  
        }  
      } catch (e) {
        console.error('读取数据失败', e);
        setValues([]);
      }
    };
      
    getAllValues();
  }, []);

  if (loading) return <View style={styles.container}><Text>Loading...</Text></View>; 
  if (error) return <View style={styles.container}><Text>Error</Text></View>; //

  return (
    <View style={styles.container}>
      <View style={styles.scrollView}>
      {data && data.findurlarray ? (
        <NewsFeed newsArticles={data.findurlarray || []} />
      ) : (
        <Text style={styles.messageText}>Upload your CV First!</Text>
      )}
      <AppSwitcher/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D2235', // Or your desired background color
    paddingTop: 20, // Adjust for status bar
  },
  scrollView: {
    flex: 1,
  },
  messageText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
});


