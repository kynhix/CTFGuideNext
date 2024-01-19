import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { useEffect, useState } from 'react';
import LoadingBar from 'react-top-loading-bar';
import ClassroomNav from '@/components/groups/classroomNav';
import { useRouter } from 'next/router';
import CreateAssignment from '@/components/groups/assignments/createAssignment';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const StudentGradebook = () => {

    const [student, setStudent] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [classCode, setClassCode] = useState('');
    const [classroom, setClassroom] = useState({});
    const [progress, setProgress] = useState(0);



    const router = useRouter();
    const { group } = router.query;


    const getStudentSubmissions = async (userId, classroomId) => {
        try {
            const url = baseUrl +
                '/submission/getStudentSubmissions/' +
                userId + '/' +
                classroomId;
            var requestOptions = {
                method: 'GET',
            };
            const response = await fetch(url, requestOptions);
            const data = await response.json();
            if (data.success) {
                setSubmissions(data.body);
            };

        } catch (err) {
            console.log(err);
        }

    };


    const getStudentFinalGrade = async (userId, classroomId) => {


    };

    const getAssignments = async () => {
        try {
            const classCode = window.location.href.split("/")[4];
            setClassCode(classCode);
            var requestOptions = {
                method: 'GET',
            };
            const response = await fetch(
                `${baseUrl}/classroom/classroom-by-classcode?classCode=${classCode}`,
                requestOptions
            );
            const data = await response.json();
            if (data.success) {
                setAssignments(data.body.assignments);
                await getStudentsSubmissionsFinalGrades(data.body.id);
            } else {
                console.log(data);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <Head>
                <title>Gradebook - CTFGuide</title>
                <style>
                    @import
                    url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
                </style>
            </Head>
            <StandardNav />
            <LoadingBar
                color="#0062ff"
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />
            <div className="bg-neutral-800">
                <div className=" mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-10 justify-between">
                        {classroom && <ClassroomNav classCode={group} />}
                        <div className="flex items-center">
                            <button
                                onClick={() => {
                                    setViewCreateAssignment(true);
                                }}
                                className="rounded-lg bg-neutral-800/80 px-4 py-0.5 text-white "
                            >
                                <i className="fas fa-plus-circle pe-2"></i> New Assignment
                            </button>

                        </div>
                    </div>
                </div>
            </div>
            <div className="mx-auto mt-10 max-w-6xl">
                <div className="flex">
                    <h1 className="text-3xl font-semibold text-white">Gradebook</h1>
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
                            <i className="fa fa-arrow-left" style={{ color: 'white' }}></i>{' '}
                            Back
                        </button>
                    </div>
                </div>
                <div class="mx-auto mt-4 flex items-center justify-center rounded-sm pb-10 text-white">
                    <table class="min-w-full divide-y divide-neutral-700">
                        <thead class="rounded-sm bg-neutral-800">
                            <tr>
                                <th
                                    scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500"
                                >
                                    Student
                                </th>
                                {assignments.map((assignment) => (
                                    <th
                                        key={assignment.id}
                                        scope="col"
                                        class="cursor-pointerpx-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500"
                                    >
                                        {assignment.name}
                                    </th>
                                ))}
                                <th
                                    scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500"
                                >
                                    Final Grade
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {student.map((student, index) => (
                                <tr key={index} class="bg-neutral-800 hover:bg-neutral-700">
                                    <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">
                                        {student.name}
                                    </td>
                                    {assignments.map((assignment) => (
                                        <td
                                            key={assignment.id}
                                            class={`whitespace-nowrap px-6 py-4 text-sm ${student[assignment.name].grade === null
                                                    ? 'text-yellow-400'
                                                    : 'text-green-400'
                                                }`}
                                        >
                                            {student[assignment.name].grade === null
                                                ? 'N/A'
                                                : `${student[assignment.name].grade}/${student[assignment.name].total
                                                }`}
                                        </td>
                                    ))}
                                    <td class="whitespace-nowrap px-6 py-4 text-sm text-white">
                                        {student.finalGrade === null
                                            ? 'N/A'
                                            : `${student.finalGrade}%`}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Footer />
        </>
    )

};



export default StudentGradebook;