import { useState } from "react";
import { Download, Printer, School, User, X } from "lucide-react";
import { EduButton } from "@/components/ui-edu/button";
import type { TeachingResponse } from "@/lib/ai/schema";

interface PrintableWorksheetProps {
  response: TeachingResponse;
  onClose: () => void;
}

export function PrintableWorksheet({ response, onClose }: PrintableWorksheetProps) {
  const [schoolName, setSchoolName] = useState("PM SHRI Model School / Kendriya Vidyalaya");
  const [maxMarks] = useState(25);
  const lesson = response.lesson;
  const quiz = response.quiz;
  const topic = response.topic || "Classroom Topic";
  const grade = response.grade || "6";
  const subject = response.subject || "General Science";
  const language = response.language || "Hinglish";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="printable-worksheet-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm print:static print:p-0 print:bg-white">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl print:max-h-none print:w-full print:border-none print:shadow-none print:rounded-none">
        {/* Modal Controls Header (Hidden when printing) */}
        <div className="flex items-center justify-between border-b border-border bg-muted/40 px-6 py-4 print:hidden">
          <div className="flex items-center gap-2">
            <School className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-bold text-foreground">Printable Classroom Worksheet</h2>
          </div>
          <div className="flex items-center gap-3">
            <EduButton size="sm" onClick={handlePrint} className="gap-2">
              <Printer className="h-4 w-4" /> Print / Save as PDF
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

        {/* Worksheet Content Body */}
        <div className="overflow-y-auto p-6 sm:p-10 print:p-6 print:overflow-visible text-black bg-white">
          {/* Official Indian School Header Block */}
          <div className="border-2 border-black p-4 text-center">
            <input
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full text-center font-display text-xl font-extrabold uppercase tracking-wide text-black outline-none border-b border-dashed border-gray-300 print:border-none bg-transparent"
              title="Click to edit school name"
            />
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-gray-700">
              Department of School Education • Classroom Activity & Assessment Sheet
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-between border-t border-black pt-2 text-xs font-semibold">
              <span>Class: <strong>Class {grade}</strong></span>
              <span>Subject: <strong>{subject}</strong></span>
              <span>Topic: <strong>{topic}</strong></span>
              <span>Medium: <strong>{language}</strong></span>
              <span>Max Marks: <strong>{maxMarks}</strong></span>
            </div>
          </div>

          {/* Student Info Filling Row */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border border-black p-2.5 text-xs font-semibold">
            <div>Student Name: _______________________</div>
            <div>Roll Number: _________</div>
            <div>Date: ________________</div>
          </div>

          {/* Part A: Concept & Hook */}
          {lesson?.concept && (
            <section className="mt-6">
              <h3 className="border-b-2 border-black pb-1 text-sm font-extrabold uppercase tracking-wider text-black">
                Section A: Concept Summary (अवधारणा सारांश)
              </h3>
              {lesson.hook && (
                <p className="mt-2 text-xs italic text-gray-800 bg-gray-50 p-2 border-l-2 border-black">
                  <strong>Teacher's Hook:</strong> {lesson.hook}
                </p>
              )}
              <p className="mt-2 text-xs leading-relaxed text-gray-900">
                {lesson.concept}
              </p>
            </section>
          )}

          {/* Part B: Key Points to Remember */}
          {lesson?.keyPoints && lesson.keyPoints.length > 0 && (
            <section className="mt-5">
              <h3 className="border-b-2 border-black pb-1 text-sm font-extrabold uppercase tracking-wider text-black">
                Section B: Key Takeaways (मुख्य बिंदु)
              </h3>
              <ul className="mt-2 grid grid-cols-1 gap-1.5 text-xs">
                {lesson.keyPoints.slice(0, 5).map((point, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-bold">[{i + 1}]</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Part C: Practice MCQs */}
          {quiz?.questions && quiz.questions.length > 0 && (
            <section className="mt-6">
              <div className="flex items-center justify-between border-b-2 border-black pb-1">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-black">
                  Section C: Multiple Choice Questions (बहुविकल्पीय प्रश्न)
                </h3>
                <span className="text-xs font-bold">[Marks: {quiz.questions.length * 2}]</span>
              </div>
              <p className="mt-1 text-[11px] italic text-gray-600">Choose the correct option and write in the box provided.</p>
              <div className="mt-3 flex flex-col gap-4 text-xs">
                {quiz.questions.map((q, idx) => (
                  <div key={idx} className="border-b border-gray-200 pb-2.5">
                    <div className="flex justify-between font-semibold">
                      <span>Q{idx + 1}. {q.question}</span>
                      <span className="font-mono text-xs font-bold border border-black px-2 py-0.5 ml-2 shrink-0">
                        Ans: [ &nbsp;&nbsp;&nbsp;&nbsp; ]
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 pl-4 text-gray-800">
                      {q.options.map((opt, optIdx) => {
                        const letter = String.fromCharCode(65 + optIdx);
                        return (
                          <div key={optIdx}>
                            ({letter}) {opt}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Part D: Classroom Hands-on Activity */}
          {lesson?.activity && (
            <section className="mt-5">
              <h3 className="border-b-2 border-black pb-1 text-sm font-extrabold uppercase tracking-wider text-black">
                Section D: Hands-on Classroom Activity (कक्षा गतिविधि)
              </h3>
              <div className="mt-2 rounded border border-dashed border-gray-400 p-2.5 text-xs text-gray-900">
                <p><strong>Activity Instructions:</strong> {lesson.activity}</p>
                <div className="mt-3 border-t border-gray-300 pt-2">
                  <p className="text-[11px] font-semibold text-gray-700">Student Observation / Notes:</p>
                  <div className="mt-1 h-12 border-b border-dashed border-gray-300" />
                </div>
              </div>
            </section>
          )}

          {/* Part E: Teacher Evaluation & Signature Block */}
          <div className="mt-8 border-t-2 border-black pt-4 grid grid-cols-3 gap-4 text-xs font-semibold text-gray-800">
            <div>
              <p>Total Marks Obtained: <strong>______ / {maxMarks}</strong></p>
              <p className="mt-1">Grade: <strong>[ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ]</strong></p>
            </div>
            <div>
              <p>Teacher's Remarks: _________________</p>
            </div>
            <div className="text-right">
              <p>Teacher's Signature: _________________</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
