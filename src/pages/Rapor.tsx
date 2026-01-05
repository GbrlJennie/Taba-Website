import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Trophy, Calendar, Clock, BarChart3, Trash2 } from 'lucide-react';
import { useQuizHistory } from '../hooks/useQuizHistory';

export default function Rapor() {
  const navigate = useNavigate();
  const { quizHistory, loading, refreshHistory } = useQuizHistory();

  const totalQuizzes = quizHistory.length;
  const averageScore = totalQuizzes > 0 
    ? Math.round(quizHistory.reduce((acc, curr) => acc + curr.score, 0) / totalQuizzes) 
    : 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleResetHistory = async () => {
    if (window.confirm('Yakin ingin menghapus semua riwayat kuis?')) {
      // Implementasi delete nanti jika diperlukan
      alert('Fitur reset akan ditambahkan');
    }
  };

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
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-200 rounded-full transition">
            <ChevronLeft className="w-6 h-6 text-slate-700" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Rapor Belajar</h1>
        </div>
        <button 
          onClick={handleResetHistory}
          className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg flex items-center gap-2 transition text-sm font-medium"
        >
          <Trash2 size={16} /> Reset History
        </button>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-blue-100 p-4 rounded-full text-blue-600">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm">Rata-rata Nilai</p>
            <p className="text-2xl font-bold text-slate-900">{averageScore}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-purple-100 p-4 rounded-full text-purple-600">
            <BarChart3 size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm">Kuis Diselesaikan</p>
            <p className="text-2xl font-bold text-slate-900">{totalQuizzes}</p>
          </div>
        </div>
      </div>

      {/* History List */}
      <h3 className="text-lg font-bold text-slate-800 mb-4">Riwayat Aktivitas</h3>
      
      <div className="flex flex-col gap-4">
        {quizHistory.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
            <Trophy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Belum Ada Riwayat</h3>
            <p className="text-slate-500 mb-4">Kamu belum menyelesaikan kuis apapun.</p>
            <button 
              onClick={() => navigate('/dashboard/quiz')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition"
            >
              Mulai Kuis Sekarang
            </button>
          </div>
        ) : (
          quizHistory.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
              
              {/* Left Side: Info */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className={`w-2 h-16 rounded-full ${getScoreColor(item.score)}`} />
                <div>
                  <h4 className="font-bold text-lg text-slate-800">{item.course}</h4>
                  <p className="text-sm text-slate-500 mb-1">{item.topic}</p>
                  <div className="flex gap-4 text-slate-500 text-xs">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(item.completed_at).toLocaleDateString('id-ID')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(item.completed_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side: Score */}
              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                <div className="text-center">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Benar</p>
                  <p className="text-sm font-bold text-slate-700">{item.correct_answers}/{item.total_questions}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Nilai</p>
                  <div className={`px-4 py-1 rounded-full text-white font-bold text-lg min-w-[80px] text-center ${getScoreColor(item.score)}`}>
                    {item.score}
                  </div>
                </div>
                <button 
                  onClick={() => navigate(`/dashboard/quiz/result?historyId=${item.id}`)}
                  className="text-indigo-600 hover:bg-indigo-50 px-3 py-1 rounded-lg text-sm font-medium transition"
                >
                  Lihat Detail
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}