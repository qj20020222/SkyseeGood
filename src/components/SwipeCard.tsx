
import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
  TouchableOpacity,
  Linking,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import  {LinearGradient}  from 'expo-linear-gradient';
import AIInsight from './AIInsight';  // 正确
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
import { URL } from 'react-native-url-polyfill';
interface SwipeCardProps {
  id:string
  job: string;
  content: string;
  salary:string;
  location:string;
  company:string;
  onSwipe: (direction: 'left' | 'right') => void;
  date: string;
  url: string;
  isTop?: boolean;
  onBack?: () => void;
  showBack?: boolean;
}

const SwipeCard: React.FC<SwipeCardProps> = ({
  id,
  job,
  content,
  salary,
  location,
  company,
  date,
  url,
  onSwipe,
  onBack,
  isTop = false,
  showBack = false,
}) => {
  const [exitAnim] = useState(new Animated.Value(0));
  const [transform] = useState({
    x: new Animated.Value(0),
    scale: new Animated.Value(1),
  });
  const [imageError, setImageError] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isTop,
      onPanResponderMove: (_, gestureState) => {
        if (!isTop) return;
        Animated.event([null, { dx: transform.x }], {
          useNativeDriver: false,
        })(_, gestureState);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (!isTop) return;

        const { dx, vx } = gestureState;
        const velocityThreshold = 0.4;
        const distanceThreshold = SCREEN_WIDTH * 0.25;

        if (Math.abs(dx) > distanceThreshold || Math.abs(vx) > velocityThreshold) {
          const direction = dx > 0 ? 'right' : 'left';
          handleSwipe(direction);
        } else {
          Animated.spring(transform.x, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleSwipe = useCallback(
    (direction: 'left' | 'right') => {
      const toValue = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
      Animated.timing(exitAnim, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }).start(() => onSwipe(direction));
    },
    [onSwipe]
  );

  const getTitleSize = () => {
    if (job.length <= 40) return 24;
    if (job.length <= 80) return 20;
    return 18;
  };

  const hostname = new URL(url).hostname.replace(/^www\./, '');
  const favicon = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;

  const cardStyle = {
    transform: [
      { translateX: exitAnim || transform.x },
      { scale: transform.scale },
    ],
  };

  return (
    <Animated.View
      style={[styles.cardContainer, cardStyle]}
      {...panResponder.panHandlers}
    >
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: favicon }}
          style={styles.image}
          resizeMode="cover"
          onError={() => setImageError(true)}
        />
        
        <LinearGradient
          colors={['rgba(0,0,0,0.8)', 'rgba(0, 0, 0, 0.48)', 'rgba(0,0,0,0.9)']}
          style={styles.gradient}
          
        />
        {/* Source Info */}
        <TouchableOpacity
          style={styles.sourceContainer}
          onPress={() => Linking.openURL(url)}
        >

          <Text style={styles.hostname}>{hostname}</Text>
        </TouchableOpacity>

        {/* Title Section */}
        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.title,
              { fontSize: getTitleSize(), lineHeight: getTitleSize() * 1.2 },
            ]}
            numberOfLines={3}
          >
            {job}
          </Text>
        </View>
      </View>

      {/* Content Section */}
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.date}>
          {moment(date).format('MMM D')} · {content.slice(0, 370)}
          {content.length > 370 && '...'}
        </Text>
        <Text style={styles.date}>
           location: {location}
        </Text>
        <Text style={styles.date}>
          salary: {salary}
        </Text>
        <Text style={styles.date}>
           company: {company}
        </Text>
        <View style={styles.footer}>
          {showBack && (
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Icon name="arrow-back" size={24} color="#666" />
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.aiButton}
            onPress={() => () => setSheetOpen(true)}
          >
            <Text style={styles.aiButtonText}>AI Insights</Text>
            <LinearGradient
              colors={['#FF3366', '#8B5CF6', '#0EA5E9']}
              style={styles.gradientIcon}
            >
              <Icon name="insights" size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal
        visible={sheetOpen}
        animationType="slide"
        onRequestClose={() => setSheetOpen(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <AIInsight query = {id}/>
            <TouchableOpacity
              onPress={() => setSheetOpen(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.7,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  sourceContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 20,
  },
  favicon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  hostname: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  titleContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    zIndex: 2,
  },
  title: {
    color: 'white',
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  date: {
    color: '#666',
    fontSize: 14,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#666',
    marginLeft: 8,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  aiButtonText: {
    color: '#333',
    fontWeight: '500',
    marginRight: 8,
  },
  gradientIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalContent: {
    padding: 20,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#ddd",
    alignItems: "center",
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 16,
  },
});

export default SwipeCard;
