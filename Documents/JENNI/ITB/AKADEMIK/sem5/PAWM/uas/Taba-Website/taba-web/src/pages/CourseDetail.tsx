import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MoreVertical, CheckCircle, BookOpen } from 'lucide-react';
import { useCourseProgress } from '../hooks/useCourseProgress';

interface CourseSection {
  title: string;
  content: string;
}

interface CourseData {
  title: string;
  colors: [string, string];
  sections: CourseSection[];
}

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { courseProgress, updateProgress, loading } = useCourseProgress();
  
  const [isCompleted, setIsCompleted] = useState(false);
  const [updating, setUpdating] = useState(false);

  const courseName = id || 'ejaan';
  const currentProgress = courseProgress ? (courseProgress[courseName] || 0) : 0;

  useEffect(() => {
    if (currentProgress >= 100) {
      setIsCompleted(true);
    }
  }, [currentProgress]);

  const getCourseData = (): CourseData => {
    switch (courseName) {
      case 'ejaan':
        return {
          title: 'Ejaan',
          colors: ['#FACC15', '#FB923C'],
          sections: [
            {
              title: 'Penggunaan Huruf Kapital',
              content: 'Huruf kapital digunakan pada awal kalimat, nama orang, nama tempat, dan nama organisasi.\n\nContoh:\n• Saya tinggal di Jakarta.\n• Budi adalah teman saya.\n• Dia bekerja di Universitas Indonesia.\n\nHuruf kapital juga digunakan untuk:\n1. Nama hari, bulan, dan hari besar\n2. Nama geografi\n3. Nama lembaga/organisasi',
            },
            {
              title: 'Penulisan Kata',
              content: 'Kata dasar ditulis terpisah dari imbuhan. Penulisan kata depan "di", "ke", "dari" ditulis terpisah dari kata yang mengikutinya.\n\nContoh:\n• di rumah, ke sekolah, dari pasar\n\nSedangkan "di-" sebagai awalan kata kerja pasif ditulis serangkai.\n\nContoh:\n• dibaca, ditulis, dikerjakan',
            },
            {
              title: 'Penggunaan Tanda Baca',
              content: 'Titik (.): mengakhiri kalimat berita\nKoma (,): memisahkan unsur dalam kalimat\nTanda tanya (?): mengakhiri kalimat tanya\nTanda seru (!): mengakhiri kalimat perintah\nTanda petik ("..."): mengapit kutipan langsung',
            },
          ],
        };

      case 'tata-kata':
        return {
          title: 'Tata Kata',
          colors: ['#F472B6', '#EC4899'],
          sections: [
            {
              title: 'Pengantar Tata Kata',
              content: 'Tata kata atau morfologi membahas pembentukan kata. Kata dapat dibedakan berdasarkan bentuknya (dasar, berimbuhan, ulang, majemuk) dan jenisnya (kata benda, kerja, sifat, dll).',
            },
            {
              title: 'Jenis-jenis Kata',
              content: 'a. Kata Benda (Nomina): buku, rumah, Jakarta.\nb. Kata Kerja (Verba): membaca, menulis, berjalan.\nc. Kata Sifat (Adjektiva): cepat, tinggi, cantik.\nd. Kata Bilangan (Numeralia): satu, kedua, banyak.\ne. Kata Ganti (Pronomina): saya, kamu, mereka.',
            },
            {
              title: 'Proses Pembentukan Kata',
              content: '1. Afiksasi (pengimbuhan): baca → membaca\n2. Reduplikasi (pengulangan): rumah → rumah-rumah\n3. Komposisi (pemajemukan): mata hari, rumah sakit',
            },
          ],
        };

      case 'tata-kalimat':
        return {
          title: 'Tata Kalimat',
          colors: ['#60A5FA', '#6366F1'],
          sections: [
            {
              title: 'Pengantar Kalimat',
              content: 'Kalimat adalah satuan bahasa terkecil yang mengungkapkan pikiran yang utuh. Terdiri dari Subjek (S), Predikat (P), Objek (O), dan Keterangan (K).',
            },
            {
              title: 'Pola Kalimat',
              content: '1. S - P: Andi tidur.\n2. S - P - O: Andi membaca buku.\n3. S - P - K: Andi tidur di kamar.\n4. S - P - O - K: Andi membaca buku di perpustakaan.',
            },
            {
              title: 'Jenis-jenis Kalimat',
              content: '1. Kalimat Berita: Menyampaikan informasi (akhir titik).\n2. Kalimat Tanya: Menanyakan sesuatu (akhir tanda tanya).\n3. Kalimat Perintah: Memberikan perintah (akhir tanda seru).\n4. Kalimat Seru: Ungkapan perasaan kuat.',
            },
          ],
        };

      default:
        return {
          title: 'Materi Tidak Ditemukan',
          colors: ['#94A3B8', '#64748B'],
          sections: [{ title: 'Error', content: `Materi untuk ID "${courseName}" tidak ditemukan.` }],
        };
    }
  };

  const courseData = getCourseData();

  const handleCompleteReading = async () => {
    if (isCompleted || updating) return;
    
    setUpdating(true);
    try {
      await updateProgress(courseName, 100);
      setIsCompleted(true);
      
      setTimeout(() => {
        if (window.confirm('Materi Selesai! 🎉\n\nLanjut kerjakan Quiz?')) {
          navigate('/dashboard/quiz');
        }
      }, 100);
      
    } catch (error) {
      console.error('Error updating progress:', error);
      alert('Gagal menyimpan progress. Cek koneksi internet.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div 
        className="rounded-b-[32px] pb-8 pt-6 px-6 shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${courseData.colors[0]}, ${courseData.colors[1]})`
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate('/dashboard/course')}
            className="p-2 hover:bg-white/20 rounded-full transition"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <span className="text-white text-lg font-medium">Materi</span>
          <button className="p-2 hover:bg-white/20 rounded-full transition">
            <MoreVertical className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold text-white">{courseData.title}</h1>
          {isCompleted && <CheckCircle className="w-8 h-8 text-white" />}
        </div>

        {currentProgress > 0 && (
          <div className="mt-4">
            <div className="bg-white/30 backdrop-blur-sm rounded-full h-2 overflow-hidden mb-2">
              <div 
                className="bg-white h-full rounded-full transition-all duration-500"
                style={{ width: `${currentProgress}%` }}
              />
            </div>
            <p className="text-white text-sm font-semibold">{Math.round(currentProgress)}% selesai</p>
          </div>
        )}
      </div>

      {/* Content Sections */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {courseData.sections.map((section, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-4">{section.title}</h2>
            <p className="text-slate-700 leading-relaxed whitespace-pre-line">{section.content}</p>
          </div>
        ))}

        {/* Action Card */}
        <div 
          className={`rounded-2xl p-6 border-l-4 transition-colors ${
            isCompleted ? 'bg-green-50 border-green-500' : 'bg-blue-50 border-blue-500'
          }`}
        >
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              {isCompleted ? (
                <CheckCircle className="w-7 h-7 text-green-600" />
              ) : (
                <BookOpen className="w-7 h-7 text-blue-600" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {isCompleted ? 'Selamat! 🎉' : 'Sudah Selesai Membaca?'}
              </h3>
              <p className="text-slate-600 mb-4">
                {isCompleted 
                  ? 'Kamu sudah menguasai materi ini. Siap untuk tantangan berikutnya?'
                  : 'Klik tombol di bawah jika kamu sudah selesai membaca dan memahami materi ini.'}
              </p>

              {!isCompleted ? (
                <button
                  onClick={handleCompleteReading}
                  disabled={updating}
                  className="w-full py-3 rounded-xl text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-70 disabled:hover:scale-100"
                  style={{
                    background: `linear-gradient(135deg, ${courseData.colors[0]}, ${courseData.colors[1]})`
                  }}
                >
                  {updating ? 'Menyimpan...' : 'Tandai Selesai'}
                </button>
              ) : (
                <button
                  onClick={() => navigate('/dashboard/quiz')}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 py-3 rounded-xl text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                  Lanjut ke Kuis ➜
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}