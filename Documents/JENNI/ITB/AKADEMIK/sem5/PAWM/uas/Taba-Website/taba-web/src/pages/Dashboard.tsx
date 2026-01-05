import { useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, Trophy, Award, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCourseProgress } from '../hooks/useCourseProgress';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { courseProgress, loading } = useCourseProgress();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      {/* HEADER & WELCOME */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-slate-500 text-sm font-medium mb-1">Selamat Datang Kembali 👋</p>
          <h1 className="text-3xl font-bold text-slate-900">
            {user?.email?.split('@')[0] || 'Student'}
          </h1>
        </div>
        <button 
          onClick={handleLogout}
          className="p-3 bg-red-50 hover:bg-red-100 rounded-full transition-colors"
          title="Logout"
        >
          <LogOut className="text-red-500 w-6 h-6" />
        </button>
      </div>

      {/* DAILY CHALLENGE CARD */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-500 to-fuchsia-500 p-8 mb-8 shadow-lg text-white">
        <div className="relative z-10">
          <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full w-fit mb-4">
            <span className="text-xs font-bold uppercase tracking-wider">Tantangan Harian</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Kuasai 5 Kata Baku</h2>
          <p className="text-violet-100 mb-6 max-w-lg">
            Selesaikan kuis singkat tentang kata baku vs tidak baku untuk menjaga streak harianmu!
          </p>
          <button 
            onClick={() => navigate('/dashboard/quiz')}
            className="bg-white text-violet-600 px-6 py-3 rounded-full font-bold shadow-md hover:bg-violet-50 transition-transform active:scale-95"
          >
            Mulai Sekarang
          </button>
        </div>
        
        <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute top-10 right-20 w-32 h-32 bg-fuchsia-400/20 rounded-full blur-xl" />
      </div>

      {/* PROGRESS SECTION */}
      <h3 className="text-xl font-bold text-slate-900 mb-6">Lanjutkan Belajar</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CourseProgressCard 
          title="Ejaan" 
          progress={(courseProgress['ejaan'] || 0) / 100}
          icon={<BookOpen className="w-6 h-6 text-blue-600" />}
          color="bg-blue-100"
          onClick={() => navigate('/dashboard/course')}
        />
        <CourseProgressCard 
          title="Tata Kata" 
          progress={(courseProgress['tata-kata'] || 0) / 100}
          icon={<Activity className="w-6 h-6 text-emerald-600" />}
          color="bg-emerald-100"
          onClick={() => navigate('/dashboard/course')}
        />
        <CourseProgressCard 
          title="Tata Kalimat" 
          progress={(courseProgress['tata-kalimat'] || 0) / 100}
          icon={<Award className="w-6 h-6 text-purple-600" />}
          color="bg-purple-100"
          onClick={() => navigate('/dashboard/course')}
        />
      </div>
    </div>
  );
}

function CourseProgressCard({ title, progress, icon, color, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-40"
    >
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>
        <span className="text-slate-400 font-bold text-xs bg-slate-50 px-2 py-1 rounded-md">
          PROGRESS
        </span>
      </div>
      
      <div>
        <h4 className="font-bold text-lg text-slate-800 mb-2">{title}</h4>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-2 text-right font-medium">
          {Math.round(progress * 100)}%
        </p>
      </div>
    </div>
  );
}