import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCourseProgress } from '../hooks/useCourseProgress';

export default function Course() {
  const navigate = useNavigate();
  useAuth();
  const { courseProgress, loading } = useCourseProgress();

  const courses = [
    {
      id: 'ejaan',
      title: 'Ejaan',
      level: 'Beginner',
      colors: ['#FACC15', '#FB923C'],
      icon: '✏️',
      description: 'Pelajari aturan ejaan bahasa Indonesia yang baik dan benar sesuai PUEBI.',
    },
    {
      id: 'tata-kata',
      title: 'Tata Kata',
      level: 'Advanced',
      colors: ['#F472B6', '#EC4899'],
      icon: '📝',
      description: 'Memahami jenis-jenis kata, proses imbuhan, dan pembentukan kata dasar.',
    },
    {
      id: 'tata-kalimat',
      title: 'Tata Kalimat',
      level: 'Intermediate',
      colors: ['#60A5FA', '#6366F1'],
      icon: '📖',
      description: 'Struktur kalimat efektif, SPOK, dan variasi kalimat dalam paragraf.',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-200 rounded-full transition">
           <ChevronLeft className="w-6 h-6 text-slate-700" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Materi Pembelajaran</h1>
      </div>

      {/* Course List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => {
          // Ambil progress dari hook (default 0 jika belum ada)
          const progress = courseProgress[course.id] || 0;

          return (
            <div 
              key={course.id}
              onClick={() => navigate(`/dashboard/course/${course.id}`)}
              className="group relative overflow-hidden rounded-3xl shadow-lg cursor-pointer transition-transform hover:-translate-y-1"
              style={{
                background: `linear-gradient(135deg, ${course.colors[0]}, ${course.colors[1]})`
              }}
            >
              <div className="p-6 relative z-10 text-white h-full flex flex-col min-h-[240px]">
                {/* Header Card */}
                <div className="flex items-start mb-4">
                  <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl mr-4 text-3xl">
                    {course.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{course.title}</h2>
                    <span className="inline-block mt-1 bg-white/20 px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wide">
                      {course.level}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-white/90 text-sm leading-relaxed mb-6 flex-grow">
                  {course.description}
                </p>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-white h-full rounded-full transition-all duration-500" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-right text-xs font-bold opacity-90">
                    {Math.round(progress)}% Selesai
                  </p>
                </div>
              </div>

              {/* Dekorasi Background */}
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            </div>
          );
        })}
      </div>
    </div>
  );
}