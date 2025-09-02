import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const IconPicker: React.FC = () => {
  const iconCategories = {
    'Navigation & Actions': [
      'home', 'menu', 'search', 'close', 'arrow-back', 'arrow-forward',
      'check', 'add', 'remove', 'edit', 'delete', 'save', 'refresh',
      'share', 'favorite', 'favorite-border', 'bookmark', 'bookmark-border'
    ],
    'People & Social': [
      'person', 'people', 'group', 'face', 'account-circle', 'supervisor-account',
      'person-add', 'person-remove', 'group-add', 'chat', 'message', 'email'
    ],
    'Time & Calendar': [
      'schedule', 'event', 'today', 'date-range', 'access-time', 'timer',
      'alarm', 'notifications', 'notifications-none', 'notifications-active'
    ],
    'Media & Files': [
      'photo', 'image', 'camera', 'video-call', 'videocam', 'mic', 'headset',
      'music-note', 'play-arrow', 'pause', 'stop', 'volume-up', 'volume-down'
    ],
    'Communication': [
      'call', 'phone', 'phone-enabled', 'sms', 'chat-bubble', 'forum',
      'comment', 'reply', 'forward', 'send', 'mail', 'inbox'
    ],
    'Settings & Tools': [
      'settings', 'tune', 'build', 'construction', 'engineering', 'code',
      'bug-report', 'help', 'info', 'warning', 'error', 'check-circle'
    ],
    'Achievement & Progress': [
      'star', 'star-border', 'star-half', 'emoji-events', 'military-tech',
      'workspace-premium', 'diamond', 'trending-up', 'trending-down'
    ],
    'Health & Wellness': [
      'favorite', 'favorite-border', 'local-hospital', 'healing', 'spa',
      'pool', 'fitness-center', 'directions-run', 'directions-walk'
    ],
    'Business & Finance': [
      'business', 'work', 'account-balance', 'attach-money', 'payment',
      'credit-card', 'receipt', 'shopping-cart', 'store', 'local-grocery-store'
    ],
    'Miscellaneous': [
      'lightbulb', 'lightbulb-outline', 'lock', 'lock-open', 'visibility',
      'visibility-off', 'security', 'shield', 'verified', 'verified-user'
    ]
  };

  const renderIconCategory = (categoryName: string, icons: string[]) => (
    <View key={categoryName} style={styles.categoryContainer}>
      <Text style={styles.categoryTitle}>{categoryName}</Text>
      <View style={styles.iconGrid}>
        {icons.map((iconName, index) => (
          <TouchableOpacity
            key={`${categoryName}-${iconName}-${index}`}
            style={styles.iconButton}
            onPress={() => console.log(`Selected icon: ${iconName}`)}
          >
            <MaterialIcons name={iconName} size={24} color="#4169E1" />
            <Text style={styles.iconName} numberOfLines={1}>
              {iconName}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Material Icons Browser</Text>
          <Text style={styles.subtitle}>
            Tap any icon to see its name in the console
          </Text>
        </View>
        
        {Object.entries(iconCategories).map(([categoryName, icons]) =>
          renderIconCategory(categoryName, icons)
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
    paddingLeft: 4,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  iconButton: {
    width: 70,
    height: 70,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconName: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 60,
  },
});

export default IconPicker;
