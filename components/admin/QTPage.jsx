import React from 'react';

// Generic QuestionTemplate component
function QuestionTemplate({ type, data }) {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 mb-6 hover:shadow-2xl transition-shadow duration-300">
      {type === 'mcq' && (
        <>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">MCQ Question</h3>
          <p className="mb-4 text-gray-700">{data.question}</p>
          <ul className="space-y-2">
            {data.options.map((option, index) => (
              <li
                key={index}
                className="p-3 border rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
              >
                {option}
              </li>
            ))}
          </ul>
        </>
      )}

      {type === 'fillBlank' && (
        <>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Fill in the Blank</h3>
          <p className="mb-4 text-gray-700">
            {data.sentence.split('___').map((part, index, arr) =>
              index < arr.length - 1 ? (
                <span key={index} className="flex items-center space-x-2">
                  <span>{part}</span>
                  <input
                    type="text"
                    placeholder="..."
                    className="border-b-2 border-gray-300 focus:border-blue-400 outline-none px-2 py-1 rounded-sm transition-all"
                  />
                </span>
              ) : (
                part
              )
            )}
          </p>
        </>
      )}

      {type === 'imageTranslation' && (
        <>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Image Translation</h3>
          <img
            src={data.image}
            alt="Question"
            className="mb-4 w-full max-w-xs rounded-lg shadow-md"
          />
          <ul className="space-y-2">
            {data.options.map((option, index) => (
              <li
                key={index}
                className="p-3 border rounded-lg cursor-pointer hover:bg-green-100 transition-colors"
              >
                {option}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

// Example usage
export default function QTPage() {
  const mcqData = {
    question: 'What is 2 + 2?',
    options: ['1', '2', '3', '4'],
    correct: '4',
  };

  const fillBlankData = {
    sentence: 'React is a ___ library for building UIs.',
    correct: 'JavaScript',
  };

  const imageTranslationData = {
    image: 'https://via.placeholder.com/150',
    options: ['Cat', 'Dog', 'Bird', 'Fish'],
    correct: 'Cat',
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8 font-sans text-black">
      <h2 className="text-3xl font-bold mb-8 text-gray-900">Question Templates</h2>

      <QuestionTemplate type="mcq" data={mcqData} />
      <QuestionTemplate type="fillBlank" data={fillBlankData} />
      <QuestionTemplate type="imageTranslation" data={imageTranslationData} />
    </div>
  );
}
