import { Container } from '@/components/Container';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export function DataAsk({ props }) {
  const router = useRouter();

  useEffect(() => {
    if (router.query.part == '1') {
      if (router.query.error) {
        document.getElementById('error').classList.remove('hidden');
        document.getElementById('error').innerHTML = router.query.error;
      }
    }
  });

  function submitData() {
    // Generate JSON to send

    var username = document.getElementById('username').value;
    var birthday = document.getElementById('birthday').value;
    var firstname = document.getElementById('fullname').value.split(' ')[0];
    var lastname = document.getElementById('fullname').value.split(' ')[1];

    const parts = birthday.split('-');
    const newDateStr = `${parts[1]}-${parts[2]}-${parts[0]}`;
    localStorage.setItem('username', document.getElementById('username').value);
    localStorage.setItem('birthday', newDateStr);
    localStorage.setItem(
      'firstname',
      document.getElementById('fullname').value.split(' ')[0]
    );
    localStorage.setItem(
      'lastname',
      document.getElementById('fullname').value.split(' ')[1]
    );

    if (!username || !birthday || !firstname || !lastname) {
      return window.alert('Please fill out all fields.');
    } else {
      window.location.replace('./onboarding?part=2');
    }

    //window.location.replace("./onboarding?part=2");
  }

  return (
    <>


<div className='grid grid-cols-2 max-w-6xl mx-auto mt-20'>
  
      <div className="  ">

       


        <div style={{ backgroundColor: '#161716' }} className=" ">
       


          <div
            style={{ backgroundColor: '#161716' }}
            className=" mt-4 "
          >
            <div className="  px-4 ">
              <h1 className="text-xl text-white ">
                {' '}
Finish creating your account
              </h1>

              <div
                id="error"
                className="mt-2 mb-2 hidden rounded-lg bg-red-900 px-2 py-1 text-center text-white"
              >
                Error - Something went wrong.
              </div>
              <div className=" mt-4">
                <div className="isolate -space-y-px rounded-md sh
                adow-sm">
                  <div
                    style={{ borderColor: '#212121' }}
                    className="relative rounded-md rounded-b-none border  px-3 py-2 focus-within:z-10 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >

<label
                      htmlFor="job-title"
                      className="block text-xs font-medium text-white"
                    >
                      Username
                    </label>
             
                    <input
                      type="text"
                      name="name"
                      id="username"
                      style={{ backgroundColor: '#212121' }}
                      className="mt-2 block w-full rounded border-0 p-0 py-1 px-4 text-white  placeholder-gray-500 focus:ring-0 sm:text-sm"
                      placeholder="This is what people on CTFGuide will know you as."
                    />
                  </div>
                  
                  <div
                    style={{ borderColor: '#212121' }}
                    className="relative rounded-md rounded-t-none rounded-b-none border gap-x-4  px-3 py-2 focus-within:z-10 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >       <label
                  htmlFor="job-title"
                  className="block text-xs font-medium text-white"
                >
                  Full Name (optional)
                </label>
                   <div className='flex gap-x-4'> 
                    <input
                      type="text"
                      name="name"
                      id="firstname"
                      style={{ backgroundColor: '#212121' }}
                      className="mt-2 block w-full rounded border-0 p-0 py-1 px-4 text-white  placeholder-gray-500 focus:ring-0 sm:text-sm"
                      placeholder="First Name"
                    />

                    <input
                      type="text"
                      name="name"
                      id="lastname"
                      style={{ backgroundColor: '#212121' }}
                      className="mt-2 block w-full rounded border-0 p-0 py-1 px-4 text-white  placeholder-gray-500 focus:ring-0 sm:text-sm"
                      placeholder="Last Name"
                    />
                  </div>
                  </div> 

                  <div
                    style={{ borderColor: '#212121' }}
                    className="relative rounded-md rounded-t-none border px-3 py-2 focus-within:z-10 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <label
                      htmlFor="job-title"
                      className="block text-xs font-medium text-white"
                    >
                      Birthday
                    </label>

                    <input
                      id="birthday"
                      type="date"
                      style={{ backgroundColor: '#212121' }}
                      className="mt-2 block w-full rounded border-0 p-0 py-1 px-4 text-white placeholder-gray-500 focus:ring-0 sm:text-sm"
                    ></input>
                  </div>
                </div>

                <div className="mx-auto inline-flex text-center mt-4">
                    <input
                      id="legal"
                      style={{ backgroundColor: '#212121' }}
                      type="checkbox"
                      className="mt-1  rounded-lg border border-gray-700 px-2 py-1"
                    ></input>
                    <p className="ml-2 text-white">
                      I agree to the <a href="https://ctfguide.com/terms-of-service" className='text-blue-500'>Terms of Service</a> and <a href="https://ctfguide.com/privacy-policy" className='text-blue-500'>Privacy Policy</a>
                    </p>
                  </div>

                <div className="mx-auto mx-auto text-center">
                  <button
                    onClick={submitData}
                    className="button mx-auto mt-8 w-2/3 rounded bg-blue-800 py-2 text-white hover:bg-blue-900"
                  >
                    Start Hacking
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='mx-auto my-auto text-white px-10'>
        

        <h1> We learned 55% of new signups weren't finishing our onboarding process, so we tried cutting it down to just 4 input boxes. </h1>
        
        <h1 className='mt-4'>You don't need to provide us your first name or last name, but we do need a username (to know who you are) and date of birth (COPPA laws). </h1>
         
         <h1 className='mt-4 bg-neutral-800 px-4 py-2'>"I was able to get a Ferrari because I finished creating my CTFGuide website."<br/>- Scratch</h1>
         </div>

      </div>
    </>
  );
}
