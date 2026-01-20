import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Modal, Switch, Platform, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WebNavbar from '../../../components/WebNavbar';
import { getAllUsers, createUser, updateUser, deleteUser } from '../../../api/user'; // Import API functions

<<<<<<< HEAD
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: boolean;
  password?: string; // Password is optional, only sent on create/update if provided
}

/* Empty Form */
const emptyForm: User = {
  id: '',
  name: '',
=======
// Data Dummy
const INITIAL_MEMBERS = [
  {
    id: 1,
    fullName: 'Alfiansyah Cahyo Wicaksono',
    dob: '2004-12-09',
    gender: 'Male',
    email: 'alfiansyah@lms.test',
    password: 'password123',
    phone: '08123456789',
    registerDate: '2026-01-01',
    role: 'Teacher',
    status: true,
    course: 'Pemrograman Web',
  },
  {
    id: 2,
    fullName: 'Eka Avriliana',
    dob: '2005-04-27',
    gender: 'Female',
    email: 'ekaavril@lms.test',
    password: 'password123',
    phone: '08129876543',
    registerDate: '2026-01-01',
    role: 'Teacher',
    status: true,
    course: 'Mobile Programming',
  },
  {
    id: 3,
    fullName: 'Hesti Indriyani',
    dob: '2004-12-10',
    gender: 'Female',
    email: 'hestiindriyani@lms.test',
    password: 'password123',
    phone: '08129080706',
    registerDate: '2026-01-01',
    role: 'Teacher',
    status: true,
    course: 'Basis Data',
  },
  {
    id: 3,
    fullName: 'Rodstein Fing Beta Lucson',
    dob: '2003-04-20',
    gender: 'Male',
    email: 'luckycollage@lms.test',
    password: 'password123',
    phone: '08123040506',
    registerDate: '2026-01-01',
    role: 'Teacher',
    status: true,
    course: 'Machine Learning',
  },
];

// Empty Form
const emptyForm = {
  fullName: '',
  dob: '',
  gender: '',
>>>>>>> 0f027a5d2e3599703c9c85a48755cde19e543d8a
  email: '',
  password: '',
  role: '',
  status: false,
};

<<<<<<< HEAD
/* Web Select */
=======
const isRoleWithoutCourse = (role) =>
  role === 'Admin' || role === 'Management';

// Web Select
>>>>>>> 0f027a5d2e3599703c9c85a48755cde19e543d8a
const WebSelect = ({ value, onChange, options, disabled }) => (
  <select
    value={value}
    disabled={disabled}
    onChange={(e) => onChange(e.target.value)}
    style={styles.webInput}
  >
    {options.map((opt) => (
      <option key={opt} value={opt}>
        {opt}
      </option>
    ))}
  </select>
);

const ManageMemberScreen = () => {
  const [members, setMembers] = useState<User[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [mode, setMode] = useState('view'); // add | edit | view
  const [form, setForm] = useState<User>(emptyForm);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const readOnly = mode === 'view';

<<<<<<< HEAD
  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedMembers = await getAllUsers(roleFilter === 'All' ? null : roleFilter);
      setMembers(fetchedMembers.map(member => ({
        ...member,
        // Map backend 'name' to frontend 'fullName'
        fullName: member.name,
      })));
    } catch (err) {
      setError(err.message || 'Failed to fetch members');
    } finally {
      setLoading(false);
=======
  // Role + Course Logic
  useEffect(() => {
    if (isRoleWithoutCourse(form.role)) {
      setForm((prev) => ({
        ...prev,
        course: '',
      }));
>>>>>>> 0f027a5d2e3599703c9c85a48755cde19e543d8a
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [roleFilter]); // Refetch when roleFilter changes

  // Refetch when search changes (debounce to avoid too many requests)
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchMembers();
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [search]);


  // Action 
  const openAdd = () => {
    setForm(emptyForm);
    setMode('add');
    setModalVisible(true);
  };

  const openView = (item: User) => {
    setForm({ ...item, fullName: item.name }); // Map 'name' to 'fullName' for form
    setMode('view');
    setModalVisible(true);
  };

  const openEdit = (item: User) => {
    setForm({ ...item, fullName: item.name, password: '' }); // Map 'name' to 'fullName', clear password for edit
    setSelectedId(item.id);
    setMode('edit');
    setModalVisible(true);
  };

  const saveMember = async () => {
    if (!form.fullName || !form.email || !form.role) {
      Alert.alert('Validation Error', 'Full Name, Email, and Role are required.');
      return;
    }
    if (mode === 'add' && !form.password) {
        Alert.alert('Validation Error', 'Password is required for new members.');
        return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload = {
        name: form.fullName, // Map frontend 'fullName' to backend 'name'
        email: form.email,
        role: form.role,
        status: form.status,
      };

      if (form.password) { // Only include password if it's provided (for add or if changed in edit)
        payload.password = form.password;
      }

      if (mode === 'add') {
        await createUser(payload);
        Alert.alert('Success', 'Member added successfully.');
      }

      if (mode === 'edit' && selectedId) {
        await updateUser(selectedId, payload);
        Alert.alert('Success', 'Member updated successfully.');
      }
      setModalVisible(false);
      fetchMembers(); // Refetch all members to update the list
    } catch (err) {
      setError(err.message || 'Failed to save member');
      Alert.alert('Error', err.message || 'Failed to save member');
    } finally {
      setLoading(false);
    }
  };

  const removeMember = async (id: string) => {
    if (Platform.OS === 'web') {
<<<<<<< HEAD
      if (!window.confirm('Are you sure you want to delete this member?')) return;
    }

    setLoading(true);
    setError(null);
    try {
      await deleteUser(id);
      Alert.alert('Success', 'Member deleted successfully.');
      fetchMembers(); // Refetch all members to update the list
    } catch (err) {
      setError(err.message || 'Failed to delete member');
      Alert.alert('Error', err.message || 'Failed to delete member');
    } finally {
      setLoading(false);
=======
      if (!window.confirm('Are you sure want to delete?')) return;
>>>>>>> 0f027a5d2e3599703c9c85a48755cde19e543d8a
    }
  };

  // Filtered Data
  const filteredMembers = members.filter((m) => {
    const matchSearch =
      m.fullName.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

<<<<<<< HEAD
  /* Table */
  const renderItem = ({ item, index }: { item: User, index: number }) => (
=======
  // Table
  const renderItem = ({ item, index }) => (
>>>>>>> 0f027a5d2e3599703c9c85a48755cde19e543d8a
    <View style={styles.row}>
      <Text style={styles.cell}>{index + 1}</Text>
      <Text style={styles.cell}>{item.fullName}</Text>
      <Text style={styles.cell}>{item.email}</Text>
      <Text style={styles.cell}>{item.role}</Text>

      <View style={styles.cell}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: item.status ? '#22c55e' : '#9ca3af' },
          ]}
        >
          <Text style={styles.statusText}>
            {item.status ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>

      <View style={styles.action}>
        <TouchableOpacity onPress={() => openView(item)} style={styles.btnBlue}>
          <Ionicons name="eye" size={16} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openEdit(item)} style={styles.btnYellow}>
          <Ionicons name="create" size={16} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => removeMember(item.id)} // Changed to removeMember
          style={styles.btnRed}
        >
          <Ionicons name="trash" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <WebNavbar activeScreen="Manage Member" />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Manage Member</Text>
          <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.addText}>Add Member</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <TextInput
          placeholder="Search member name or email..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />

        {/* Filter */}
        <View style={styles.filterRow}>
<<<<<<< HEAD
          {['All', 'admin', 'student', 'teacher', 'manager'].map((r) => (
=======
          {['All', 'Member', 'Teacher', 'Instructor', 'Management'].map((r) => (
>>>>>>> 0f027a5d2e3599703c9c85a48755cde19e543d8a
            <TouchableOpacity
              key={r}
              onPress={() => setRoleFilter(r)}
              style={[
                styles.filterBtn,
                roleFilter === r && styles.filterActive,
              ]}
            >
              <Text style={{ color: roleFilter === r ? '#fff' : '#374151' }}>
                {r === 'admin' ? 'Admin' : r === 'student' ? 'Student' : r === 'teacher' ? 'Teacher' : r === 'manager' ? 'Manager' : 'All'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading && <ActivityIndicator size="large" color="#083D7F" style={{ marginTop: 20 }} />}
        {error && <Text style={styles.errorText}>Error: {error}</Text>}

        {!loading && !error && (
          <View style={styles.table}>
            <View style={styles.tableHead}>
              <Text style={styles.th}>#</Text>
              <Text style={styles.th}>Member</Text>
              <Text style={styles.th}>Email</Text>
              <Text style={styles.th}>Role</Text>
              <Text style={styles.th}>Status</Text>
              <Text style={styles.th}>Action</Text>
            </View>

            <FlatList
              data={filteredMembers}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
        )}
      </View>

      {/* Modal */}
      <Modal transparent visible={modalVisible}>
        <View style={styles.modalBg}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Personal Info</Text>

            <View style={styles.formGrid}>
              <Field label="Full Name">
                <TextInput
                  value={form.fullName}
                  editable={!readOnly}
                  onChangeText={(v) => setForm({ ...form, fullName: v })}
                  style={styles.input}
                />
              </Field>

              <Field label="Email">
                <TextInput
                  value={form.email}
                  editable={!readOnly}
                  onChangeText={(v) => setForm({ ...form, email: v })}
                  style={styles.input}
                />
              </Field>

              <Field label="Password">
                <TextInput
                  value={form.password}
                  editable={!readOnly && mode === 'add'} // Only editable when adding
                  onChangeText={(v) => setForm({ ...form, password: v })}
                  placeholder={mode === 'edit' ? 'Leave blank to keep current password' : ''}
                  style={styles.input}
                />
              </Field>

              <Field label="Role">
                <WebSelect
                  value={form.role}
                  disabled={readOnly}
                  onChange={(v) => setForm({ ...form, role: v })}
                  options={['Please Select','admin', 'student', 'teacher', 'manager']}
                />
              </Field>

              <Field label="Status">
                <View style={styles.switchRow}>
                  <Switch
                    value={form.status}
                    disabled={readOnly}
                    onValueChange={(v) =>
                      setForm({ ...form, status: v })
                    }
                  />
                  <Text style={{ marginLeft: 8 }}>
                    {form.status ? 'Active' : 'Inactive'}
                  </Text>
                </View>
              </Field>
<<<<<<< HEAD
=======

              {/* Course Benar Benar Hilang */}
              {!isRoleWithoutCourse(form.role) && (
                <Field label="Course">
                  <WebSelect
                    value={form.course}
                    disabled={readOnly}
                    onChange={(v) => setForm({ ...form, course: v })}
                    options={[
                      'Please Select',
                      'Pemrograman Web',
                      'Basis Data',
                      'Mobile Programming',
                      'Machine Learning',
                    ]}
                  />
                </Field>
              )}
>>>>>>> 0f027a5d2e3599703c9c85a48755cde19e543d8a
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              {mode !== 'view' && (
                <TouchableOpacity style={styles.saveBtn} onPress={saveMember} disabled={loading}>
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={{ color: '#fff' }}>
                      {mode === 'add' ? 'Add' : 'Update'}
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Field
const Field = ({ label, children }) => (
  <View style={styles.formItem}>
    <Text style={styles.label}>{label}</Text>
    {children}
  </View>
);

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold' },

  header: { flexDirection: 'row', justifyContent: 'space-between' },
  addBtn: {
    flexDirection: 'row',
    backgroundColor: '#0b3c89',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addText: { color: '#fff', marginLeft: 6 },

  searchInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 10,
    marginTop: 16,
    backgroundColor: '#fff',
  },

  filterRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
  },
  filterActive: { backgroundColor: '#0b3c89' },

  table: { backgroundColor: '#fff', borderRadius: 10, marginTop: 20 },
  tableHead: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    paddingVertical: 10,
  },
  th: { flex: 1, textAlign: 'center', fontWeight: '700' },
  row: { flexDirection: 'row', paddingVertical: 10 },
  cell: { flex: 1, textAlign: 'center', alignItems: 'center' },

  statusBadge: {
    minWidth: 80,
    height: 26,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: { color: '#fff', fontSize: 12 },

  action: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  btnBlue: { backgroundColor: '#1d4ed8', padding: 6, borderRadius: 6 },
  btnYellow: { backgroundColor: '#facc15', padding: 6, borderRadius: 6 },
  btnRed: { backgroundColor: '#ef4444', padding: 6, borderRadius: 6 },

  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: { backgroundColor: '#fff', width: 760, padding: 20, borderRadius: 12 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },

  formGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  formItem: { width: '48%' },
  label: { fontSize: 12, marginBottom: 4 },

  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    padding: 8,
  },
  webInput: {
    width: '100%',
    padding: 8,
    borderRadius: 6,
    border: '1px solid #e5e7eb',
  },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 20,
  },
  cancelBtn: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
  },
  saveBtn: {
    padding: 10,
    backgroundColor: '#0b3c89',
    borderRadius: 8,
  },

  switchRow: { flexDirection: 'row', alignItems: 'center' },
});

export default ManageMemberScreen;
