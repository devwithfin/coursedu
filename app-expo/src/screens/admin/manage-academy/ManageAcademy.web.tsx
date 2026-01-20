import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Switch,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WebNavbar from '../../../components/WebNavbar';

// Course + teacher
const COURSE_TEACHER_MAP = {
  'Pemrograman Web': [
    'Alfiansyah Cahyo Wicaksono',
    'Eka Nur Aprilia',
  ],
  'Basis Data': [
    'Hesti Indriyani',
    'Muhamad Gilang Acchadipa Nazar',
  ],
  'Mobile Programming': [
    'Wandi Aditya',
    'Eka Avriliana',
  ],
  'Machine Learning': [
    'Rodstein Fing Beta Lucson',
    'Fasya Hasna Aidah',
  ],
};

// Data Dummy
const INITIAL_ACADEMIES = [
  {
    id: 1,
    course: 'Pemrograman Web',
    courseDescription: 'Belajar HTML, CSS, JavaScript, dan React',
    teacher: 'Alfiansyah Cahyo Wicaksono',
    startDate: '2026-01-01',
    endDate: '2030-01-01',
    status: true,
  },
  {
    id: 2,
    course: 'Mobile Programming',
    courseDescription: 'Belajar pengembangan aplikasi mobile menggunakan React Native dan Expo',
    teacher: 'Eka Avriliana',
    startDate: '2026-01-01',
    endDate: '2030-01-01',
    status: true,
  },
  {
    id: 3,
    course: 'Basis Data',
    courseDescription: 'Belajar konsep database, ERD, SQL, dan implementasi MySQL',
    teacher: 'Hesti Indriyani',
    startDate: '2026-01-01',
    endDate: '2030-01-01',
    status: true,
  },
  {
    id: 4,
    course: 'Machine Learning',
    courseDescription: 'Pengenalan machine learning, supervised & unsupervised learning, dan implementasi dasar',
    teacher: 'Rodstein Fing Beta Lucson',
    startDate: '2026-01-01',
    endDate: '2030-01-01',
    status: true,
  },
];

// Empty Form
const emptyForm = {
  course: '',
  courseDescription: '',
  teacher: '',
  startDate: '',
  endDate: '',
  status: false,
};

// Web Select
const WebSelect = ({ value, onChange, options }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)} style={styles.webInput}>
    <option value="">Please Select</option>
    {options.map((opt) => (
      <option key={opt} value={opt}>
        {opt}
      </option>
    ))}
  </select>
);

