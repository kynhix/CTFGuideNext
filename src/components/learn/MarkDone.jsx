import { useState, useEffect } from 'react';
import Link from 'next/link';
import request from '@/utils/request';

export function MarkDone({ sublesson, section, href }) {
  const [marked, setMarked] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [sfx, setSfx] = useState(null);

  useEffect(() => {
    setSfx(new Audio('../sounds/success.wav'));
  }, []);

  const handleSubmit = () => {
    if (sfx) {
      sfx.currentTime = 0; // Reset the audio to the beginning
      sfx.play(); // Play the audio
    }

    // Mark Progress
    const url = `${process.env.NEXT_PUBLIC_API_URL}/lessons/sublesson/${sublesson}/progress/${section}`;
    request(url, 'PUT', {})
      .then((data) => {
        setMarked(true);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 4000);
      })
      .catch((err) => {
        // Trigger Unauthenticated Popup
      });
  };

  return (
    <>
      <Link href={href ? href : './'} className="my-auto">
        <button
          onClick={handleSubmit}
          className='text-blue-50 bg-blue-700 hover:bg-blue-800 hover:bg-blue-800/100 px-4 py-1 text-xl rounded-l-sm'
        >
          Mark Done
        </button>
      </Link>
      {showPopup && (
        <div className="center fixed bottom-6 right-6 rounded-md bg-[#3B82F6] p-2">
          Progress Saved!
        </div>
      )}
      {marked && <p></p>}
    </>
  );
}
