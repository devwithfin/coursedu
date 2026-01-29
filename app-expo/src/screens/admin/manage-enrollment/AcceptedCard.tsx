import { View, Text, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { useState } from 'react';

type AcceptedCardProps = {
  data: {
    id: number;
    code: string;
    name: string;
    date: string;
    email: string;
    course: string;
    avatar: string;
  };
};

export default function AcceptedCard({ data }: AcceptedCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ================= CARD ================= */}
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.id}># {data.code}</Text>
          <Text style={styles.badge}>Accepted</Text>
        </View>

        <View style={styles.profile}>
          <Image source={{ uri: data.avatar }} style={styles.avatar} />
          <View>
            <Text style={styles.label}>Full Name</Text>
            <Text style={styles.value}>{data.name}</Text>
          </View>

          <View style={{ marginLeft: 'auto' }}>
            <Text style={styles.label}>Date of Register</Text>
            <Text style={styles.value}>{data.date}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View>
            <Text style={styles.label}>E-Mail</Text>
            <Text style={styles.value}>{data.email}</Text>
          </View>
        </View>

        <View style={styles.course}>
          <Text style={styles.label}>Free Course</Text>
          <Text style={styles.courseText}>{data.course}</Text>
        </View>

        <TouchableOpacity style={styles.viewBtn} onPress={() => setOpen(true)}>
          <Text style={styles.viewText}>View</Text>
        </TouchableOpacity>
      </View>

      {/* ================= MODAL ================= */}
      <Modal visible={open} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Member Detail</Text>

            <Image source={{ uri: data.avatar }} style={styles.modalAvatar} />

            <Text style={styles.modalItem}><Text style={styles.bold}>Name:</Text> {data.name}</Text>
            <Text style={styles.modalItem}><Text style={styles.bold}>Email:</Text> {data.email}</Text>
            <Text style={styles.modalItem}><Text style={styles.bold}>Course:</Text> {data.course}</Text>
            <Text style={styles.modalItem}><Text style={styles.bold}>Register Date:</Text> {data.date}</Text>
            <Text style={styles.modalItem}><Text style={styles.bold}>Member Code:</Text> #{data.code}</Text>

            <TouchableOpacity style={styles.closeBtn} onPress={() => setOpen(false)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    width: '32%',
    minWidth: 320,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  id: { fontWeight: 'bold' },

  badge: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    fontWeight: '600',
  },

  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  label: {
    fontSize: 12,
    color: '#6b7280',
  },
  value: {
    fontWeight: '600',
  },

  course: {
    marginBottom: 20,
  },
  courseText: {
    fontWeight: '600',
    marginTop: 4,
  },

  viewBtn: {
    borderWidth: 1,
    borderColor: '#22c55e',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  viewText: {
    color: '#22c55e',
    fontWeight: '600',
  },

  /* ========== MODAL ========== */
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modal: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    width: 380,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },

  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: 16,
  },

  modalItem: {
    marginBottom: 8,
  },

  bold: {
    fontWeight: '700',
  },

  closeBtn: {
    marginTop: 20,
    backgroundColor: '#22c55e',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  closeText: {
    color: '#fff',
    fontWeight: '600',
  },
});
