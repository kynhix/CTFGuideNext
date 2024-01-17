import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { useEffect, Fragment, useState } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import { loadStripe } from '@stripe/stripe-js';
import ClassroomNav from '@/components/groups/classroomNav';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const STRIPE_KEY = process.env.NEXT_PUBLIC_APP_STRIPE_KEY;
const baseUrl = process.env.NEXT_PUBLIC_API_URL; // switch to deployment api url
const frontend_baselink = `localhost:3000`;

const categoryToIdx = {
  test: 0,
  quiz: 1,
  homework: 2,
  assessment: 3,
};

const defaultImages = [
  'https://robohash.org/pranavramesh',
  'https://robohash.org/laphatize',
  'https://robohash.org/stevewilkers',
  'https://robohash.org/rickast',
  'https://robohash.org/picoarc',
  'https://robohash.org/jasoncalcanis',
];

export default function teacherSettings() {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLink, setInviteLink] = useState(
    'ctfguide.com/invite/*****/********'
  );
  const [inviteActivated, setInviteActivated] = useState(false);
  const [classroom, setClassroom] = useState({});

  const [description, setDescription] = useState('');
  const [numberOfSeats, setNumberOfSeats] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [nameOfClassroom, setNameOfClassroom] = useState('');
  const [emailDomain, setEmailDomain] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [showOverlay, setShowOverlay] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [messageOfConfirm, setMessageOfConfirm] = useState('');
  const [index, setIndex] = useState(-1);

  const [originalNumberOfSeats, setOriginalNumberOfSeats] = useState(0);

  const [weightIdx, setWeightIdx] = useState(0);
  const [weights, setWeights] = useState([]);
  const [category, setCategory] = useState(0);
  const [classCode, setClassCode] = useState('');
  const [classroomId, setClassroomId] = useState(-1);
  const [pricingPlan, setPricingPlan] = useState('');
  const [students, setStudents] = useState([]);
  const [filteredOptions, setFileredOptions] = useState([]);


  const router = useRouter();
  const { group } = router.query;


  useEffect(() => {
    const getClassroom = async () => {
      const classCode = window.location.href.split('/')[4];
      setClassCode(classCode);
      if (!classCode) return;
      const url = `${baseUrl}/classroom/classroom-by-classcode?classCode=${classCode}`;
      const requestOptions = {
        method: 'GET',
      };
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      if (data.success) {
        let classroom = data.body;
        setDescription(classroom.description);
        setNumberOfSeats(classroom.numberOfSeats);
        setIsOpen(classroom.open ? 'open' : 'close');
        setNameOfClassroom(classroom.name);
        setEmailDomain(classroom.org);
        setWeights(classroom.weights);
        setCategory(classroom.category.length > 0 ? classroom.category[0] : 0);
        setPricingPlan(classroom.pricingPlan);
        setClassroomId(classroom.id);
        setStudents(classroom.sutdents);
        const filteredOptions = classroom.students.filter((option) =>
          option.username.toLowerCase().includes(searchInput.toLowerCase())
        );
        setOriginalNumberOfSeats(classroom.numberOfSeats);
        setFileredOptions(filteredOptions);
        let isAuth = await checkPermissions(classCode);
        if (!isAuth) {
          window.location.replace('/groups');
        }
      } else {
        console.log('Error when getting classroom info');
        console.log(data.message);
      }
    };
    getClassroom();
  }, []);

  const checkPermissions = async (classCode) => {
    try {
      const userUid = localStorage.getItem('uid');
      const url = `${baseUrl}/classroom/check-if-teacher`;
      const token = localStorage.getItem('idToken');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({ classCode: classCode, uid: userUid }),
      });
      const res = await response.json();
      if (res.success) {
        return res.isTeacher;
      } else {
        window.location.replace('/login');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const actions = [
    'Are you sure you want to delete the class all data will be lost',
    'Are you sure you want to leave the class',
    'Are you sure you want to make these changes?',
    `Are you sure you want to remove ${
      selectedStudent && selectedStudent.username
    } from the class?`,
  ];

  const handleNumberOfSeats = (event) => {
    const value = event.target.value;
    if (
      value !== '' &&
      !isNaN(value) &&
      parseInt(value) >= originalNumberOfSeats
    ) {
      setNumberOfSeats(value);
    }
  };

  const handleInviteLink = async () => {
    setInviteActivated(true);
    const email = inviteEmail;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      setInviteLink('generating...');
      const url = `${baseUrl}/classroom/getAccessToken?classCode=${classCode}&email=${email}`;
      const token = localStorage.getItem('idToken');
      const requestOptions = {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      console.log(data);
      if (data.success) {
        setInviteLink(
          `${frontend_baselink}/groups/invites/${classCode}/${data.body}`
        );
      } else {
        setInviteLink(data.message);
      }
    }
  };

  const handleDelete = async () => {
    try {
      const url = `${baseUrl}/classroom/remove`;
      const token = localStorage.getItem('idToken');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          classroomId: classroomId,
          classCode: classCode,
        }),
      });
      const data = await response.json();
      if (data.success) {
        window.location.href = `/groups/${classCode}/home`;
      } else {
        window.location.replace('/login');
        console.log('Error when removing classroom');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const leaveClass = async () => {
    try {
      const uidOfTeacher = localStorage.getItem('uid');
      const url = `${baseUrl}/classroom/leave`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isTeacher: true,
          classroomId,
          userId: uidOfTeacher,
        }),
      });
      const data = await response.json();
      if (data.success) {
        window.location.href = `/groups/${classCode}/home`;
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const removeStudent = async () => {
    try {
      const userId = selectedStudent.uid;
      const url = `${baseUrl}/classroom/blackListStudent`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, classroomId }),
      });
      const data = await response.json();
      if (data.success) {
        console.log('The student has been blackListed');
        window.location.href = `/groups/${classCode}/home`;
      } else {
        console.log('Error when removing classroom');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleConfirmClick = async () => {
    if (index === 0) {
      await handleDelete();
    } else if (index === 1) {
      await leaveClass();
    } else if (index === 2) {
      await saveChanges();
    } else if (index === 3) {
      await removeStudent();
    } else return;
  };

  const addSeatToClass = async (seatsToAdd) => {
    try {
      const url = `${baseUrl}/classroom/add-seat`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pricingPlan, classroomId, seatsToAdd }),
      });
      const data = await response.json();
      if (data.success) {
        if (data.sessionId) {
          const stripe = await loadStripe(STRIPE_KEY);
          await stripe.redirectToCheckout({ sessionId: data.sessionId });
        } else {
          console.log('Seat has been updated');
          window.location.href = `/groups/${classCode}/home`;
        }
      } else {
        console.log('Error when adding seat');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const saveChanges = async () => {
    try {
      const reqBody = {
        classCode: classCode,
        nameOfClassroom: nameOfClassroom,
        org: emailDomain,
        openStatus: isOpen === 'open',
        description,
        weights,
      };
      const url = `${baseUrl}/classroom/save`;
      const token = localStorage.getItem('idToken');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(reqBody),
      });
      const data = await response.json();
      if (data.success) {
        console.log('The class has been updated');
        const newNumberOfSeats = parseInt(numberOfSeats);
        console.log(newNumberOfSeats);
        if (originalNumberOfSeats < newNumberOfSeats) {
          const seatsToAdd = newNumberOfSeats - originalNumberOfSeats;
          await addSeatToClass(seatsToAdd);
        } else {
          window.location.href = `/groups/${classCode}/home`;
        }
      } else {
        window.location.replace('/login');
      }
    } catch (err) {
      console.log(err);
    }
  };

  function copy(tags) {
    var copyText = document.getElementById(tags);
    copyText.type = 'text';
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
    copyText.type = 'hidden';

    toast.success('Copied to clipboard!', {
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
  }

  return (
    <>
      <Head>
        <title>Coming Soon - CTFGuide</title>
        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
        </style>
      </Head>
      <StandardNav />
      <div className="bg-neutral-800">
        <div className=" mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-10 justify-between">
            {classroom && <ClassroomNav classCode={group} />}
            <div className="flex items-center">
              <button
                onClick={() => {
                  setViewCreateAssignment(true);
                  // (window.location.href = `/groups/${classroom.classCode}/${uid}/create-assignment`)
                }}
                className="rounded-lg bg-neutral-800/80 px-4 py-0.5 text-white "
              >
                <i className="fas fa-plus-circle pe-2"></i> New Assignment
              </button>

            </div>
          </div>
        </div>
      </div>
      <div id="general" className="">
        <div className="mx-auto flex max-w-6xl">
          <div className="flex-1 xl:overflow-y-auto">
            <div className="max-w-4.5xl mx-auto px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
              <div className="flex">
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  Classroom Settings
                </h1>

                <div className="ml-auto">
                  <button
                    onClick={() =>
                      (window.location.href = `/groups/${classCode}/home`)
                    }
                    className=" rounded-lg bg-blue-600 px-2 py-1 text-white hover:bg-blue-600/50"
                    style={{
                      fontSize: '15px',
                    }}
                  >
                    <i
                      className="fa fa-arrow-left"
                      style={{ color: 'white' }}
                    ></i>{' '}
                    Back
                  </button>
                </div>
              </div>

              <div className="mt-6 space-y-8 ">
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
                  <div className="sm:col-span-6">
                    <h2 className="text-xl font-medium text-white">
                      Payed by {pricingPlan}
                    </h2>
                    <p className="mt-1 text-sm text-white">
                      All changes will be applied after clicking the save button
                    </p>
                  </div>

                  <div className="sm:col-span-6">
                    <div className="mx-auto mb-4  text-center">
                      <p className="mt-3 text-white">
                        Invite students to your group by sharing the join code.
                      </p>
                      <div className="mx-auto mt-2 flex w-1/3 rounded-lg bg-neutral-800 p-2 ">
                        <p
                          className="mx-auto text-center text-white"
                          style={{ fontSize: '20px' }}
                        >
                          {classCode}{' '}
                          <i
                            onClick={() => copy('copyBox')}
                            className="far fa-copy cursor-pointer text-white hover:text-neutral-400"
                          ></i>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="number-of-seats"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Number of seats
                    </label>
                    <input
                      type="number"
                      autoComplete="off"
                      value={numberOfSeats}
                      onChange={handleNumberOfSeats}
                      className="mt-2 block w-full rounded-md border-none bg-neutral-800 py-1.5 text-white shadow-sm sm:text-sm sm:leading-6"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="number-of-seats"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Name of classroom
                    </label>
                    <input
                      autoComplete="off"
                      value={nameOfClassroom}
                      onChange={(e) => setNameOfClassroom(e.target.value)}
                      className="mt-2 block w-full rounded-md border-none bg-neutral-800 py-1.5 text-white shadow-sm sm:text-sm sm:leading-6"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="classroom-status"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Classroom status
                    </label>
                    <select
                      value={isOpen}
                      onChange={(e) => setIsOpen(e.target.value)}
                      id="classroom-status"
                      className="mt-2 block w-full rounded-md border-none bg-neutral-800 py-1.5 text-white shadow-sm sm:text-sm sm:leading-6"
                    >
                      <option value="open">open</option>
                      <option value="close">close</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="number-of-seats"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Email Domain
                    </label>
                    <input
                      autoComplete="off"
                      value={emailDomain}
                      onChange={(e) => setEmailDomain(e.target.value)}
                      className="mt-2 block w-full rounded-md border-none bg-neutral-800 py-1.5 text-white shadow-sm sm:text-sm sm:leading-6"
                    />
                  </div>

                  <div className="sm:col-span-6">
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Invite a Teacher
                    </label>
                    <div className="mt-2 flex rounded-md shadow-sm">
                      <input
                        name="username"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        id="username"
                        placeholder="johnDoe@ctfguide.com"
                        className="block w-full rounded-md border-none bg-neutral-800  py-1.5 text-white shadow-sm  sm:text-sm sm:leading-6"
                      />
                      <button
                        className="ml-4 rounded-lg bg-blue-600 px-2 py-1 text-white hover:bg-blue-600/50"
                        onClick={handleInviteLink}
                      >
                        invite
                      </button>
                    </div>
                    <div className="mt-2 flex rounded-lg bg-black p-2">
                      <p
                        className="text-white"
                        style={{
                          fontSize: '15px',
                          color: inviteActivated ? 'white' : 'gray',
                        }}
                      >
                        {inviteLink}
                      </p>
                      <div className="ml-auto">
                        <i
                          onClick={() => copy('copyBox2')}
                          className="far fa-copy cursor-pointer text-white hover:text-neutral-400"
                        ></i>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Classroom Description
                    </label>
                    <div className="mt-2">
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        id="bio"
                        name="bio"
                        rows={6}
                        className="block w-full rounded-md border-0 border-none bg-neutral-800 text-white shadow-sm  placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:py-1.5 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <p className="mt-3 text-sm text-white">
                      Brief description for your classroom.
                    </p>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="classroom-status"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => {
                        let t = e.target.value;
                        setCategory(t);
                        setWeightIdx(categoryToIdx[t]);
                      }}
                      id="classroom-status"
                      className="mt-2 block w-full rounded-md border-none bg-neutral-800 py-1.5 text-white shadow-sm sm:text-sm sm:leading-6"
                    >
                      <option value="test">test</option>
                      <option value="quiz">quiz</option>
                      <option value="homework">homework</option>
                      <option value="assessment">assessment</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="number-of-seats"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Weight
                    </label>
                    <input
                      autoComplete="off"
                      type="number"
                      value={weights[weightIdx]}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        let tmpWeights = [...weights];
                        tmpWeights[weightIdx] = val;
                        setWeights(tmpWeights);
                      }}
                      className="mt-2 block w-full rounded-md border-none bg-neutral-800 py-1.5 text-white shadow-sm sm:text-sm sm:leading-6"
                    />
                  </div>

                  <div style={{ width: '700px' }}>
                    <div>
                      <h1 className="text-xl text-white"> Students: </h1>
                      <div style={{ display: 'flex' }}>
                        <input
                          type="text"
                          value={searchInput}
                          onChange={(e) => setSearchInput(e.target.value)}
                          placeholder="Search for Student..."
                          className="mt-2 block w-full rounded-md border-none bg-neutral-800 py-1.5 text-white shadow-sm sm:text-sm sm:leading-6"
                        />
                      </div>
                      <br></br>
                      <div className="grid grid-cols-5 gap-x-4 gap-y-2">
                        {filteredOptions.map((student, idx) => {
                          const i = idx % defaultImages.length;
                          return (
                            <div
                              key={idx}
                              style={{
                                width: '140px',
                                border:
                                  selectedStudent &&
                                  selectedStudent.username === student.username
                                    ? '2px solid lightblue'
                                    : '',
                              }}
                              className="flex items-center rounded-lg bg-neutral-900"
                              onClick={() => setSelectedStudent(student)}
                            >
                              <img
                                src={defaultImages[i]}
                                className="ml-1 h-8 w-8 "
                              ></img>{' '}
                              <h3
                                className="ml-3 mt-2 pl-1 text-white"
                                style={{ marginLeft: '-5px' }}
                              >
                                {student.username}
                              </h3>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <Transition.Root show={showOverlay} as={Fragment}>
                  <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    onClose={setShowOverlay}
                  >
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div
                        onClick={() => setShowOverlay(false)}
                        className="z-2 fixed inset-0 bg-black bg-opacity-75 transition-opacity"
                      />
                    </Transition.Child>
                    <div className="flex min-h-screen items-center justify-center">
                      <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                      >
                        <div
                          style={{
                            fontFamily: 'Poppins, sans-serif',
                            backgroundColor: '#161716',
                          }}
                          className="  transform  overflow-hidden rounded-lg bg-neutral-700 px-40 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:align-middle "
                        >
                          <div className="w-full">
                            <div
                              className="mx-auto mt-3 text-center sm:mt-5"
                              style={{ width: '350px' }}
                            >
                              <h2 className="text-center text-xl text-white">
                                {messageOfConfirm}
                              </h2>
                              <br></br>
                              <div className="mx-auto mt-4 w-full pb-5 text-center">
                                <button
                                  onClick={handleConfirmClick}
                                  className="rounded-lg bg-neutral-800 px-4 py-2 text-white hover:bg-neutral-600/50"
                                >
                                  {' '}
                                  Confirm{' '}
                                </button>
                                <button
                                  onClick={() => {
                                    setShowOverlay(false);
                                  }}
                                  className="ml-4 rounded-lg bg-neutral-800 px-4 py-2 text-white hover:bg-neutral-600/50"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Transition.Child>
                    </div>
                  </Dialog>
                </Transition.Root>

                <button
                  onClick={() => {
                    setShowOverlay(true);
                    setMessageOfConfirm(actions[2]);
                    setIndex(2);
                  }}
                  className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Save
                </button>

                <button
                  onClick={() => {
                    setShowOverlay(true);
                    setMessageOfConfirm(actions[3]);
                    setIndex(3);
                  }}
                  style={{
                    marginLeft: '25%',
                    opacity: selectedStudent === null && '0.5',
                  }}
                  disabled={selectedStudent === null}
                  className="ml-4 rounded-lg bg-pink-600 px-2 py-1 text-white hover:bg-pink-600/50"
                >
                  Blacklist{' '}
                  {selectedStudent ? selectedStudent.username : 'student'}
                </button>

                <button
                  onClick={() => {
                    setShowOverlay(true);
                    setMessageOfConfirm(actions[1]);
                    setIndex(1);
                  }}
                  className="ml-4 rounded-lg bg-yellow-600 px-2 py-1 text-white hover:bg-yellow-600/50"
                >
                  Leave class
                </button>

                <button
                  onClick={() => {
                    setShowOverlay(true);
                    setMessageOfConfirm(actions[0]);
                    setIndex(0);
                  }}
                  className="ml-4 rounded-lg bg-red-600 px-2 py-1 text-white hover:bg-red-600/50"
                >
                  Delete class
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <input type="hidden" id="copyBox" value={classCode || ''}></input>
      <input type="hidden" id="copyBox2" value={inviteLink || ''}></input>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <Footer />
    </>
  );
}