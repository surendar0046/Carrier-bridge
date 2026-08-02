import React, { useState } from 'react';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';

export const RootNavigator: React.FC = () => {
  const [isAuthenticated] = useState(true);

  return isAuthenticated ? <MainNavigator /> : <AuthNavigator />;
};
