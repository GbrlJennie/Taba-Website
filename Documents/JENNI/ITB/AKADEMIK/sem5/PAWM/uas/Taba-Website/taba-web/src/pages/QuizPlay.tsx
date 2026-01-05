import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MoreVertical, GripVertical, Check } from 'lucide-react';
import { useQuestions } from '../hooks/useQuestions';
import { useQuizHistory } from '../hooks/useQuizHistory';

export default function QuizPlay() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const course = searchParams.get('course') || '';
  const topic = searchParams.get('topic') || '';

  // Hooks dari file yang sudah kamu upload
  const { questions, loading: loadingQuestions } = useQuestions(course, topic);
  const { saveQuizResult } = useQuizHistory();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<any>({});
  const [dragData, setDragData] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inisialisasi Drag Data jika soal tipe drag-drop
  useEffect(() => {
    if (questions.length > 0 && questions[currentIdx]?.type === 'drag-drop') {
      const initialItems = questions[currentIdx].drag_items || [];
      // Acak urutan untuk tantangan (opsional, di sini kita pakai default dulu)
      setDragData([...initialItems]); 
      const questionId = questions[currentIdx].id;
      // Set default answer
      setSelectedAnswers((prev: any) => ({ ...prev, [questionId]: initialItems }));
    }
  }, [currentIdx, questions]);

  const currentQ = questions[currentIdx];

  const handleSelect = (ans: any) => {
    if (!currentQ) return;
    setSelectedAnswers((prev: any) => ({ ...prev, [currentQ.id]: ans }));
  };

  // Logic sederhana untuk "Drag & Drop" di web tanpa library berat:
  // User klik item untuk memindahkannya ke atas/bawah (Swap)
  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...dragData];
    if (direction === 'up' && index > 0) {
      [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
    } else if (direction === 'down' && index < newItems.length - 1) {
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    }
    setDragData(newItems);
    handleSelect(newItems);
  };

  const handleNext = async () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      await finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setIsSubmitting(true);
    let score = 0;
    const answersToSave: any[] = [];

    questions.forEach(q => {
      const userAns = selectedAnswers[q.id];
      const correctAns = q.correct_answer;
      
      // Simple stringify comparison for arrays/objects
      const isCorrect = JSON.stringify(userAns) === JSON.stringify(correctAns);
      
      if (isCorrect) {
        score += (100 / questions.length);
      }

      answersToSave.push({
        question_id: q.id,
        user_answer: JSON.stringify(userAns),
        correct_answer: JSON.stringify(correctAns),
        is_correct: isCorrect
      });
    });

    const correctCount = answersToSave.filter(a => a.is_correct).length;

    try {
      await saveQuizResult(
        course,
        topic,
        Math.round(score),
        questions.length,
        correctCount,
        null, // duration null dulu
        answersToSave
      );
      
      // Redirect ke Result
      navigate(`/dashboard/quiz/result?score=${Math.round(score)}&topic=${encodeURIComponent(topic)}&course=${encodeURIComponent(course)}&passed=${score >= 70}`);
    } catch (error) {
      console.error('Failed to save quiz:', error);
      alert('Gagal menyimpan nilai. Coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingQuestions) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-600">
        <div className="text-white flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <p>Memuat Soal...</p>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <p className="text-slate-600 mb-4">Belum ada soal untuk topik ini.</p>
          <button onClick={() => navigate(-1)} className="text-indigo-600 font-bold hover:underline">Kembali</button>
        </div>
      </div>
    );
  }

  const getOptions = () => {
    if (currentQ.type === 'true-false') return ['Benar', 'Salah'];
    return currentQ.options || [];
  };

  return (
    <div className="min-h-screen bg-indigo-600 flex flex-col">
      {/* Header */}
      <div className="p-6 flex justify-between items-center text-white">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition">
          <ChevronLeft />
        </button>
        <span className="font-bold text-lg">{topic}</span>
        <MoreVertical className="opacity-50" />
      </div>

      {/* Progress */}
      <div className="px-8 mb-6 flex justify-between items-end text-white">
        <span className="text-3xl font-bold opacity-50">
          {(currentIdx + 1).toString().padStart(2, '0')}
        </span>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wider opacity-70 mb-1">Total Soal</p>
          <span className="font-bold">{questions.length}</span>
        </div>
      </div>

      {/* White Card Container */}
      <div className="flex-1 bg-white rounded-t-[40px] p-8 flex flex-col shadow-2xl overflow-y-auto">
        <div className="mb-8">
          <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-xs font-bold uppercase mb-4">
            {currentQ.type}
          </span>
          <h2 className="text-2xl font-bold text-slate-800 leading-relaxed">
            {currentQ.question}
          </h2>
        </div>

        {/* Answer Options */}
        <div className="flex-1 space-y-3">
          {currentQ.type === 'drag-drop' ? (
            <div className="space-y-2">
              <p className="text-sm text-slate-500 italic mb-2">Klik panah untuk mengurutkan jawaban:</p>
              {dragData.map((item, idx) => (
                <div key={idx} className="flex items-center bg-slate-50 border border-slate-200 p-3 rounded-xl">
                  <div className="flex flex-col mr-3 gap-1">
                    <button 
                      onClick={() => moveItem(idx, 'up')} 
                      disabled={idx === 0}
                      className="text-slate-400 hover:text-indigo-600 disabled:opacity-20"
                    >▲</button>
                    <button 
                      onClick={() => moveItem(idx, 'down')} 
                      disabled={idx === dragData.length - 1}
                      className="text-slate-400 hover:text-indigo-600 disabled:opacity-20"
                    >▼</button>
                  </div>
                  <div className="flex-1 font-medium text-slate-700">{item}</div>
                  <GripVertical className="text-slate-300" size={18} />
                </div>
              ))}
            </div>
          ) : (
            getOptions().map((opt, idx) => {
              const isSelected = selectedAnswers[currentQ.id] === opt;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(opt)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group
                    ${isSelected 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                      : 'border-slate-100 bg-white text-slate-600 hover:border-indigo-200 hover:bg-slate-50'
                    }`}
                >
                  <span className={`font-medium ${isSelected ? 'font-bold' : ''}`}>{opt}</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                    ${isSelected ? 'border-indigo-600' : 'border-slate-300'}`}>
                    {isSelected && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Button Next */}
        <div className="mt-8 pt-4 border-t border-slate-100">
          <button
            onClick={handleNext}
            disabled={!selectedAnswers[currentQ.id] || isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {isSubmitting ? (
              'Menyimpan...' 
            ) : (
              currentIdx === questions.length - 1 ? 'Selesai & Lihat Nilai' : 'Lanjut Soal Berikutnya'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}