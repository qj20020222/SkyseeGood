
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
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import moment from 'moment';
import Feather from 'react-native-vector-icons/Feather';
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
  context:string
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
  context
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
  const imageurl = 'https://w.wallhaven.cc/full/5g/wallhaven-5g9ed8.png'
  const cardStyle = {
    transform: [
      { translateX: exitAnim || transform.x },
      { scale: transform.scale },
    ],
  };

  return (
  <>
    <Animated.View
      style={[styles.cardContainer, cardStyle]}
      {...panResponder.panHandlers}
    >
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageurl }}
          style={styles.image}
          resizeMode="cover"
          onError={() => setImageError(true)}
        />

        {/* Source Info */}
        <TouchableOpacity
          style={styles.sourceContainer}
          onPress={() => Linking.openURL(url)}
        >

          <Text style={styles.hostname}>{hostname}</Text>
        </TouchableOpacity>
      </View>

      {/* Content Section */}
      <ScrollView style={styles.contentContainer}>
        <Text style={{color:'white'}}>{date}</Text>
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
        <Text style={styles.date}
        adjustsFontSizeToFit={true}>
          {content}
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
              <Feather name="skip-back" size={24} color="#D3D3D3" />
              <Text style={{ marginLeft: 5, color: '#D3D3D3' }}>Back</Text>
            </TouchableOpacity>
          )}
      <TouchableOpacity
        onPress={() => {
        setSheetOpen(true);
      }}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginLeft: 'auto', 
      }}
    >
      <Text style={{ marginRight: 6, color :'white'}}>AI Insights</Text>
      <Svg
        width={14}
        height={14}
        viewBox="0 0 24 24"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Defs>
          <LinearGradient
            id="ai-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
           <Stop offset="0%" stopColor="#A7F3D0" /> 
           <Stop offset="50%" stopColor="#6EE7B7" /> 
           <Stop offset="100%" stopColor="#10B981" />
          </LinearGradient>
        </Defs>
        <Path
          d="M12 3l1.912 5.813a2 2 0 001.272 1.272L21 12l-5.813 1.912a2 2 0 00-1.272 1.272L12 21l-1.912-5.813a2 2 0 00-1.272-1.272L3 12l5.813-1.912a2 2 0 001.272-1.272L12 3z"
          stroke="url(#ai-gradient)"
          fill="url(#ai-gradient)" 
        />
      </Svg>
    </TouchableOpacity>
        </View>
      </ScrollView>
    </Animated.View>
    <Modal
        visible={sheetOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSheetOpen(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>标题</Text>   
            <ScrollView>
              <AIInsight query={context} />
            </ScrollView>
            <TouchableOpacity
              onPress={() => setSheetOpen(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>关闭</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </>
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
    height: 250,
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
    //position: 'absolute',
    top: 0,             // 改为顶部
    left: 0,
    right: 0,
    padding: 24,
    zIndex: 2,
  },
  title: {
    color: 'white',
    fontWeight: '900',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#555555'
  },
  date: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 16,      
    fontWeight: '700',  // 限制行数 // 超出显示...
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
    marginTop: 'auto',  // 让模态框从底部弹出
    height: '80%',      // 设置高度为屏幕的80%
    borderTopLeftRadius: 20,  // 顶部圆角
    borderTopRightRadius: 20,
    shadowColor: "#000",  // 添加阴影
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,       // Android阴影
  },
  modalContent: {
    backgroundColor: '#FFFFFF', // 确保内容区域有白色背景
    marginTop: 'auto', // 推到底部
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 300, // 给一个最小高度
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
