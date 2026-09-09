import { useState } from "react";
import { BookOpen, Calendar, Clock, Download, Printer, School, User, X, CheckCircle2, Sparkles, Target } from "lucide-react";
import { EduButton } from "@/components/ui-edu/button";
import type { TeachingResponse } from "@/lib/ai/schema";

interface TeacherLessonPlanModalProps {
  response: TeachingResponse;
  onClose: () => void;
}

export function TeacherLessonPlanModal({ response, onClose }: TeacherLessonPlanModalProps) {
  const [teacherName, setTeacherName] = useState("Faculty In-Charge");
  const [schoolName, setSchoolName] = useState("PM SHRI / Kendriya Vidyalaya / State Model School");
  const [period, setPeriod] = useState("Period 3");
  const [duration] = useState("40 Minutes");
  
  const lesson = response.lesson;
  const quiz = response.quiz;
  const topic = response.topic || "Classroom Concept";
  const grade = response.grade || "6";
  const subject = response.subject || "General Science & Mathematics";
  const visual = response.visual;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="printable-lesson-plan-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm print:static print:p-0 print:bg-white">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl print:max-h-none print:w-full print:border-none print:shadow-none print:rounded-none">
        
        {/* Modal Controls Header (Hidden on Print) */}
        <div className="flex items-center justify-between border-b border-border bg-muted/40 px-6 py-4 print:hidden">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">Teacher Lesson Plan (TLP)</h2>
              <p className="text-xs text-muted-foreground">NEP 2020 Pedagogical Structure & 5E Learning Model</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <EduButton size="sm" onClick={handlePrint} className="gap-2">
              <Printer className="h-4 w-4" /> Print / Save TLP (PDF)
            </EduButton>
            <button
              onClick={onClose}
              aria-label="Close"
              className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Document Body */}
        <div className="overflow-y-auto p-6 sm:p-10 print:p-4 print:overflow-visible text-black bg-white">
          {/* Official Document Header */}
          <div className="border-2 border-black p-4 text-center">
            <input
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full text-center font-display text-xl font-black uppercase tracking-wide text-black outline-none border-b border-dashed border-gray-300 print:border-none bg-transparent"
              title="Click to edit school name"
            />
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-gray-700">
              Department of School Education • Institutional Teacher Lesson Plan (TLP)
            </p>
            <p className="text-[11px] font-semibold text-gray-600">Aligned with National Education Policy (NEP 2020) & NCF-SE Guidelines</p>
          </div>

          {/* Teacher & Class Metadata Table */}
          <div className="mt-4 border-2 border-black text-xs font-semibold">
            <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-black">
              <div className="p-2 border-r border-black bg-gray-50 font-bold">Teacher Name:</div>
              <div className="p-2 border-r border-black">
                <input
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full outline-none bg-transparent font-medium"
                />
              </div>
              <div className="p-2 border-r border-black bg-gray-50 font-bold">Class / Grade:</div>
              <div className="p-2 font-bold">Class {grade}</div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-black">
              <div className="p-2 border-r border-black bg-gray-50 font-bold">Subject:</div>
              <div className="p-2 border-r border-black">{subject}</div>
              <div className="p-2 border-r border-black bg-gray-50 font-bold">Period & Duration:</div>
              <div className="p-2 font-medium">
                <input
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-20 outline-none bg-transparent"
                /> ({duration})
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4">
              <div className="p-2 border-r border-black bg-gray-50 font-bold">Topic / Unit:</div>
              <div className="p-2 border-r border-black font-extrabold text-sm sm:col-span-3 text-primary">{topic}</div>
            </div>
          </div>

          {/* Section 1: Pedagogical Learning Objectives (Bloom's Taxonomy) */}
          <div className="mt-5">
            <h3 className="bg-black text-white px-3 py-1 font-bold text-xs uppercase tracking-wider">
              1. Specific Learning Outcomes (SLOs) — Bloom's Taxonomy
            </h3>
            <div className="border-2 border-black border-t-0 p-3 text-xs space-y-2">
              <div>
                <span className="font-bold text-gray-900">• Knowledge (Remembering):</span> Students will recall definitions, key terminology, and fundamental concepts of <strong>{topic}</strong>.
              </div>
              <div>
                <span className="font-bold text-gray-900">• Understanding (Comprehending):</span> Students will be able to explain in their own words: <em>"{lesson?.whyItMatters || lesson?.concept}"</em>.
              </div>
              {lesson?.activity && (
                <div>
                  <span className="font-bold text-gray-900">• Application (Experiential Learning):</span> Students will apply their understanding through peer investigation: <em>"{lesson.activity}"</em>.
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Teaching-Learning Materials (TLM) */}
          <div className="mt-4">
            <h3 className="bg-black text-white px-3 py-1 font-bold text-xs uppercase tracking-wider">
              2. Teaching-Learning Material (TLM) & Smart Board Integration
            </h3>
            <div className="border-2 border-black border-t-0 p-3 text-xs">
              <ul className="list-disc pl-5 space-y-1">
                <li>Interactive Smart Board with ShikshaSathi visual concept flow.</li>
                <li>Digital Touch Chalkboard for live teacher annotations and student solving.</li>
                <li>NCERT Textbook Chapter References and peer discussion prompts.</li>
                {visual?.title && <li>Digital Schema Diagram: <strong>{visual.title}</strong>.</li>}
              </ul>
            </div>
          </div>

          {/* Section 3: 5E Instructional Plan Table */}
          <div className="mt-4">
            <h3 className="bg-black text-white px-3 py-1 font-bold text-xs uppercase tracking-wider">
              3. 5E Instructional Model Procedure (40 Minutes)
            </h3>
            <div className="border-2 border-black border-t-0 text-xs">
              {/* Engage */}
              <div className="grid grid-cols-[90px_1fr] border-b border-black">
                <div className="p-2 border-r border-black bg-gray-100 font-bold flex items-center justify-center text-center">
                  ENGAGE<br/>(5 Mins)
                </div>
                <div className="p-2 space-y-1">
                  <p className="font-semibold text-gray-800">Hook & Provocative Classroom Question:</p>
                  <p className="italic text-gray-700">
                    "{lesson?.hook || lesson?.classroomQuestion || `Have you ever wondered how ${topic} works in daily life?`}"
                  </p>
                  <p className="text-[11px] text-gray-600">Teacher asks open-ended question; students share prior observations.</p>
                </div>
              </div>

              {/* Explore */}
              <div className="grid grid-cols-[90px_1fr] border-b border-black">
                <div className="p-2 border-r border-black bg-gray-100 font-bold flex items-center justify-center text-center">
                  EXPLORE<br/>(8 Mins)
                </div>
                <div className="p-2 space-y-1">
                  <p className="font-semibold text-gray-800">Visual Inquiry & Hands-on Activity:</p>
                  <p className="text-gray-700">{lesson?.activity || "Interactive breakdown of the concept stages on smart board."}</p>
                  {visual?.steps && visual.steps.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {visual.steps.map((st, i) => (
                        <span key={i} className="inline-flex items-center gap-1 border border-gray-400 bg-gray-50 px-2 py-0.5 rounded text-[10px] font-bold">
                          <span>{st.icon}</span> Step {i+1}: {st.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Explain */}
              <div className="grid grid-cols-[90px_1fr] border-b border-black">
                <div className="p-2 border-r border-black bg-gray-100 font-bold flex items-center justify-center text-center">
                  EXPLAIN<br/>(15 Mins)
                </div>
                <div className="p-2 space-y-1">
                  <p className="font-semibold text-gray-800">Teacher Instruction & Key Concepts:</p>
                  <p className="text-gray-700">{lesson?.concept}</p>
                  {lesson?.keyPoints && lesson.keyPoints.length > 0 && (
                    <ul className="list-disc pl-4 space-y-0.5 pt-1 text-[11px]">
                      {lesson.keyPoints.slice(0, 4).map((kp, i) => (
                        <li key={i}>{kp}</li>
                      ))}
                    </ul>
                  )}
                  {lesson?.teacherScript && (
                    <div className="mt-1.5 p-2 bg-yellow-50/80 border border-yellow-200 rounded text-[11px]">
                      <span className="font-bold text-gray-900">Teacher Script / Explanation Flow:</span>
                      <p className="italic text-gray-700">{lesson.teacherScript}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Elaborate */}
              <div className="grid grid-cols-[90px_1fr] border-b border-black">
                <div className="p-2 border-r border-black bg-gray-100 font-bold flex items-center justify-center text-center">
                  ELABORATE<br/>(7 Mins)
                </div>
                <div className="p-2 space-y-1">
                  <p className="font-semibold text-gray-800">Real-Life Applications & Addressing Misconceptions:</p>
                  {lesson?.examples && lesson.examples.length > 0 && (
                    <p className="text-gray-700"><strong>Everyday Examples:</strong> {lesson.examples.join("; ")}</p>
                  )}
                  {lesson?.mistakes && lesson.mistakes.length > 0 && (
                    <div className="mt-1 p-1.5 bg-red-50/70 border border-red-200 rounded text-[11px] text-red-900">
                      <strong>Common Student Errors & Remedies:</strong> {lesson.mistakes.join("; ")}
                    </div>
                  )}
                </div>
              </div>

              {/* Evaluate */}
              <div className="grid grid-cols-[90px_1fr]">
                <div className="p-2 border-r border-black bg-gray-100 font-bold flex items-center justify-center text-center">
                  EVALUATE<br/>(5 Mins)
                </div>
                <div className="p-2 space-y-1">
                  <p className="font-semibold text-gray-800">Formative Assessment & Quick Check:</p>
                  <p className="text-gray-700">Quick 5-question Smart Board Team Quiz / Oral rapid check.</p>
                  {quiz?.questions && quiz.questions.length > 0 && (
                    <p className="text-[11px] text-gray-600">Sample check: <em>"{quiz.questions[0].question}"</em></p>
                  )}
                  <p className="text-[11px] font-semibold text-gray-800 pt-1">Lesson Recap: "{lesson?.summary || "Concept mastery established."}"</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Blackboard Summary Outline */}
          <div className="mt-4">
            <h3 className="bg-black text-white px-3 py-1 font-bold text-xs uppercase tracking-wider">
              4. Blackboard Work / Chalkboard Layout Plan
            </h3>
            <div className="border-2 border-black border-t-0 p-3 text-xs bg-slate-900 text-white font-mono rounded-b-none">
              <div className="text-center font-bold text-yellow-300 border-b border-gray-700 pb-1 mb-2">
                === BLACKBOARD WORK PLAN: {topic.toUpperCase()} ===
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div>
                  <div className="text-cyan-300 font-bold">[1] CORE DEFINITION:</div>
                  <div className="text-gray-300">{lesson?.concept?.slice(0, 140)}...</div>
                </div>
                <div>
                  <div className="text-green-300 font-bold">[2] KEY STAGES / FLOW:</div>
                  <div className="text-gray-300">
                    {visual?.steps?.map((s) => s.label).join(" -> ") || "Sequential stages"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Signatures & Certification Block */}
          <div className="mt-8 pt-4 border-t-2 border-black grid grid-cols-3 gap-4 text-center text-xs">
            <div>
              <div className="h-10 border-b border-dashed border-black"></div>
              <p className="mt-1 font-bold">Subject Teacher Signature</p>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-black"></div>
              <p className="mt-1 font-bold">Head of Department (HoD)</p>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-black"></div>
              <p className="mt-1 font-bold">Principal / Academic Inspector</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
