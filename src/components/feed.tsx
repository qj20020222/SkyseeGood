import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView} from "react-native";
import { Ionicons } from "@expo/vector-icons";  // 用于显示箭头图标
import  SwipeCard  from "@/components/SwipeCard";
import AppSwitcher from "@/components/AppSwitcher";
import { NewsArticle } from "@/types/newsArticle";
import { ArrowLeftRight } from "lucide-react";
import {
  Dimensions,
} from 'react-native';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
export default function NewsFeed({ newsArticles }: { newsArticles: NewsArticle[] }) {
  const [cards, setCards] = useState(newsArticles);
  const [dismissedCards, setDismissedCards] = useState<NewsArticle[]>([]);
  const [showTip, setShowTip] = useState(false);
  const [isFading, setIsFading] = useState(false);
  console.log("Inside NewsFeed, cards:", cards);
  /*useEffect(() => {
    const hasSeenTip = localStorage.getItem('hasSeenSwipeTip');
    if (!hasSeenTip) {
      setShowTip(true);
      localStorage.setItem('hasSeenSwipeTip', 'true');
    }
  }, []);*/

  const handleSwipe = (id: string) => {
    const dismissedCard = cards.find(card => card._id === id);
    setCards((cards) => cards.filter((card) => card._id !== id));
    if (dismissedCard) {
      setDismissedCards(prev => [dismissedCard, ...prev]);
    }
    // Start fade out animation
    setIsFading(true);
    // Hide tip after fade animation completes
    setTimeout(() => {
      setShowTip(false);

    }, 500);
  };

  const handleUndo = () => {
    if (dismissedCards.length > 0) {
      const [lastDismissed, ...remainingDismissed] = dismissedCards;
      setDismissedCards(remainingDismissed);
      setCards(prev => [lastDismissed, ...prev]);
    }
  };

  return (
<>
  <View style={styles.container}> 
    {showTip && cards.length > 0 && (
      <View style={styles.tip}>
        <Text style={styles.tipText}>Swipe cards to explore</Text>
      </View>
    )}
    
    {cards.length === 0 ? (
      <View style={styles.noCards}>
        <Text style={styles.noCardsText}>All Caught Up!</Text>
        <Text>You have caught up with all news for now.</Text>
      </View>
    ) : (
      <View style={styles.cardsContainer}>
        {cards.map((card, index) => (
          <View 
            key={card._id}
            style={[
              styles.cardWrapper,
              {
                zIndex:3- index,// 最前面的卡片 zIndex 最大
                elevation: 0,
                //opacity: index === 2 ? 0.3 : 1,
                //width: `${100 - (index * 4)}%`,
                //marginHorizontal: 'auto',  // Android 层叠效果
                transform: [
                  { translateY: index * 8 },  // 添加缩放效果
                ],
              }
            ]}
          >
            <SwipeCard
              location={card.location}
              company={card.company}
              salary={card.salary}
              id={card._id}
              job={card.job}
              content={card.description}
              date={card.publishedDate}
              url={card.url}
              isTop= {true}
              onSwipe={() => handleSwipe(card._id)}
              onBack={handleUndo}
              showBack={index === 0 && dismissedCards.length > 0}
              context={card.context}
            />
          </View>
        ))}
      </View>
    )}
  </View>
  <AppSwitcher />
</>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D2235', // 设置背景颜色
    paddingTop: 20, // 添加顶部内边距,
  },
  tip: {
    position: 'relative',
    top: '40%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  tipFading: {
    opacity: 0,
  },
  tipText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#000',
  },
  noCards: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCardsText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  card: {
    position: 'relative',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 3, // Android shadow
  },
  cardImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  cardContent: {
    fontSize: 14,
    marginVertical: 5,
  },
  cardDate: {
    fontSize: 12,
    color: 'gray',
  },
  undoButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  undoText: {
    color: 'white',
    fontSize: 16,
  },
  cardsContainer: {
    flex: 1,
    position: 'relative',
    alignItems: 'center', // 用于定位子元素
    //justifyContent: 'center', // 添加这一行
     width: '100%'
  },
  
  cardWrapper: {
    position: 'absolute',
    width: '90%',
    borderColor: 'transparent',
    right: 0,
    padding: 10, // 添加内边距
    alignSelf: 'center',
    left: '2.5%', // 添加这一行，与width配合确保居中
  }
});