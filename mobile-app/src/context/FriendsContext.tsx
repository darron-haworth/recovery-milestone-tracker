import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Friend {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface FriendsContextType {
  friends: Friend[];
  addFriend: (friend: Friend) => void;
  removeFriend: (id: string) => void;
  getFriends: () => Friend[];
}

const FriendsContext = createContext<FriendsContextType | undefined>(undefined);

export const useFriends = () => {
  const context = useContext(FriendsContext);
  if (context === undefined) {
    throw new Error('useFriends must be used within a FriendsProvider');
  }
  return context;
};

interface FriendsProviderProps {
  children: ReactNode;
}

export const FriendsProvider: React.FC<FriendsProviderProps> = ({ children }) => {
  const [friends, setFriends] = useState<Friend[]>([]);

  const addFriend = (friend: Friend) => {
    setFriends(prev => [...prev, friend]);
  };

  const removeFriend = (id: string) => {
    setFriends(prev => prev.filter(friend => friend.id !== id));
  };

  const getFriends = () => friends;

  const value: FriendsContextType = {
    friends,
    addFriend,
    removeFriend,
    getFriends,
  };

  return <FriendsContext.Provider value={value}>{children}</FriendsContext.Provider>;
};
