import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AIInsightProps {
  title?: string;
  insight?: string;
}

const AIInsight: React.FC<AIInsightProps> = ({
  title = 'AI Insight',
  insight = 'Analyzing data to provide valuable insights...'
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.divider} />
      <Text style={styles.insightText}>{insight}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  insightText: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 24,
  },
});

export default AIInsight;
