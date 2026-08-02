import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { JobsScreen } from '../screens/jobs/JobsScreen';
import { CopilotScreen } from '../screens/ai-copilot/CopilotScreen';
import { MentorsScreen } from '../screens/mentor/MentorsScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

export const TabNavigator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'jobs' | 'copilot' | 'mentors' | 'profile'>('dashboard');

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {activeTab === 'dashboard' && <DashboardScreen />}
        {activeTab === 'jobs' && <JobsScreen />}
        {activeTab === 'copilot' && <CopilotScreen />}
        {activeTab === 'mentors' && <MentorsScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('dashboard')}>
          <Text style={[styles.tabText, activeTab === 'dashboard' && styles.activeTab]}>🏠 Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('jobs')}>
          <Text style={[styles.tabText, activeTab === 'jobs' && styles.activeTab]}>💼 Jobs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('copilot')}>
          <Text style={[styles.tabText, activeTab === 'copilot' && styles.activeTab]}>✨ AI</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('mentors')}>
          <Text style={[styles.tabText, activeTab === 'mentors' && styles.activeTab]}>👨‍🏫 Mentors</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('profile')}>
          <Text style={[styles.tabText, activeTab === 'profile' && styles.activeTab]}>👤 Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { flex: 1 },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#1e293b',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: { alignItems: 'center', justifyContent: 'center' },
  tabText: { color: '#94a3b8', fontSize: 12, fontWeight: '600' },
  activeTab: { color: '#38bdf8' },
});
