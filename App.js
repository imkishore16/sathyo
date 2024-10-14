import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ChatProvider } from './Screens/KChat2/ChatContext'; 
import AppStack from './Screens/Router/AppStack';
import NotificationListener from './Screens/KChat2/NotificationListener';
import Toast from 'react-native-toast-message';
import { ChatRoomProvider } from './Screens/KChat2/ChatRoomProvider';

export default function App() {
  return (
    // <NavigationContainer>
    //   <ChatProvider >
    //       <AppStack/>
    //       <NotificationListener /> 
    //     </ChatProvider>
    //     <Toast />
    // </NavigationContainer>
    <NavigationContainer>
      <ChatProvider>
        <ChatRoomProvider>
          <AppStack />
          <NotificationListener /> 
        </ChatRoomProvider>
      </ChatProvider>
      <Toast />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
