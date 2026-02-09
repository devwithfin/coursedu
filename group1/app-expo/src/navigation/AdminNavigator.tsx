import { createStackNavigator } from '@react-navigation/stack';
import AdminDashboardWebScreen from '../screens/admin/dashboard/Dashboard.web';
import ManageAcademyScreen from '../screens/admin/manage-academy/ManageAcademy.web';
import ManageMemberScreen from '../screens/admin/manage-member/ManageMember.web';
import ManageEnrollmentScreen from '../screens/admin/manage-enrollment/ManageEnrollment.web';

const AdminStack = createStackNavigator();

export default function AdminNavigator() {
  return (
    <AdminStack.Navigator screenOptions={{ headerShown: false }}>
      <AdminStack.Screen name="Dashboard" component={AdminDashboardWebScreen} />
      <AdminStack.Screen name="Manage Academy" component={ManageAcademyScreen} />
      <AdminStack.Screen name="Manage Member" component={ManageMemberScreen} />
      <AdminStack.Screen name="Manage Enrollment" component={ManageEnrollmentScreen} />
    </AdminStack.Navigator>
  );
}
