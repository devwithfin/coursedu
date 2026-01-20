import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Modal, Switch, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WebNavbar from '../../../components/WebNavbar';

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
  email: '',
  password: '',
  phone: '',
  registerDate: '',
  role: '',
  status: false,
  course: '',
};

const isRoleWithoutCourse = (role) =>
  role === 'Admin' || role === 'Management';

// Web Select
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
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [modalVisible, setModalVisible] = useState(false);
  const [mode, setMode] = useState('view'); // add | edit | view
  const [form, setForm] = useState(emptyForm);
  const [selectedId, setSelectedId] = useState(null);

  // Search & Filter
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const readOnly = mode === 'view';

  // Role + Course Logic
  useEffect(() => {
    if (isRoleWithoutCourse(form.role)) {
      setForm((prev) => ({
        ...prev,
        course: '',
      }));
    }
  }, [form.role]);

  // Action 
  const openAdd = () => {
    setForm(emptyForm);
    setMode('add');
    setModalVisible(true);
  };

  const openView = (item) => {
    setForm(item);
    setMode('view');
    setModalVisible(true);
  };

  const openEdit = (item) => {
    setForm(item);
    setSelectedId(item.id);
    setMode('edit');
    setModalVisible(true);
  };

  const saveMember = () => {
    if (!form.fullName || !form.email) return;

    if (mode === 'add') {
      setMembers([...members, { ...form, id: Date.now() }]);
    }

    if (mode === 'edit') {
      setMembers(
        members.map((m) =>
          m.id === selectedId ? { ...form, id: selectedId } : m
        )
      );
    }

    setModalVisible(false);
  };

  const deleteMember = (id) => {
    if (Platform.OS === 'web') {
      if (!window.confirm('Are you sure want to delete?')) return;
    }
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  // Filtered Data
  const filteredMembers = members.filter((m) => {
    const matchSearch =
      m.fullName.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());

    const matchRole =
      roleFilter === 'All' ? true : m.role === roleFilter;

    return matchSearch && matchRole;
  });

  // Table
  const renderItem = ({ item, index }) => (
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
          onPress={() => deleteMember(item.id)}
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
          {['All', 'Member', 'Teacher', 'Instructor', 'Management'].map((r) => (
            <TouchableOpacity
              key={r}
              onPress={() => setRoleFilter(r)}
              style={[
                styles.filterBtn,
                roleFilter === r && styles.filterActive,
              ]}
            >
              <Text style={{ color: roleFilter === r ? '#fff' : '#374151' }}>
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

          <FlatList
            data={filteredMembers}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
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

              <Field label="Date of Birth">
                <input
                  type="date"
                  disabled={readOnly}
                  value={form.dob}
                  onChange={(e) =>
                    setForm({ ...form, dob: e.target.value })
                  }
                  style={styles.webInput}
                />
              </Field>

              <Field label="Gender">
                <WebSelect
                  value={form.gender}
                  disabled={readOnly}
                  onChange={(v) => setForm({ ...form, gender: v })}
                  options={['Please Select','Male', 'Female']}
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
                  editable={!readOnly}
                  onChangeText={(v) => setForm({ ...form, password: v })}
                  style={styles.input}
                />
              </Field>

              <Field label="Phone">
                <TextInput
                  value={form.phone}
                  editable={!readOnly}
                  onChangeText={(v) => setForm({ ...form, phone: v })}
                  style={styles.input}
                />
              </Field>

              <Field label="Register Date">
                <input
                  type="date"
                  disabled={readOnly}
                  value={form.registerDate}
                  onChange={(e) =>
                    setForm({ ...form, registerDate: e.target.value })
                  }
                  style={styles.webInput}
                />
              </Field>

              <Field label="Role">
                <WebSelect
                  value={form.role}
                  disabled={readOnly}
                  onChange={(v) => setForm({ ...form, role: v })}
                  options={['Please Select','Admin', 'Teacher','Instructor', 'Management', 'Member']}
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
