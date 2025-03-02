import NewsFeed from "@/components/feed";
import { NewsArticle } from "./types/newsArticle";
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useQuery } from '@apollo/client';
import { FIND_ARTICLE_BY_ID, FIND_BY_TOPIC } from './services/graphql/news/Apollo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from "react";

export default async function Home(){
  const[loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<any[]>([]);
  const [error, setError] = useState(null);

  console.log('correct')

  const getAllValues = async () => {
    try {
      const dataJson = await AsyncStorage.getItem('my-key');
      if (dataJson) {
        return JSON.parse(dataJson);
      }
      return [];
    } catch (e) {
      console.error('读取数据失败', e);
      return [];
    }
  };
  const values = await getAllValues();

 useEffect(()=>{
  let isMounted = true;
  const fetchArticles = async () => {
    try{    
      const articles = [];
      for (let i = 0; i < values.length; i++) {
      const id = values[i];
      const { loading, error, data} = useQuery(FIND_ARTICLE_BY_ID, {
      variables: { topic:id, skip:0, take:300
      },
      onError: (err) => {
        console.log('完整错误对象:', err);
        console.log('网络错误详情:', err.networkError);}  
      })
    if (isMounted) {
      articles.push(data.findArticlebyid)
    }
  } 
    if (isMounted) {
      setArticles(articles);
      setLoading(false);
    }  
  } catch (err) {
    const e =err as any;
    console.log('完整错误对象:', e);
    console.log('网络错误详情:', e.networkError);
    if (isMounted) {
      setError(e);
      setLoading(false);
    }
  }
  };
  fetchArticles();
  return () => {
  isMounted = false;
};

}, [values])



  if (loading) return <View style={styles.container}><Text>Loading...</Text></View>; 
  if (error) return <View style={styles.container}><Text>Error: {error}</Text></View>; //

  console.log("Before passing to NewsFeed, data.newsArticles:", articles);
  return (
    <View style={styles.container}>
      <View style={styles.scrollView}>
      <NewsFeed newsArticles={articles || []} />
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
});


