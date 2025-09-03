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
import { Milestone, MilestoneCategory } from '../../milestoneTypes';

interface UserMilestone extends Milestone {
  id: string;
  achievedDate?: string;
  isAchieved: boolean;
  isCustom: boolean;
  notes?: string;
}

const MilestonesScreen: React.FC = () => {
  const [userMilestones, setUserMilestones] = useState<UserMilestone[]>([
    {
      id: '1',
      days: 1,
      timeUnit: 'days',
      label: '24 Hours',
      category: 'early',
      description: 'One day at a time',
      isAchieved: true,
      achievedDate: '2023-01-15',
      isCustom: false,
      notes: 'First day of my new life!',
    },
    {
      id: '2',
      days: 30,
      timeUnit: 'days',
      label: '30 Days',
      category: 'early',
      description: 'One month milestone',
      isAchieved: true,
      achievedDate: '2023-02-14',
      isCustom: false,
      notes: 'Feeling stronger every day',
    },
    {
      id: '3',
      days: 90,
      timeUnit: 'days',
      label: '90 Days',
      category: 'early',
      description: 'Quarter year achievement',
      isAchieved: true,
      achievedDate: '2023-04-15',
      isCustom: false,
      notes: 'Three months of freedom!',
    },
    {
      id: '4',
      days: 365,
      timeUnit: 'years',
      years: 1,
      label: '1 Year',
      category: 'foundation',
      description: 'First year complete',
      isAchieved: false,
      isCustom: false,
    },
    {
      id: '5',
      days: 500,
      timeUnit: 'days',
      label: '500 Days',
      category: 'early',
      description: 'Custom milestone',
      isAchieved: false,
      isCustom: true,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    label: '',
    days: '',
    description: '',
  });

  const [selectedCategory, setSelectedCategory] = useState<MilestoneCategory>('early');

  const addCustomMilestone = () => {
    if (!newMilestone.label.trim() || !newMilestone.days.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const days = parseInt(newMilestone.days);
    if (isNaN(days) || days <= 0) {
      Alert.alert('Error', 'Please enter a valid number of days');
      return;
    }

    const milestone: UserMilestone = {
      id: Date.now().toString(),
      days,
      timeUnit: 'days',
      label: newMilestone.label.trim(),
      category: selectedCategory,
      description: newMilestone.description.trim() || 'Custom milestone',
      isAchieved: false,
      isCustom: true,
    };

    setUserMilestones([...userMilestones, milestone]);
    setNewMilestone({ label: '', days: '', description: '' });
    setShowAddModal(false);
    Alert.alert('Success', 'Custom milestone added successfully!');
  };

  const markMilestoneAchieved = (milestoneId: string) => {
    setUserMilestones(milestones =>
      milestones.map(milestone =>
        milestone.id === milestoneId
          ? {
              ...milestone,
              isAchieved: true,
              achievedDate: new Date().toISOString().split('T')[0],
            }
          : milestone
      )
    );
    Alert.alert('Congratulations!', 'Milestone marked as achieved!');
  };

  const removeMilestone = (milestoneId: string) => {
    Alert.alert(
      'Remove Milestone',
      'Are you sure you want to remove this milestone?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setUserMilestones(milestones => milestones.filter(m => m.id !== milestoneId));
          },
        },
      ]
    );
  };

  const getMilestoneIcon = (milestone: UserMilestone): string => {
    if (milestone.isAchieved) {
      return '🎉';
    }
    const icons: Record<MilestoneCategory, string[]> = {
      early: ['🌱', '⭐', '💪', '🎯', '🚀'],
      foundation: ['🏗️', '🌳', '🏔️', '🛡️', '⚡'],
      extended: ['🌟', '🏆', '💎', '👑', '🎖️'],
      annual: ['🎉', '🏅', '💫', '✨', '🎊'],
    };
    const categoryIcons = icons[milestone.category];
    const index = (milestone.days % categoryIcons.length);
    return categoryIcons[index];
  };

  const getProgressToMilestone = (milestone: UserMilestone): number => {
    // Mock current days sober - in real app, this would come from user's sobriety date
    const currentDays = 280;
    if (milestone.isAchieved) return 100;
    if (currentDays >= milestone.days) return 100;
    
    // Find previous milestone
    const previousMilestone = userMilestones
      .filter(m => m.days < milestone.days && m.isAchieved)
      .reduce((latest, m) => m.days > latest.days ? m : latest, { days: 0 } as UserMilestone);
    
    const totalRange = milestone.days - previousMilestone.days;
    const progress = currentDays - previousMilestone.days;
    
    return Math.min(100, Math.max(0, (progress / totalRange) * 100));
  };

  const renderMilestoneCard = (milestone: UserMilestone) => {
    const progress = getProgressToMilestone(milestone);
    const isUpcoming = !milestone.isAchieved && progress > 0;

    return (
      <View key={milestone.id} style={styles.milestoneCard}>
        <View style={styles.milestoneHeader}>
          <View style={styles.milestoneIcon}>
            <Text style={styles.iconText}>{getMilestoneIcon(milestone)}</Text>
          </View>
          <View style={styles.milestoneInfo}>
            <Text style={styles.milestoneLabel}>{milestone.label}</Text>
            <Text style={styles.milestoneDescription}>{milestone.description}</Text>
            <Text style={styles.milestoneCategory}>
              {milestone.category.charAt(0).toUpperCase() + milestone.category.slice(1)} Recovery
            </Text>
          </View>
          {milestone.isCustom && (
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeMilestone(milestone.id)}
            >
              <MaterialIcons name="close" size={20} color="#FF6B6B" />
            </TouchableOpacity>
          )}
        </View>

        {milestone.isAchieved ? (
          <View style={styles.achievedContainer}>
            <View style={styles.achievedBadge}>
              <MaterialIcons name="check-circle" size={20} color="#2E8B57" />
              <Text style={styles.achievedText}>Achieved!</Text>
            </View>
            <Text style={styles.achievedDate}>
              {milestone.achievedDate && new Date(milestone.achievedDate).toLocaleDateString()}
            </Text>
            {milestone.notes && (
              <Text style={styles.milestoneNotes}>{milestone.notes}</Text>
            )}
          </View>
        ) : (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <View style={styles.progressInfo}>
              <Text style={styles.progressText}>
                {progress.toFixed(0)}% Complete
              </Text>
              {isUpcoming && (
                <TouchableOpacity
                  style={styles.markAchievedButton}
                  onPress={() => markMilestoneAchieved(milestone.id)}
                >
                  <Text style={styles.markAchievedText}>Mark Achieved</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>
    );
  };

  const achievedMilestones = userMilestones.filter(m => m.isAchieved);
  const upcomingMilestones = userMilestones.filter(m => !m.isAchieved);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <LinearGradient
          colors={['#2E8B57', '#66CDAA']}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Recovery Milestones</Text>
            <Text style={styles.subtitle}>Celebrate every step of your journey</Text>
          </View>
        </LinearGradient>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{achievedMilestones.length}</Text>
            <Text style={styles.statLabel}>Achieved</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{upcomingMilestones.length}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {userMilestones.filter(m => m.isCustom).length}
            </Text>
            <Text style={styles.statLabel}>Custom</Text>
          </View>
        </View>

        {achievedMilestones.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏆 Achieved Milestones</Text>
            {achievedMilestones.map(renderMilestoneCard)}
          </View>
        )}

        {upcomingMilestones.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎯 Upcoming Milestones</Text>
            {upcomingMilestones.map(renderMilestoneCard)}
          </View>
        )}

        {userMilestones.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialIcons name="emoji-events" size={64} color="#708090" />
            <Text style={styles.emptyTitle}>No Milestones Yet</Text>
            <Text style={styles.emptyDescription}>
              Add milestones to track your recovery progress
            </Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <MaterialIcons name="add" size={24} color="#FFFFFF" />
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
              <Text style={styles.modalTitle}>Add Custom Milestone</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <MaterialIcons name="close" size={24} color="#708090" />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Milestone Name *</Text>
              <TextInput
                style={styles.input}
                value={newMilestone.label}
                onChangeText={(text) => setNewMilestone({ ...newMilestone, label: text })}
                placeholder="e.g., 500 Days, 6 Months"
                placeholderTextColor="#708090"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Days from Start *</Text>
              <TextInput
                style={styles.input}
                value={newMilestone.days}
                onChangeText={(text) => setNewMilestone({ ...newMilestone, days: text })}
                placeholder="e.g., 500"
                placeholderTextColor="#708090"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categoryButtons}>
                {(['early', 'foundation', 'extended', 'annual'] as MilestoneCategory[]).map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category && styles.categoryButtonActive,
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        selectedCategory === category && styles.categoryButtonTextActive,
                      ]}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newMilestone.description}
                onChangeText={(text) => setNewMilestone({ ...newMilestone, description: text })}
                placeholder="Optional description..."
                placeholderTextColor="#708090"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={addCustomMilestone}>
                <Text style={styles.saveButtonText}>Add Milestone</Text>
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
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
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
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  milestoneCard: {
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
  milestoneHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  milestoneIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 24,
  },
  milestoneInfo: {
    flex: 1,
  },
  milestoneLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  milestoneDescription: {
    fontSize: 14,
    color: '#708090',
    marginBottom: 4,
  },
  milestoneCategory: {
    fontSize: 12,
    color: '#4169E1',
    fontWeight: '500',
  },
  removeButton: {
    padding: 4,
  },
  achievedContainer: {
    backgroundColor: '#f0f9f0',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2E8B57',
  },
  achievedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E8B57',
    marginLeft: 8,
  },
  achievedDate: {
    fontSize: 14,
    color: '#708090',
    marginBottom: 8,
  },
  milestoneNotes: {
    fontSize: 14,
    color: '#1e293b',
    fontStyle: 'italic',
  },
  progressContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2E8B57',
    borderRadius: 4,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    color: '#708090',
  },
  markAchievedButton: {
    backgroundColor: '#2E8B57',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  markAchievedText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
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
    maxHeight: '80%',
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8f9fa',
  },
  categoryButtonActive: {
    backgroundColor: '#2E8B57',
    borderColor: '#2E8B57',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#708090',
  },
  categoryButtonTextActive: {
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

export default MilestonesScreen;
