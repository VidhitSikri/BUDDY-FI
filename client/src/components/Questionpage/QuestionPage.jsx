import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import avengers from '../../assets/movies/avengers.png';
import friends from '../../assets/movies/friends.png';
import znmd from '../../assets/movies/znmd.png';
import titanic from '../../assets/movies/titanic.png';
import jazz from '../../assets/music/jazz.png';
import pop from '../../assets/music/pop.png';
import rap from '../../assets/music/rap.png';
import rock from '../../assets/music/rock.png';
import exercise from '../../assets/toughday/exercise.png';
import meditation from '../../assets/toughday/meditation.png';
import powering from '../../assets/toughday/powering.png';
import venting from '../../assets/toughday/venting.png';
import beach from '../../assets/vacation/beach.png';
import city from '../../assets/vacation/city.png';
import culture from '../../assets/vacation/culture.png';
import mountain from '../../assets/vacation/mountain.png';
import bingwatch from '../../assets/weekends/bingwatch.png';
import explore from '../../assets/weekends/explore.png';
import hangout from '../../assets/weekends/hangout.png';
import reading from '../../assets/weekends/reading.png';
import face from '../../assets/communicate/face.png'
import voice from '../../assets/communicate/voice.png'
import text from '../../assets/communicate/text.png'
import video from '../../assets/communicate/video.png'
import sgcf from '../../assets/social/sgcf.png'
import bp from '../../assets/social/bp.png'
import one from '../../assets/social/one.png'
import diff from '../../assets/social/diff.png'

// Map images to options for easier management
const optionImages = {
  'Romantic Movies': titanic,
  'Adventure/Travel Movies': znmd,
  'Comedies': friends,
  'Action/Thriller Movies': avengers,
  'Hanging out with friends': hangout,
  'Exploring new places': explore,
  'Binge-watching TV shows': bingwatch,
  'Reading a good book': reading,
  'Pop Hits': pop,
  'Classical Music': jazz,
  'Rock/Alternative': rock,
  'Hip-Hop/Rap': rap,
  'In-person hangouts': face,
  'Video Calls': video,
  'Texting/Messaging': text,
  'Voice Notes': voice,
  'Beach Relaxation': beach,
  'Mountain Trekking': mountain,
  'City Exploration': city,
  'Cultural Tour': culture,
  'Venting to a friend': venting,
  'Working out or going for a run': exercise,
  'Meditating or practicing mindfulness': meditation,
  'Powering through with determination': powering,
  'Small gathering with close friends':sgcf,
  'Big parties or events':bp,
  'Quiet one-on-one conversations':one,
  'Hanging out with different groups':diff
};

// List of questions and options
const questions = [
  {
    question: "What type of movie do you love watching on repeat?",
    options: [
      'Romantic Movies',
      'Adventure/Travel Movies',
      'Comedies',
      'Action/Thriller Movies'
    ]
  },
  {
    question: "How do you spend your ideal weekend?",
    options: [
      'Hanging out with friends',
      'Exploring new places',
      'Binge-watching TV shows',
      'Reading a good book'
    ]
  },
  {
    question: "What type of music do you vibe to?",
    options: [
      'Pop Hits',
      'Jazz',
      'Rock/Alternative',
      'Hip-Hop/Rap'
    ]
  },
  {
    question: "How do you prefer to communicate with friends?",
    options: [
      'In-person hangouts',
      'Video Calls',
      'Texting/Messaging',
      'Voice Notes'
    ]
  },
  {
    question: "What kind of vacation do you dream of?",
    options: [
      'Beach Relaxation',
      'Mountain Trekking',
      'City Exploration',
      'Cultural Tour'
    ]
  },
  {
    question: "How do you usually handle a tough day?",
    options: [
      'Venting to a friend',
      'Working out or going for a run',
      'Meditating or practicing mindfulness',
      'Powering through with determination'
    ]
  },
  {
    question: "What kind of social setting do you prefer ?",
    options: [
      'Small gathering with close friends',
      'Big parties or events',
      'Quiet one-on-one conversations',
      'Hanging out with different groups'
    ]
  }
];

const QuestionPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const navigate = useNavigate();

  const handleOptionSelect = (option) => {
    setSelectedOptions({
      ...selectedOptions,
      [currentIndex]: option
    });
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  const handleSubmit = async () => {
    try {
      // Retrieve the email from local storage
      const email = localStorage.getItem('registeredEmail');
  
      if (!email) {
        alert('Email not found. Please register again.');
        return;
      }
  
      const requestBody = {
        email,
        hobbies: {
          hobby1: selectedOptions[0], // Modify these indices based on the actual hobby questions
          hobby2: selectedOptions[1], // Example for two hobby questions
          hobby3: selectedOptions[2], // Example for two hobby questions
          hobby4: selectedOptions[3], // Example for two hobby questions
          hobby5: selectedOptions[4], // Example for two hobby questions
          hobby6: selectedOptions[5], // Example for two hobby questions
          hobby7: selectedOptions[6], // Example for two hobby questions
        },
      };
  
      const response = await fetch('http://localhost:5000/api/auth/submit-answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      const responseData = await response.json();
  
      if (response.ok) {
        console.log('Response from server:', responseData);
        alert('Answers submitted successfully!');
        navigate('/login');
      } else {
        console.error('Server error:', responseData);
        alert('Failed to submit answers.');
      }
    } catch (error) {
      console.error('Error submitting answers:', error);
      alert('Error submitting answers.');
    }
  };
  

  const { question, options } = questions[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center bg-transparent border-2 border-black rounded-lg w-4/12 p-4 overflow-hidden">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">{question}</h1>
        <p className="text-md text-gray-500 mt-2">
          (Choose The Option That Fits You Best And Let's Get To Know You Better! 😁)
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {options.map((option, index) => (
          <div
            key={index}
            className={`relative group flex flex-col items-center cursor-pointer ${
              selectedOptions[currentIndex] === option ? 'border-4 border-blue-500' : ''
            }`}
            onClick={() => handleOptionSelect(option)}
          >
            <img
              src={optionImages[option]}
              alt={option}
              className="rounded-lg shadow-lg w-36 h-48 object-cover mb-2"
            />
            <p className="text-center">{option}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="bg-white p-3 rounded-full shadow-md mx-2 text-2xl"
        >
          ⬅
        </button>
        {currentIndex < questions.length - 1 ? (
          <button
            onClick={handleNext}
            disabled={!selectedOptions[currentIndex]}
            className="bg-white p-3 rounded-full shadow-md mx-2 text-2xl"
          >
            ➡
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!selectedOptions[currentIndex]}
            className="bg-green-500 p-3 rounded-full shadow-md mx-2 text-2xl"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionPage;
