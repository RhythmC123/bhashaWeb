// import { useState } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import supabase from "@/lib/supabaseClient";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent } from "@/components/ui/card";

// export default function AddQuestion() {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();

//   const moduleId = searchParams.get("module_id");
//   const languageId = searchParams.get("language_id");

//   const [type, setType] = useState("mcq");
//   const [form, setForm] = useState({
//     question: "",
//     o1: "",
//     o2: "",
//     o3: "",
//     o4: "",
//     correct: "",
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     let error = null;

//     if (type === "mcq") {
//       const { error: mcqError } = await supabase.from("mcq").insert([
//         {
//           ...form,
//           module_id: Number(moduleId),
//           language_id: Number(languageId),
//           type: "mcq",
//         },
//       ]);
//       error = mcqError;
//     } else if (type === "fill_in_blank") {
//       const { error: fibError } = await supabase.from("fillblank").insert([
//         {
//           question: form.question,
//           correct: form.correct,
//           module_id: Number(moduleId),
//           language_id: Number(languageId),
//         },
//       ]);
//       error = fibError;
//     }

//     if (error) {
//       alert("❌ Failed: " + error.message);
//     } else {
//       alert("✅ Question added!");
//       navigate(-1); // go back to Courses
//     }
//   };

//   return (
//     <div className="p-6">
//       <Card className="max-w-xl mx-auto">
//         <CardContent className="p-6 space-y-4">
//           <h2 className="text-2xl font-bold mb-4">Add Question</h2>

//           {/* Select Question Type */}
//           <div>
//             <Label>Question Type</Label>
//             <select
//               value={type}
//               onChange={(e) => setType(e.target.value)}
//               className="w-full border rounded p-2 text-black"
//             >
//               <option value="mcq">MCQ</option>
//               <option value="fill_in_blank">Fill in the Blank</option>
//             </select>
//           </div>

//           {/* Common Field */}
//           <div>
//             <Label>Question</Label>
//             <Input
//               type="text"
//               name="question"
//               value={form.question}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           {/* MCQ Fields */}
//           {type === "mcq" && (
//             <>
//               {["o1", "o2", "o3", "o4"].map((opt, idx) => (
//                 <div key={idx}>
//                   <Label>Option {idx + 1}</Label>
//                   <Input
//                     type="text"
//                     name={opt}
//                     value={form[opt]}
//                     onChange={handleChange}
//                   />
//                 </div>
//               ))}
//               <div>
//                 <Label>Correct Answer</Label>
//                 <Input
//                   type="text"
//                   name="correct"
//                   value={form.correct}
//                   onChange={handleChange}
//                   placeholder="Enter the correct option text"
//                 />
//               </div>
//             </>
//           )}

//           {/* Fill in the Blank */}
//           {type === "fill_in_blank" && (
//             <div>
//               <Label>Correct Answer</Label>
//               <Input
//                 type="text"
//                 name="correct"
//                 value={form.correct}
//                 onChange={handleChange}
//                 placeholder="Enter correct word/phrase"
//               />
//             </div>
//           )}

//           <Button
//             onClick={handleSubmit}
//             className="w-full bg-blue-600 hover:bg-blue-700"
//           >
//             Save Question
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
