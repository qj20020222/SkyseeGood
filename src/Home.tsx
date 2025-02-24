import NewsFeed from "@/components/feed";
import { NewsArticle } from "./types/newsArticle";
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useQuery } from '@apollo/client';
import { FIND_BY_TOPIC } from './services/graphql/news/Apollo';


export default function Home(){
  //const response = await fetch(url);
  //const newsArticles: NewsArticle[] = await response.json();
/* React.useEffect(() => {
      const fetchData = async () => {
          // Simulate cookie retrieval (React Native uses AsyncStorage)
          // In a real app, you'd use AsyncStorage.getItem('followedTopics')
          const cookieStore = { get: (key: string) => ({ value: localStorage.getItem(key) }) }; // Simulate for now
          const followedTopicsValue = cookieStore.get("followedTopics")?.value;
          setFollowedTopics(followedTopicsValue || ""); // Set initial state

          const categories = followedTopicsValue && JSON.parse(followedTopicsValue).join(',').toLowerCase();
          const url = getTopNewsUrl(categories);

          try {
              const response = await fetch(url);
              const data: NewsArticle[] = await response.json();
              setNewsArticles(data);
          } catch (error) {
              console.error("Error fetching news:", error);
              // Handle error appropriately (e.g., show error message)
          }
      };

      fetchData();
  }, []); // Run only once on mount */
  
  

  console.log('correct')

  const { loading, error, data, fetchMore } = useQuery(FIND_BY_TOPIC, {
    variables: { string:'Java',  skip:0, take:200 },
  });

  if (loading) return <View style={styles.container}><Text>Loading...</Text></View>; 
  if (error) return <View style={styles.container}><Text>Error: {error.message}</Text></View>; //
  
  return (
    <View style={styles.container}>
      <View style={styles.scrollView}>
        <NewsFeed newsArticles={data} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent', // Or your desired background color
    paddingTop: 20, // Adjust for status bar
  },
  scrollView: {
    flex: 1,
  },
});