import * as React from 'react';

declare module 'react-native' {
  export const View: any;
  export const Text: any;
  export const TouchableOpacity: any;
  export const StyleSheet: any;
  export const ScrollView: any;
  export const FlatList: any;
  export const SafeAreaView: any;
  export const StatusBar: any;
  export type ViewStyle = any;
}
