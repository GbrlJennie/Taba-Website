import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, BookOpen, Layers } from 'lucide-react';

export default function QuizSelection() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const courseName = courseId || 'Ejaan';

  // Data disamakan dengan mobile app
  const getCourseData = () => {
    if (courseName === 'Ejaan') {
      return {
        title: 'Ejaan',
        level: 'Beginner',
        colors: ['#FACC15', '#FB923C'],
        topics: [
          { name: 'Huruf Kapital', subtitle: 'Penggunaan Huruf Kapital', icon: '📄', bgColor: '#FFEDD5', textColor: '#EA580C' },
          { name: 'Penulisan Kata', subtitle: 'Kata Dasar & Berimbuhan', icon: '✏️', bgColor: '#FCE7F3', textColor: '#DB2777' },
          { name: 'Tanda Baca', subtitle: 'Titik, Koma, dll', icon: '📐', bgColor: '#DBEAFE', textColor: '#2563EB' },
          { name: 'Gabungan Kata', subtitle: 'Kata Majemuk', icon: '🔗', bgColor: '#DCFCE7', textColor: '#16A34A' },
          { name: 'Penulisan Angka', subtitle: 'Bilangan & Lambang', icon: '🔢', bgColor: '#F3E8FF', textColor: '#9333EA' },
          { name: 'Singkatan', subtitle: 'Akronim & Abbreviasi', icon: '📝', bgColor: '#E0E7FF', textColor: '#4F46E5' },
        ],
      };
    } else if (courseName === 'Tata Kata') {
      return {
        title: 'Tata Kata',
        level: 'Advanced',
        colors: ['#F472B6', '#EC4899'],
        topics: [
          { name: 'Pengantar Tata Kata', subtitle: 'Dasar Morfologi', icon: '📚', bgColor: '#FCE7F3', textColor: '#DB2777' },
          { name: 'Kata Benda', subtitle: 'Nomina', icon: '📦', bgColor: '#F3E8FF', textColor: '#9333EA' },
          { name: 'Kata Kerja', subtitle: 'Verba', icon: '⚡', bgColor: '#DBEAFE', textColor: '#2563EB' },
          { name: 'Kata Sifat', subtitle: 'Adjektiva', icon: '⭐', bgColor: '#FEF9C3', textColor: '#CA8A04' },
        ],
      };
    } else {
      return {
        title: 'Tata Kalimat',
        level: 'Intermediate',
        colors: ['#60A5FA', '#6366F1'],
        topics: [
          { name: 'Pengantar Kalimat', subtitle: 'Dasar Sintaksis', icon: '📖', bgColor: '#DBEAFE', textColor: '#2563EB' },
          { name: 'Pola Kalimat', subtitle: 'S-P-O-K', icon: '📝', bgColor: '#E0E7FF', textColor: '#4F46E5' },
          { name: 'Kalimat Aktif', subtitle: 'Transitif', icon: '➡️', bgColor: '#DCFCE7', textColor: '#16A34A' },
          { name: 'Kalimat Majemuk', subtitle: 'Setara & Bertingkat', icon: '🔀', bgColor: '#FCE7F3', textColor: '#DB2777' },
        ],
      };
    }
  };

  const courseData = getCourseData();

  const handleTopicClick = (topicName: string) => {
    // Kirim parameter via Query String
    navigate(`/dashboard/quiz/play?course=${encodeURIComponent(courseData.title)}&topic=${encodeURIComponent(topicName)}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Gradient */}
      <div 
        className="pb-24 pt-8 px-8 rounded-b-[40px] shadow-lg relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${courseData.colors[0]}, ${courseData.colors[1]})` }}
      >
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => navigate('/dashboard/quiz')} className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition">
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-white font-bold text-lg">Topik Kuis</h1>
            <button className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition">
              <BookOpen size={24} />
            </button>
          </div>

          <div className="mt-4">
            <h2 className="text-4xl font-extrabold text-white mb-2">{courseData.title}</h2>
            <span className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wider">
              {courseData.level}
            </span>
            
            <div className="flex items-center mt-6 text-white/80 text-sm">
              <Layers size={16} className="mr-2" />
              <span>{courseData.topics.length} Topik Tersedia</span>
            </div>
          </div>
        </div>

        {/* Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      </div>

      {/* Topics Grid */}
      <div className="max-w-5xl mx-auto px-8 -mt-16 relative z-20 pb-12">
        <h3 className="text-lg font-bold text-slate-800 mb-4 px-2">Silakan Pilih Topik</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courseData.topics.map((topic, index) => (
            <div
              key={index}
              onClick={() => handleTopicClick(topic.name)}
              className="bg-white p-6 rounded-3xl shadow-md hover:shadow-xl transition-all cursor-pointer border border-slate-100 group hover:-translate-y-1"
            >
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4 transition-transform group-hover:scale-110"
                style={{ backgroundColor: topic.bgColor }}
              >
                {topic.icon}
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-1">{topic.name}</h4>
              <p className="text-sm text-slate-500">{topic.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}