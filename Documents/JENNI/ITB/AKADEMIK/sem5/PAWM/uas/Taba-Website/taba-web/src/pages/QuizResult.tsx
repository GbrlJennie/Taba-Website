import { useSearchParams, useNavigate } from 'react-router-dom';
import { Trophy, Star, RotateCcw, Home, BookOpen } from 'lucide-react';

export default function QuizResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const score = parseInt(searchParams.get('score') || '0');
  const topic = searchParams.get('topic') || 'Kuis';
  const course = searchParams.get('course') || '';
  
  // Logic grade sederhana
  const getGrade = (s: number) => {
    if (s >= 90) return { grade: 'A', msg: 'Luar Biasa!', color: 'text-green-500', bg: 'bg-green-50' };
    if (s >= 80) return { grade: 'B', msg: 'Kerja Bagus!', color: 'text-blue-500', bg: 'bg-blue-50' };
    if (s >= 70) return { grade: 'C', msg: 'Cukup Baik', color: 'text-yellow-500', bg: 'bg-yellow-50' };
    return { grade: 'D', msg: 'Belajar Lagi Ya!', color: 'text-red-500', bg: 'bg-red-50' };
  };

  const result = getGrade(score);
  const stars = Math.ceil(score / 33.33); // 1-3 stars

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        
        {/* Trophy Section */}
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-yellow-200 blur-2xl opacity-50 rounded-full animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-yellow-100 to-amber-100 p-8 rounded-full shadow-inner">
            <Trophy className="w-20 h-20 text-yellow-500 drop-shadow-md" />
          </div>
        </div>

        {/* Stars */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <Star 
              key={s} 
              className={`w-8 h-8 ${s <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} 
            />
          ))}
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{result.msg}</h1>
        <p className="text-slate-500 mb-8">Kuis {topic} Selesai</p>

        {/* Score Card */}
        <div className={`p-8 rounded-3xl mb-8 ${result.bg} border-2 border-dashed border-opacity-50 border-slate-300`}>
          <p className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">Nilai Akhir</p>
          <div className={`text-6xl font-black ${result.color} mb-2`}>{score}</div>
          <div className="inline-block px-4 py-1 bg-white rounded-full shadow-sm text-sm font-bold text-slate-600">
            Grade {result.grade}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button 
            onClick={() => navigate(`/dashboard/quiz/selection/${course}`)}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition flex items-center justify-center gap-2"
          >
            <RotateCcw size={20} />
            Ulangi Kuis
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => navigate('/dashboard/course')}
              className="bg-slate-100 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-200 transition flex items-center justify-center gap-2"
            >
              <BookOpen size={18} />
              Materi
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-slate-100 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-200 transition flex items-center justify-center gap-2"
            >
              <Home size={18} />
              Beranda
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}