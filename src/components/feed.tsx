import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";  // 用于显示箭头图标
import  SwipeCard  from "@/components/SwipeCard";
import AppSwitcher from "@/components/AppSwitcher";
import { NewsArticle } from "@/types/newsArticle";
import { ArrowLeftRight } from "lucide-react";

export default function NewsFeed({ newsArticles }: { newsArticles: NewsArticle[] }) {
  const [cards, setCards] = useState(newsArticles);
  const [dismissedCards, setDismissedCards] = useState<NewsArticle[]>([]);
  const [showTip, setShowTip] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const hasSeenTip = localStorage.getItem('hasSeenSwipeTip');
    if (!hasSeenTip) {
      setShowTip(true);
      localStorage.setItem('hasSeenSwipeTip', 'true');
    }
  }, []);

  const handleSwipe = (id: string) => {
    const dismissedCard = cards.find(card => card.id === id);
    setCards((cards) => cards.filter((card) => card.id !== id));
    if (dismissedCard) {
      setDismissedCards(prev => [dismissedCard, ...prev]);
    }
    // Start fade out animation
    setIsFading(true);
    // Hide tip after fade animation completes
    setTimeout(() => {
      setShowTip(false);
      localStorage.setItem('hasSeenSwipeTip', 'true');
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
        cards.slice(0, 3).map((card, index) => (
          <SwipeCard
            location = {card.location}
            company = {card.company}
            salary = {card.salary}
            id = {card.id}
            job={card.job}
            content={card.description}
            date={card.publishedDate}
            url={card.url}
            isTop={index === 0}
            onSwipe={() => handleSwipe(card.id)}
            onBack={handleUndo}
            showBack={index === 0 && dismissedCards.length > 0}
          />
        ))
      )}
    </View>
    <AppSwitcher />
  </>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  tip: {
    position: 'absolute',
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
});