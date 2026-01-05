import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function Quiz() {
  const navigate = useNavigate();

  const quizzes = [
    {
      id: 'Ejaan', // Gunakan Capital Case sesuai data di mobile agar match
      name: 'Ejaan',
      level: 'Beginner',
      colors: ['#FACC15', '#FB923C'],
      icon: '✏️',
      desc: 'Uji pemahaman ejaan baku sesuai PUEBI.'
    },
    {
      id: 'Tata Kata',
      name: 'Tata Kata',
      level: 'Advanced',
      colors: ['#F472B6', '#EC4899'],
      icon: '📝',
      desc: 'Kuis morfologi, imbuhan, dan jenis kata.'
    },
    {
      id: 'Tata Kalimat',
      name: 'Tata Kalimat',
      level: 'Intermediate',
      colors: ['#60A5FA', '#6366F1'],
      icon: '📖',
      desc: 'Susun kalimat efektif dan struktur SPOK.'
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-200 rounded-full transition">
           <ChevronLeft className="w-6 h-6 text-slate-700" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Pilih Kuis</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz, index) => (
          <div 
            key={index}
            // Arahkan ke halaman selection dengan parameter courseId
            onClick={() => navigate(`/dashboard/quiz/selection/${quiz.id}`)} 
            className="group relative overflow-hidden rounded-3xl shadow-lg cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1"
            style={{
              background: `linear-gradient(135deg, ${quiz.colors[0]}, ${quiz.colors[1]})`
            }}
          >
            <div className="p-8 text-white flex flex-col items-center text-center relative z-10">
              <div className="text-5xl mb-4 drop-shadow-md transform transition group-hover:scale-110 duration-300">
                {quiz.icon}
              </div>
              <h2 className="text-2xl font-bold mb-1">{quiz.name}</h2>
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase mb-4 backdrop-blur-sm">
                {quiz.level}
              </span>
              <p className="text-white/90 text-sm leading-relaxed">
                {quiz.desc}
              </p>
              
              <div className="mt-6 w-full">
                <button className="w-full bg-white text-slate-900 font-bold py-3 rounded-xl shadow hover:bg-slate-50 transition">
                  Lihat Topik
                </button>
              </div>
            </div>
            
            {/* Dekorasi Background */}
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          </div>
        ))}
      </div>
    </div>
  );
}