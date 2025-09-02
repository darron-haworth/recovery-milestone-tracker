import React, { useState } from 'react';
import {
    Alert,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface Friend {
  id: string;
  nickname: string;
  sobrietyDate: string;
  recoveryType: string;
  daysSober: number;
  lastSeen: string;
  isOnline: boolean;
}

const FriendsScreen: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([
    {
      id: '1',
      nickname: 'RecoveryBuddy',
      sobrietyDate: '2023-01-15',
      recoveryType: 'Alcoholism',
      daysSober: 365,
      lastSeen: '2 hours ago',
      isOnline: true,
    },
    {
      id: '2',
      nickname: 'OneDayAtATime',
      sobrietyDate: '2022-06-10',
      recoveryType: 'Drug_Addiction',
      daysSober: 600,
      lastSeen: '1 day ago',
      isOnline: false,
    },
    {
      id: '3',
      nickname: 'StrongerTogether',
      sobrietyDate: '2023-03-20',
      recoveryType: 'Gambling',
      daysSober: 280,
      lastSeen: '30 minutes ago',
      isOnline: true,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newFriend, setNewFriend] = useState({
    nickname: '',
    sobrietyDate: '',
    recoveryType: 'Alcoholism',
  });

  const addFriend = () => {
    if (!newFriend.nickname.trim() || !newFriend.sobrietyDate) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const daysSober = Math.floor(
      (new Date().getTime() - new Date(newFriend.sobrietyDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    const friend: Friend = {
      id: Date.now().toString(),
      nickname: newFriend.nickname.trim(),
      sobrietyDate: newFriend.sobrietyDate,
      recoveryType: newFriend.recoveryType,
      daysSober,
      lastSeen: 'Just now',
      isOnline: true,
    };

    setFriends([...friends, friend]);
    setNewFriend({ nickname: '', sobrietyDate: '', recoveryType: 'Alcoholism' });
    setShowAddModal(false);
    Alert.alert('Success', 'Friend added successfully!');
  };

  const removeFriend = (friendId: string) => {
    Alert.alert(
      'Remove Friend',
      'Are you sure you want to remove this friend?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setFriends(friends.filter(friend => friend.id !== friendId));
          },
        },
      ]
    );
  };

  const sendEncouragement = (friend: Friend) => {
    Alert.alert(
      'Send Encouragement',
      `Send a supportive message to ${friend.nickname}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: () => {
            Alert.alert('Sent!', `Encouragement sent to ${friend.nickname}`);
          },
        },
      ]
    );
  };

  const renderFriendCard = (friend: Friend) => (
    <View key={friend.id} style={styles.friendCard}>
      <View style={styles.friendHeader}>
        <View style={styles.friendInfo}>
          <View style={styles.friendNameRow}>
            <Text style={styles.friendNickname}>{friend.nickname}</Text>
            <View style={[styles.onlineIndicator, { backgroundColor: friend.isOnline ? '#2E8B57' : '#708090' }]} />
          </View>
          <Text style={styles.recoveryType}>{friend.recoveryType.replace('_', ' ')}</Text>
          <Text style={styles.lastSeen}>Last seen: {friend.lastSeen}</Text>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeFriend(friend.id)}
        >
          <MaterialIcons name="close" size={20} color="#FF6B6B" />
        </TouchableOpacity>
      </View>

      <View style={styles.sobrietyInfo}>
        <View style={styles.daysContainer}>
          <Text style={styles.daysNumber}>{friend.daysSober}</Text>
          <Text style={styles.daysLabel}>Days Sober</Text>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>Since</Text>
          <Text style={styles.dateValue}>
            {new Date(friend.sobrietyDate).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.encourageButton}
          onPress={() => sendEncouragement(friend)}
        >
          <MaterialIcons name="favorite" size={16} color="#2E8B57" />
          <Text style={styles.encourageText}>Encourage</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.messageButton}>
          <MaterialIcons name="message" size={16} color="#4169E1" />
          <Text style={styles.messageText}>Message</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <LinearGradient
          colors={['#2E8B57', '#66CDAA']}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Recovery Friends</Text>
            <Text style={styles.subtitle}>Support each other, one day at a time</Text>
          </View>
        </LinearGradient>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{friends.length}</Text>
            <Text style={styles.statLabel}>Friends</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {friends.filter(f => f.isOnline).length}
            </Text>
            <Text style={styles.statLabel}>Online</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {Math.round(friends.reduce((sum, f) => sum + f.daysSober, 0) / friends.length) || 0}
            </Text>
            <Text style={styles.statLabel}>Avg Days</Text>
          </View>
        </View>

        <View style={styles.friendsList}>
          {friends.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="people-outline" size={64} color="#708090" />
              <Text style={styles.emptyTitle}>No Friends Yet</Text>
              <Text style={styles.emptyDescription}>
                Add friends to support each other in recovery
              </Text>
            </View>
          ) : (
            friends.map(renderFriendCard)
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <MaterialIcons name="person-add" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Recovery Friend</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <MaterialIcons name="close" size={24} color="#708090" />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Nickname</Text>
              <TextInput
                style={styles.input}
                value={newFriend.nickname}
                onChangeText={(text) => setNewFriend({ ...newFriend, nickname: text })}
                placeholder="Enter friend's nickname"
                placeholderTextColor="#708090"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Sobriety Date</Text>
              <TextInput
                style={styles.input}
                value={newFriend.sobrietyDate}
                onChangeText={(text) => setNewFriend({ ...newFriend, sobrietyDate: text })}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#708090"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Recovery Type</Text>
              <View style={styles.recoveryTypeButtons}>
                {['Alcoholism', 'Drug_Addiction', 'Gambling', 'Other'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.recoveryTypeButton,
                      newFriend.recoveryType === type && styles.recoveryTypeButtonActive,
                    ]}
                    onPress={() => setNewFriend({ ...newFriend, recoveryType: type })}
                  >
                    <Text
                      style={[
                        styles.recoveryTypeButtonText,
                        newFriend.recoveryType === type && styles.recoveryTypeButtonTextActive,
                      ]}
                    >
                      {type.replace('_', ' ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={addFriend}>
                <Text style={styles.saveButtonText}>Add Friend</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: -15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCard: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E8B57',
  },
  statLabel: {
    fontSize: 12,
    color: '#708090',
    marginTop: 4,
  },
  friendsList: {
    padding: 16,
  },
  friendCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  friendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  friendInfo: {
    flex: 1,
  },
  friendNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  friendNickname: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginRight: 8,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  recoveryType: {
    fontSize: 14,
    color: '#4169E1',
    marginBottom: 2,
  },
  lastSeen: {
    fontSize: 12,
    color: '#708090',
  },
  removeButton: {
    padding: 4,
  },
  sobrietyInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  daysContainer: {
    alignItems: 'center',
  },
  daysNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E8B57',
  },
  daysLabel: {
    fontSize: 12,
    color: '#708090',
    marginTop: 2,
  },
  dateContainer: {
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 12,
    color: '#708090',
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  encourageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f9f0',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2E8B57',
  },
  encourageText: {
    color: '#2E8B57',
    fontWeight: '500',
    marginLeft: 6,
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f4ff',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4169E1',
  },
  messageText: {
    color: '#4169E1',
    fontWeight: '500',
    marginLeft: 6,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#708090',
    textAlign: 'center',
    lineHeight: 24,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2E8B57',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1e293b',
  },
  recoveryTypeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recoveryTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8f9fa',
  },
  recoveryTypeButtonActive: {
    backgroundColor: '#2E8B57',
    borderColor: '#2E8B57',
  },
  recoveryTypeButtonText: {
    fontSize: 14,
    color: '#708090',
  },
  recoveryTypeButtonTextActive: {
    color: '#FFFFFF',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#708090',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#2E8B57',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});

export default FriendsScreen;
