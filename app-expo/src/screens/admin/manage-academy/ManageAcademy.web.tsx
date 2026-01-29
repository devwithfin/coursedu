import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Switch,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WebNavbar from '../../../components/WebNavbar';
import { getAllCourses } from '../../../api/course';
import axios from 'axios';

/* ================= DEFAULT FORM ================= */
const emptyForm = {
  title: '',
  description: '',
  teacher_id: '',
  status: 'inactive',
};

/* ================= MAIN ================= */
const ManageAcademyScreen = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit' | 'view'>('view');
  const [form, setForm] = useState<any>(emptyForm);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [search, setSearch] = useState('');

  const readOnly = mode === 'view';

  /* ================= FETCH ================= */
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await getAllCourses();
      setCourses(data);
    } catch (err: any) {
      alert('Failed fetch course: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  /* ================= SEARCH FILTER ================= */
  const filteredCourses = courses.filter((item: any) => {
    const keyword = search.toLowerCase();

    const courseTitle = item.title?.toLowerCase() || '';
    const teacherName =
      item.teacher?.name?.toLowerCase() ||
      String(item.teacher_id || '').toLowerCase();

    return (
      courseTitle.includes(keyword) ||
      teacherName.includes(keyword)
    );
  });

  /* ================= ACTION ================= */
  const openAdd = () => {
    setForm(emptyForm);
    setMode('add');
    setModalVisible(true);
  };

  const openView = (item: any) => {
    setForm(item);
    setMode('view');
    setModalVisible(true);
  };

  const openEdit = (item: any) => {
    setForm(item);
    setSelectedId(item.id);
    setMode('edit');
    setModalVisible(true);
  };

  const saveCourse = async () => {
    if (!form.title || !form.teacher_id) {
      alert('Title & Teacher are required');
      return;
    }

    try {
      if (mode === 'add') {
        await axios.post('http://localhost:3000/courses', form);
      } else if (mode === 'edit' && selectedId) {
        await axios.put(`http://localhost:3000/courses/${selectedId}`, form);
      }
      setModalVisible(false);
      fetchCourses();
    } catch (err: any) {
      alert('Save failed: ' + err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (Platform.OS === 'web') {
      if (!window.confirm('Delete this course?')) return;
    }
    try {
      await axios.delete(`http://localhost:3000/courses/${id}`);
      fetchCourses();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  /* ================= TABLE ROW ================= */
  const renderItem = ({ item, index }: any) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{index + 1}</Text>
      <Text style={styles.cell}>{item.title}</Text>
      <Text style={styles.cell}>
        {item.teacher?.name || item.teacher_id}
      </Text>

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
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.btnRed}>
          <Ionicons name="trash" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  /* ================= UI ================= */
  return (
    <View style={styles.container}>
      <WebNavbar activeScreen="Manage Academy" />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Manage Academy</Text>
          <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.addText}>Add Course</Text>
          </TouchableOpacity>
        </View>

        {/* SEARCH */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#6b7280" />
          <TextInput
            placeholder="Search course or teacher..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        <View style={styles.table}>
          <View style={styles.tableHead}>
            <Text style={styles.th}>#</Text>
            <Text style={styles.th}>Course</Text>
            <Text style={styles.th}>Teacher</Text>
            <Text style={styles.th}>Status</Text>
            <Text style={styles.th}>Action</Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" style={{ margin: 20 }} />
          ) : (
            <FlatList
              data={filteredCourses}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              style={{ maxHeight: 520 }}
            />
          )}
        </View>
      </View>

      {/* ================= MODAL ================= */}
      <Modal transparent visible={modalVisible}>
        <View style={styles.modalBg}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Course Information</Text>

            <View style={styles.formItem}>
              <Text style={styles.label}>Course Title</Text>
              <TextInput
                style={styles.input}
                editable={!readOnly}
                value={form.title}
                onChangeText={(v) => setForm({ ...form, title: v })}
              />
            </View>

            <View style={styles.formItem}>
              <Text style={styles.label}>Teacher ID</Text>
              <TextInput
                style={styles.input}
                editable={!readOnly}
                value={String(form.teacher_id)}
                onChangeText={(v) => setForm({ ...form, teacher_id: v })}
              />
            </View>

            <View style={styles.formItem}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, { height: 80 }]}
                multiline
                editable={!readOnly}
                value={form.description}
                onChangeText={(v) =>
                  setForm({ ...form, description: v })
                }
              />
            </View>

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
                <TouchableOpacity style={styles.saveBtn} onPress={saveCourse}>
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

/* ================= STYLES ================= */
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

export default ManageAcademyScreen;
