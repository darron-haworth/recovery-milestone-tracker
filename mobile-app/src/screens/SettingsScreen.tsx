import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();

  const navigateToIconBrowser = () => {
    // Navigate to the icon browser screen
    navigation.navigate('IconBrowser' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <LinearGradient
          colors={['#2E8B57', '#66CDAA']}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <Text style={styles.title}>OTR - Settings</Text>
            <Text style={styles.subtitle}>Customize your app experience</Text>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Development Tools</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={navigateToIconBrowser}
          >
            <View style={styles.settingLeft}>
              <MaterialIcons name="palette" size={24} color="#4169E1" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Icon Browser</Text>
                <Text style={styles.settingDescription}>
                  Browse and test Material Icons
                </Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#64748b" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="notifications" size={24} color="#4169E1" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Notifications</Text>
                <Text style={styles.settingDescription}>
                  Manage notification preferences
                </Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#64748b" />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="privacy-tip" size={24} color="#4169E1" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Privacy</Text>
                <Text style={styles.settingDescription}>
                  Privacy and data settings
                </Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#64748b" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="help" size={24} color="#4169E1" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Help & Support</Text>
                <Text style={styles.settingDescription}>
                  Get help and contact support
                </Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#64748b" />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="info" size={24} color="#4169E1" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>About</Text>
                <Text style={styles.settingDescription}>
                  App version and information
                </Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#64748b" />
          </View>
        </View>
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
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#64748b',
  },
});

export default SettingsScreen;
