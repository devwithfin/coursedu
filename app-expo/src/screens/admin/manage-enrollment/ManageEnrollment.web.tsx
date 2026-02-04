import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import WebNavbar from '../../../components/WebNavbar';
import AcceptedCard from './AcceptedCard';

const API_URL = 'http://localhost:3000/enrollments';
const ITEMS_PER_PAGE = 10;

/* ================= SAFE GETTER ================= */
const getUserName = (item: any) => item?.user?.name || 'Unknown User';
const getUserEmail = (item: any) => item?.user?.email || '-';
const getCourseTitle = (item: any) => item?.course?.title || 'Unknown Course';

export default function ManageEnrollmentWeb() {
  const [activeTab, setActiveTab] = useState<'queue' | 'accepted'>('queue');
  const [queueData, setQueueData] = useState<any[]>([]);
  const [acceptedData, setAcceptedData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  /* ================= FETCH ================= */
  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();

      setQueueData(data.filter((e: any) => e.is_approved === 0));
      setAcceptedData(data.filter((e: any) => e.is_approved === 1));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleApprove = async (id: number) => {
    await fetch(`${API_URL}/${id}/approve`, { method: 'PUT' });
    await fetchEnrollments();
    setActiveTab('accepted');
    setCurrentPage(1);
  };

  /* ================= FILTER FUNCTION ================= */
  const filterData = (data: any[]) => {
    const keyword = searchText.toLowerCase().trim();

    return data.filter(item => {
      const name = getUserName(item).toLowerCase();
      const course = getCourseTitle(item).toLowerCase();

      const matchSearch =
        !keyword || name.includes(keyword) || course.includes(keyword);

      if (!item.enrolled_at) return false;

      const d = new Date(item.enrolled_at);
      const matchMonth =
        d.getMonth() === selectedMonth.getMonth() &&
        d.getFullYear() === selectedMonth.getFullYear();

      return matchSearch && matchMonth;
    });
  };

  const filteredQueue = filterData(queueData);
  const filteredAccepted = filterData(acceptedData);

  /* ================= PAGINATION ================= */
  const totalQueuePages = Math.ceil(filteredQueue.length / ITEMS_PER_PAGE);
  const totalAcceptedPages = Math.ceil(filteredAccepted.length / ITEMS_PER_PAGE);

  const paginatedQueue = filteredQueue.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const paginatedAccepted = filteredAccepted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /* ================= MONTH ================= */
  const changeMonth = (type: 'prev' | 'next') => {
    const d = new Date(selectedMonth);
    d.setMonth(type === 'prev' ? d.getMonth() - 1 : d.getMonth() + 1);
    setSelectedMonth(d);
    setCurrentPage(1);
  };

  const monthLabel = selectedMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <View style={styles.container}>
      <WebNavbar activeScreen="Manage Enrollment" />

      <View style={styles.content}>
        <Text style={styles.title}>Approval Member</Text>

        {/* ================= TOP BAR ================= */}
        <View style={styles.topBar}>
          <View style={styles.tabs}>
            <TouchableOpacity
              onPress={() => {
                setActiveTab('accepted');
                setCurrentPage(1);
              }}
            >
              <Text style={[styles.tab, activeTab === 'accepted' && styles.activeTab]}>
                Accepted
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setActiveTab('queue');
                setCurrentPage(1);
              }}
            >
              <Text style={[styles.tab, activeTab === 'queue' && styles.activeTab]}>
                In Queue
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filters}>
            <TextInput
              placeholder="Search Member"
              style={styles.search}
              value={searchText}
              onChangeText={t => {
                setSearchText(t);
                setCurrentPage(1);
              }}
            />

            <View style={styles.month}>
              <TouchableOpacity onPress={() => changeMonth('prev')}>
                <Text>{'<'}</Text>
              </TouchableOpacity>

              <Text style={{ marginHorizontal: 8 }}>{monthLabel}</Text>

              <TouchableOpacity onPress={() => changeMonth('next')}>
                <Text>{'>'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ================= QUEUE ================= */}
        {activeTab === 'queue' && (
          <>
            <View style={styles.tableHeader}>
              <View style={styles.colName}><Text style={styles.headerText}>Member Name</Text></View>
              <View style={styles.colDate}><Text style={styles.headerText}>Time Register</Text></View>
              <View style={styles.colStatus}><Text style={styles.headerText}>Status</Text></View>
              <View style={styles.colCourse}><Text style={styles.headerText}>Course Type</Text></View>
              <View style={styles.colAction}><Text style={styles.headerText}>Action</Text></View>
            </View>

            {paginatedQueue.map(item => (
              <View key={item.id} style={styles.row}>
                <View style={styles.colName}><Text>{getUserName(item)}</Text></View>
                <View style={styles.colDate}>
                  <Text>{new Date(item.enrolled_at).toLocaleDateString()}</Text>
                </View>

                <View style={styles.colStatus}>
                  <View style={styles.badgePending}>
                    <Text style={styles.badgeText}>Pending</Text>
                  </View>
                </View>

                <View style={styles.colCourse}>
                  <Text numberOfLines={2}>{getCourseTitle(item)}</Text>
                </View>

                <View style={styles.colAction}>
                  <TouchableOpacity
                    style={styles.approve}
                    onPress={() => handleApprove(item.id)}
                  >
                    <Text style={styles.approveText}>Approve</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {!loading && filteredQueue.length === 0 && (
              <Text style={{ textAlign: 'center', marginTop: 40 }}>
                No pending enrollments
              </Text>
            )}

            {totalQueuePages > 1 && (
              <View style={styles.pagination}>
                <TouchableOpacity
                  disabled={currentPage === 1}
                  onPress={() => setCurrentPage(p => p - 1)}
                >
                  <Text>{'<'}</Text>
                </TouchableOpacity>

                <Text>Page {currentPage} of {totalQueuePages}</Text>

                <TouchableOpacity
                  disabled={currentPage === totalQueuePages}
                  onPress={() => setCurrentPage(p => p + 1)}
                >
                  <Text>{'>'}</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        {/* ================= ACCEPTED ================= */}
        {activeTab === 'accepted' && (
          <>
            <View style={styles.cardGrid}>
              {paginatedAccepted.map(item => (
                <AcceptedCard
                  key={item.id}
                  data={{
                    id: item.id,
                    code: String(item.id).padStart(5, '0'),
                    name: getUserName(item),
                    date: new Date(item.enrolled_at).toLocaleDateString(),
                    email: getUserEmail(item),
                    course: getCourseTitle(item),
                    avatar: 'https://i.pravatar.cc/150',
                  }}
                />
              ))}
            </View>

            {!loading && filteredAccepted.length === 0 && (
              <Text style={{ textAlign: 'center', marginTop: 40 }}>
                No accepted members
              </Text>
            )}

            {totalAcceptedPages > 1 && (
              <View style={styles.pagination}>
                <TouchableOpacity
                  disabled={currentPage === 1}
                  onPress={() => setCurrentPage(p => p - 1)}
                >
                  <Text>{'<'}</Text>
                </TouchableOpacity>

                <Text>Page {currentPage} of {totalAcceptedPages}</Text>

                <TouchableOpacity
                  disabled={currentPage === totalAcceptedPages}
                  onPress={() => setCurrentPage(p => p + 1)}
                >
                  <Text>{'>'}</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 30 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center',
  },

  tabs: { flexDirection: 'row', gap: 20 },
  tab: { fontSize: 16, color: '#6b7280' },
  activeTab: {
    color: '#2563eb',
    fontWeight: '700',
    borderBottomWidth: 3,
    borderBottomColor: '#2563eb',
    paddingBottom: 6,
  },

  filters: { flexDirection: 'row', gap: 12 },
  search: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    width: 220,
  },

  month: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },

  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 10,
  },

  headerText: { fontSize: 13, fontWeight: '600', color: '#6b7280' },

  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },

  colName: { width: '18%' },
  colDate: { width: '14%' },
  colStatus: { width: '12%', alignItems: 'center' },
  colCourse: { width: '36%' },
  colAction: { width: '20%', alignItems: 'center' },

  badgePending: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: { fontSize: 12, fontWeight: '600', color: '#92400e' },

  approve: {
    borderWidth: 1,
    borderColor: '#22c55e',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  approveText: { color: '#22c55e', fontWeight: '600' },

  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 24,
  },
});