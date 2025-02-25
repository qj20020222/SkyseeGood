import NewsFeed from "@/components/feed";
import { NewsArticle } from "./types/newsArticle";
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useQuery } from '@apollo/client';
import { FIND_BY_TOPIC } from './services/graphql/news/Apollo';

export default function Home(){
  console.log('correct')

  const { loading, error, data} = useQuery(FIND_BY_TOPIC, {
    variables: { topic:'Java', skip:0, take:300
    },
    onError: (err) => {
      console.log('完整错误对象:', err);
      console.log('网络错误详情:', err.networkError);}
      
  });

  if (loading) return <View style={styles.container}><Text>Loading...</Text></View>; 
  if (error) return <View style={styles.container}><Text>Error: {error.message}</Text></View>; //

  console.log("NewsFeed 之前的数据:", data);
  console.log("Before passing to NewsFeed, data.newsArticles:", data.findbytopic);
  return (
    <View style={styles.container}>
      <View style={styles.scrollView}>
      <NewsFeed newsArticles={data.findbytopic || []} />
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
