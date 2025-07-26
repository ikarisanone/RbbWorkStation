export const demoData = {
  projects: [
    { id: 'proj_1', name: 'Proje Kalkanı Geliştirme', description: 'Yeni nesil proje yönetim aracının geliştirilmesi.', owner: 'user_1', team: ['user_1', 'user_2', 'user_3'], status: 'Devam Ediyor', deadline: '2025-09-30', progress: 75, created_at: '2025-07-01T10:00:00Z' },
    { id: 'proj_2', name: 'Mobil Uygulama Arayüzü', description: 'iOS ve Android için kullanıcı arayüzü tasarımı.', owner: 'user_2', team: ['user_2', 'user_4'], status: 'Planlanıyor', deadline: '2025-10-15', progress: 15, created_at: '2025-07-10T12:30:00Z' },
    { id: 'proj_3', name: 'Pazarlama Kampanyası', description: 'Yeni ürün lansmanı için dijital pazarlama stratejisi.', owner: 'user_1', team: ['user_1', 'user_4'], status: 'Tamamlandı', deadline: '2025-07-20', progress: 100, created_at: '2025-06-15T09:00:00Z' },
  ],
  tasks: [
    { id: 'task_1', projectId: 'proj_1', title: 'Giriş Sayfası Tasarımı', description: 'Kullanıcı giriş ve kayıt akışlarını tasarla.', assignee: 'user_2', status: 'Yapılıyor', priority: 'Yüksek', due_date: '2025-07-28', created_at: '2025-07-20T14:00:00Z', comments: [] },
    { id: 'task_2', projectId: 'proj_1', title: 'Veritabanı Şeması Oluşturma', description: 'Tüm uygulama verileri için PostgreSQL şemasını oluştur.', assignee: 'user_3', status: 'Yapılacak', priority: 'Yüksek', due_date: '2025-08-05', created_at: '2025-07-21T11:00:00Z', comments: [] },
    { id: 'task_3', projectId: 'proj_2', title: 'Renk Paleti Seçimi', description: 'Uygulamanın marka kimliğine uygun renkleri belirle.', assignee: 'user_4', status: 'Tamamlandı', priority: 'Orta', due_date: '2025-07-25', created_at: '2025-07-22T09:30:00Z', comments: [] },
    { id: 'task_4', projectId: 'proj_1', title: 'API Uç Noktalarını Geliştir', description: 'Görev yönetimi için CRUD operasyonlarını ekle.', assignee: 'user_3', status: 'Yapılacak', priority: 'Yüksek', due_date: '2025-08-10', created_at: '2025-07-24T16:00:00Z', comments: [] },
  ],
  users: [
    { id: 'user_1', name: 'Süper Admin', email: 'superadmin@example.com', password: 'password123', avatar: '/avatars/01.png', role_id: 'role_1', status: 'active', created_at: '2025-01-01T00:00:00Z' },
    { id: 'user_2', name: 'Yönetici', email: 'yonetici@example.com', password: 'password123', avatar: '/avatars/02.png', role_id: 'role_2', status: 'active', created_at: '2025-01-02T10:00:00Z' },
    { id: 'user_3', name: 'Ekip Üyesi', email: 'uye1@example.com', password: 'password123', avatar: '/avatars/03.png', role_id: 'role_3', status: 'active', created_at: '2025-01-03T11:00:00Z' },
    { id: 'user_4', name: 'Fatma Yılmaz', email: 'fatma.yilmaz@example.com', password: 'password123', avatar: '/avatars/04.png', role_id: 'role_3', status: 'pending', created_at: '2025-01-04T12:00:00Z' },
    { id: 'user_5', name: 'Misafir', email: 'misafir@example.com', password: 'password123', avatar: '/avatars/05.png', role_id: 'role_4', status: 'inactive', created_at: '2025-01-05T13:00:00Z' },
  ],
  roles: [
    { id: 'role_1', name: 'Süper Admin', description: 'Tüm sistem yetkilerine sahip.', permissions: ['all'] },
    { id: 'role_2', name: 'Yönetici', description: 'Proje ve kullanıcı yönetimi.', permissions: ['manage_projects', 'manage_users', 'view_dashboard'] },
    { id: 'role_3', name: 'Ekip Üyesi', description: 'Atanan görevleri yönetir.', permissions: ['view_projects', 'manage_tasks'] },
    { id: 'role_4', name: 'Misafir', description: 'Sadece görüntüleme yetkisine sahip.', permissions: ['view_dashboard'] },
  ],
  auditLogs: [
    { id: 'log_1', user_id: 'user_1', action: 'Kullanıcı oluşturdu', details: 'ayse.kaya@example.com kullanıcısı oluşturuldu.', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
    { id: 'log_2', user_id: 'user_2', action: 'Görev güncelledi', details: '\'Giriş Sayfası Tasarımı\' görevinin durumu \'Yapılıyor\' olarak değiştirildi.', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  ],
  notifications: [
    { id: 'notif_1', user_id: 'user_1', message: 'Yeni bir görev atandı: API Uç Noktalarını Geliştir', isRead: false, timestamp: new Date().toISOString() },
  ],
  appSettings: {
    theme: 'dark',
    language: 'tr',
    notifications: {
      email: true,
      push: false,
    },
  },
};