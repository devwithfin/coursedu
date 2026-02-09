import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Modal, Switch, ActivityIndicator, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WebNavbar from '../../../components/WebNavbar';
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../../../api/user';

// Default Form
const emptyForm = {
  name: '',
  email: '',
  password: '',
  role: 'student',
  status: 'inactive',
};

// Main / Component
const ManageMemberScreen = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit' | 'view'>('view');
  const [form, setForm] = useState<any>(emptyForm);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const readOnly = mode === 'view';

  // Fetch
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const role =
        roleFilter === 'All' ? undefined : roleFilter.toLowerCase();
      const data = await getAllUsers(role);
      setMembers(data);
    } catch (err: any) {
      alert('Failed fetch members: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [roleFilter]);

  // Filter
  const filteredMembers = members.filter((item) => {
    const keyword = search.toLowerCase();
    return (
      item.name?.toLowerCase().includes(keyword) ||
      item.email?.toLowerCase().includes(keyword)
    );
  });

  // Action
  const openAdd = () => {
    setForm(emptyForm);
    setMode('add');
    setModalVisible(true);
  };

  const openView = (item: any) => {
    setForm({ ...item, password: '' });
    setMode('view');
    setModalVisible(true);
  };

  const openEdit = (item: any) => {
    setForm({ ...item, password: '' });
    setSelectedId(item.id);
    setMode('edit');
    setModalVisible(true);
  };

  const saveMember = async () => {
    if (!form.name || !form.email) {
      alert('Name & Email are required');
      return;
    }

    if (mode === 'add' && !form.password) {
      alert('Password is required');
      return;
    }

    try {
      if (mode === 'add') {
        await createUser(form);
      } else if (mode === 'edit' && selectedId) {
        const payload = { ...form };
        if (!payload.password) delete payload.password;
        await updateUser(selectedId, payload);
      }
      setModalVisible(false);
      fetchMembers();
    } catch (err: any) {
      alert('Save failed: ' + err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (Platform.OS === 'web') {
      if (!window.confirm('Delete this member?')) return;
    } else {
      Alert.alert('Confirm', 'Delete this member?', [
        { text: 'Cancel' },
        { text: 'Delete', onPress: () => deleteUser(id) },
      ]);
    }

    try {
      await deleteUser(id);
      fetchMembers();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  // Table Row
  const renderItem = ({ item, index }: any) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{index + 1}</Text>
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.email}</Text>
      <Text style={styles.cell}>{item.role}</Text>

      <View style={styles.cell}>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                item.status === 'active' ? '#22c55e' : '#9ca3af',
            },
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

  // UI
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
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#6b7280" />
          <TextInput
            placeholder="Search member name or email..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        {/* Role Filter */}
        <View style={styles.filterRow}>
          {['All', 'Student', 'Teacher', 'Instructor', 'Admin'].map((r) => (
            <TouchableOpacity
              key={r}
              onPress={() => setRoleFilter(r)}
              style={[
                styles.filterBtn,
                roleFilter === r && styles.filterActive,
              ]}
            >
              <Text
                style={{
                  color: roleFilter === r ? '#fff' : '#374151',
                }}
              >
                {r}
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
            <ActivityIndicator size="large" style={{ margin: 20 }} />
          ) : (
            <FlatList
              data={filteredMembers}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              style={{ maxHeight: 520 }}
            />
          )}
        </View>
      </View>

      {/* Modal */}
      <Modal transparent visible={modalVisible}>
        <View style={styles.modalBg}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Member Information</Text>

            {['Name', 'Email', 'Password'].map((label) => {
              const key = label.toLowerCase();
              return (
                <View style={styles.formItem} key={key}>
                  <Text style={styles.label}>{label}</Text>
                  <TextInput
                    style={styles.input}
                    editable={!readOnly && key !== 'password'}
                    secureTextEntry={key === 'password'}
                    value={form[key]}
                    onChangeText={(v) =>
                      setForm({ ...form, [key]: v })
                    }
                  />
                </View>
              );
            })}

            <View style={styles.switchRow}>
              <Switch
                value={form.status === 'active'}
                disabled={readOnly}
                onValueChange={(v) =>
                  setForm({ ...form, status: v ? 'active' : 'inactive' })
                }
              />
              <Text style={{ marginLeft: 8 }}>{form.status}</Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              {mode !== 'view' && (
                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={saveMember}
                >
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

/* Styles */
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

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14 },

  filterRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
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
  modal: { backgroundColor: '#fff', width: 600, padding: 20, borderRadius: 12 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },

  formItem: { marginBottom: 12 },
  label: { fontSize: 12, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    padding: 8,
  },

  switchRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },

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
});

export default ManageMemberScreen;
