import { createStackNavigator } from '@react-navigation/stack';
import AdminDashboardWebScreen from '../screens/admin/dashboard/Dashboard.web';

const AdminStack = createStackNavigator();

export default function AdminNavigator() {
  return (
    <AdminStack.Navigator screenOptions={{ headerShown: false }}>
      <AdminStack.Screen name="Dashboard" component={AdminDashboardWebScreen} />
    </AdminStack.Navigator>
  );
}