const ManageAcademyScreen = () => {
  const [academies, setAcademies] = useState(INITIAL_ACADEMIES);
  const [modalVisible, setModalVisible] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [form, setForm] = useState(emptyForm);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [teacherOptions, setTeacherOptions] = useState<string[]>([]);

  // Course + Teacher Auto
  useEffect(() => {
    if (form.course && COURSE_TEACHER_MAP[form.course]) {
      setTeacherOptions(COURSE_TEACHER_MAP[form.course]);
      setForm((prev) => ({ ...prev, teacher: '' }));
    } else {
      setTeacherOptions([]);
    }
  }, [form.course]);

  // Action 
  const openAdd = () => {
    setForm(emptyForm);
    setMode('add');
    setModalVisible(true);
  };

  const openEdit = (item) => {
    setForm(item);
    setSelectedId(item.id);
    setTeacherOptions(COURSE_TEACHER_MAP[item.course] || []);
    setMode('edit');
    setModalVisible(true);
  };

  const saveAcademy = () => {
    if (!form.course || !form.teacher || !form.startDate || !form.endDate) return;

    if (mode === 'add') {
      setAcademies([...academies, { ...form, id: Date.now() }]);
    }

    if (mode === 'edit') {
      setAcademies(
        academies.map((a) =>
          a.id === selectedId ? { ...form, id: selectedId } : a
        )
      );
    }

    setModalVisible(false);
  };

  const deleteAcademy = (id) => {
    if (Platform.OS === 'web' && !window.confirm('Yakin ingin menghapus academy ini?')) return;
    setAcademies((prev) => prev.filter((a) => a.id !== id));
  };

  /* Table */
  const renderItem = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{index + 1}</Text>
      <Text style={styles.cell}>{item.course}</Text>
      <Text style={styles.cell}>{item.teacher}</Text>
      <Text style={styles.cell}>{item.startDate}</Text>
      <Text style={styles.cell}>{item.endDate}</Text>

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
        <TouchableOpacity onPress={() => openEdit(item)} style={styles.btnYellow}>
          <Ionicons name="create" size={16} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteAcademy(item.id)} style={styles.btnRed}>
          <Ionicons name="trash" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <WebNavbar activeScreen="Manage Academy" />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Manage Academy</Text>
          <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.addText}>Add Academy</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHead}>
            <Text style={styles.th}>#</Text>
            <Text style={styles.th}>Course</Text>
            <Text style={styles.th}>Teacher</Text>
            <Text style={styles.th}>Start</Text>
            <Text style={styles.th}>End</Text>
            <Text style={styles.th}>Status</Text>
            <Text style={styles.th}>Action</Text>
          </View>

          <FlatList data={academies} renderItem={renderItem} />
        </View>
      </View>

      {/* Modal */}
      <Modal transparent visible={modalVisible}>
        <View style={styles.modalBg}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>
              {mode === 'add' ? 'Add Academy' : 'Edit Academy'}
            </Text>

            <View style={styles.formGrid}>
              <Field label="Course">
                <WebSelect
                  value={form.course}
                  onChange={(v) => setForm({ ...form, course: v })}
                  options={Object.keys(COURSE_TEACHER_MAP)}
                />
              </Field>

              <Field label="Teacher">
                <WebSelect
                  value={form.teacher}
                  onChange={(v) => setForm({ ...form, teacher: v })}
                  options={teacherOptions}
                />
              </Field>

              <Field full label="Course Description">
                <TextInput
                  value={form.courseDescription}
                  multiline
                  style={[styles.input, { height: 80 }]}
                  onChangeText={(v) =>
                    setForm({ ...form, courseDescription: v })
                  }
                />
              </Field>

              <Field label="Start Date">
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm({ ...form, startDate: e.target.value })
                  }
                  style={styles.webInput}
                />
              </Field>

              <Field label="End Date">
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) =>
                    setForm({ ...form, endDate: e.target.value })
                  }
                  style={styles.webInput}
                />
              </Field>

              <Field full label="Status">
                <View style={styles.switchRow}>
                  <Switch
                    value={form.status}
                    onValueChange={(v) => setForm({ ...form, status: v })}
                  />
                  <Text style={{ marginLeft: 8 }}>
                    {form.status ? 'Active' : 'Inactive'}
                  </Text>
                </View>
              </Field>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={saveAcademy}>
                <Text style={{ color: '#fff' }}>
                  {mode === 'add' ? 'Add' : 'Update'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Field
const Field = ({ label, children, full }) => (
  <View style={{ width: full ? '100%' : '48%' }}>
    <Text style={styles.label}>{label}</Text>
    {children}
  </View>
);

// Styles
const styles = StyleSheet.create({
  container: { 
      flex: 1, 
      backgroundColor: '#f9fafb',
  },
  content: { 
    padding: 20,
  },
  title: { 
    fontSize: 26, 
    fontWeight: 'bold', 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
  },
  addBtn: { 
    flexDirection: 'row', 
    backgroundColor: '#0b3c89', 
    padding: 10, 
    borderRadius: 8, 
  },
  addText: { 
    color: '#fff', 
    marginLeft: 6,
  },
  table: { 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    marginTop: 20,
  },
  tableHead: { 
    flexDirection: 'row', 
    backgroundColor: '#f3f4f6', 
    paddingVertical: 10, 
  },
  th: { 
    flex: 1, 
    textAlign: 'center', 
    fontWeight: '700',
    },
  row: { 
    flexDirection: 'row', 
    paddingVertical: 10,
  },
  cell: { 
    flex: 1, 
    textAlign: 'center', 
    alignItems: 'center',
  },
  statusBadge: { 
    minWidth: 80, 
    height: 26, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  statusText: { 
    color: '#fff', 
    fontSize: 12,
  },
  action: { 
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    gap: 6,
  },
  btnYellow: { 
    backgroundColor: '#facc15', 
    padding: 6, 
    borderRadius: 6,
  },
  btnRed: { 
    backgroundColor: '#ef4444', 
    padding: 6, 
    borderRadius: 6,
  },
  modalBg: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.4)', 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  modal: { 
    backgroundColor: '#fff', 
    width: 800, 
    padding: 20, 
    borderRadius: 12,
  },
  modalTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 12,
  },
  formGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 16,
  },
  label: { 
    fontSize: 12, 
    marginBottom: 4,
  },
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
    borderColor: '1px solid #e5e7eb',
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
  switchRow: { 
    flexDirection: 'row', 
    alignItems: 'center',
  },
});

export default ManageAcademyScreen;
