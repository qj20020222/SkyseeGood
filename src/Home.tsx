import NewsFeed from "@/components/feed";
import { NewsArticle } from "./types/newsArticle";
import { View, StyleSheet, ScrollView } from 'react-native';
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
  

  const newsArticles: NewsArticle[] = [
 {
 "id": '0',
 "publishedDate": "2024/JAN/10",
 "url": 'https://www.zhipin.com',
 "job": "Software Engineer",
 "company": "Google",  
 "location": "Mountain View, CA",    
 "salary": "150,000",     
 "description": "Develops software applications for Google products.",
 "context": "你因该掌握..."
},
      
{
 "id": '1',    
 "publishedDate": "2024/JAN/10",
 "url": 'https://www.zhipin.com',
 "job": "Software Engineer",
 "company": "Facebook",  
 "location": "Menlo Park, CA",
 "salary": "140,000",
 "description": "Develops software applications for Facebook products.",
  "context": "你因该掌握..."
 },
      
{
 "id": '2',
 "publishedDate": "2024/JAN/10",
 "url": 'https://www.zhipin.com',
 "job": "Software Engineer",
 "company": "Amazon",
 "location": "Seattle, WA",   
 "salary": "130,000",     
 "description": "Develops software applications for Amazon products." ,   
 "context": "你因该掌握..."
}   
  ]
  console.log('correct')
  return (
    <View style={styles.container}>
      <View style={styles.scrollView}>
        <NewsFeed newsArticles={newsArticles} />
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