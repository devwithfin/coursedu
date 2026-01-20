import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Modal, Switch, Platform, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WebNavbar from '../../../components/WebNavbar';
import { getAllUsers, createUser, updateUser, deleteUser } from '../../../api/user';

// Empty Form
const emptyForm = {
  name: '',
  email: '',
  password: '',
  role: 'student',
  status: 'active',
};

// Web Select
const WebSelect = ({ value, onChange, options, disabled }) => (
  <select
    value={value}
    disabled={disabled}
    onChange={(e) => onChange(e.target.value)}
    style={styles.webInput}
  >
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);

const ManageMemberScreen = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [mode, setMode] = useState('view'); // add | edit | view
  const [form, setForm] = useState(emptyForm);
  const [selectedId, setSelectedId] = useState(null);

  // Search & Filter
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const readOnly = mode === 'view';

  // Fetch Data
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const role = roleFilter === 'All' ? null : roleFilter.toLowerCase();
      const data = await getAllUsers(role);
      setMembers(data);
    } catch (error) {
      console.error(error);
      if (Platform.OS === 'web') {
        alert('Failed to fetch members: ' + error.message);
      } else {
        Alert.alert('Error', 'Failed to fetch members');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [roleFilter]);

  // Action 
  const openAdd = () => {
    setForm(emptyForm);
    setMode('add');
    setModalVisible(true);
  };

  const openView = (item) => {
    setForm({
      ...item,
      password: '', // Don't show password
    });
    setMode('view');
    setModalVisible(true);
  };

  const openEdit = (item) => {
    setForm({
      ...item,
      password: '', // Only fill if want to change
    });
    setSelectedId(item.id);
    setMode('edit');
    setModalVisible(true);
  };

  const saveMember = async () => {
    if (!form.name || !form.email) {
       alert('Name and Email are required');
       return;
    }
    
    if (mode === 'add' && !form.password) {
       alert('Password is required for new user');
       return;
    }

    try {
      if (mode === 'add') {
        await createUser(form);
      } else if (mode === 'edit') {
        // If password empty, don't send it to backend
        const updateData = { ...form };
        if (!updateData.password) delete updateData.password;
        await updateUser(selectedId, updateData);
      }
      setModalVisible(false);
      fetchMembers();
    } catch (error) {
      alert('Error saving member: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (Platform.OS === 'web') {
      if (!window.confirm('Are you sure want to delete?')) return;
    }
    try {
      await deleteUser(id);
      fetchMembers();
    } catch (error) {
      alert('Error deleting member: ' + error.message);
    }
  };

  // Filtered Data (Search on Client)
  const filteredMembers = members.filter((m) => {
    const matchSearch =
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase());

    return matchSearch;
  });

  // Table
  const renderItem = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{index + 1}</Text>
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.email}</Text>
      <Text style={styles.cell}>{item.role}</Text>

      <View style={styles.cell}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: item.status === 'active' ? '#22c55e' : '#9ca3af' },
          ]}
        >
          <Text style={styles.statusText}>
            {item.status === 'active' ? 'Active' : 'Inactive'}
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
          onPress={() => handleDelete(item.id)}
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
          {[
            { label: 'All', value: 'All' },
            { label: 'Student', value: 'Student' },
            { label: 'Teacher', value: 'Teacher' },
            { label: 'Manager', value: 'Manager' },
            { label: 'Admin', value: 'Admin' }
          ].map((r) => (
            <TouchableOpacity
              key={r.value}
              onPress={() => setRoleFilter(r.value)}
              style={[
                styles.filterBtn,
                roleFilter === r.value && styles.filterActive,
              ]}
            >
              <Text style={{ color: roleFilter === r.value ? '#fff' : '#374151' }}>
                {r.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.table}>
          <View style={styles.tableHead}>
            <Text style={styles.th}>#</Text>
            <Text style={styles.th}>Member</Text>
            <Text style={styles.th}>Email</Text>
            <Text style={styles.th}>Role</Text>
            <Text style={styles.th}>Status</Text>
            <Text style={styles.th}>Action</Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#0b3c89" style={{ margin: 20 }} />
          ) : (
            <FlatList
              data={filteredMembers}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
            />
          )}
        </View>
      </View>

      {/* Modal */}
      <Modal transparent visible={modalVisible}>
        <View style={styles.modalBg}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>User Information</Text>

            <View style={styles.formGrid}>
              <Field label="Full Name">
                <TextInput
                  value={form.name}
                  editable={!readOnly}
                  onChangeText={(v) => setForm({ ...form, name: v })}
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
                  placeholder={mode === 'edit' ? '(Leave blank to keep current)' : ''}
                  value={form.password}
                  editable={!readOnly}
                  secureTextEntry
                  onChangeText={(v) => setForm({ ...form, password: v })}
                  style={styles.input}
                />
              </Field>

              <Field label="Role">
                <WebSelect
                  value={form.role}
                  disabled={readOnly}
                  onChange={(v) => setForm({ ...form, role: v })}
                  options={[
                    { label: 'Admin', value: 'admin' },
                    { label: 'Teacher', value: 'teacher' },
                    { label: 'Manager', value: 'manager' },
                    { label: 'Student', value: 'student' }
                  ]}
                />
              </Field>

              <Field label="Status">
                <View style={styles.switchRow}>
                  <Switch
                    value={form.status === 'active'}
                    disabled={readOnly}
                    onValueChange={(v) =>
                      setForm({ ...form, status: v ? 'active' : 'inactive' })
                    }
                  />
                  <Text style={{ marginLeft: 8, textTransform: 'capitalize' }}>
                    {form.status}
                  </Text>
                </View>
              </Field>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              {mode !== 'view' && (
                <TouchableOpacity style={styles.saveBtn} onPress={saveMember}>
                  <Text style={{ color: '#fff' }}>
                    {mode === 'add' ? 'Add' : 'Update'}
                  </Text>
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
