import React from 'react';
import { MarkdownViewer } from "@/components/MarkdownViewer";
import { useState, useEffect } from 'react';

const Editor = (slug) => {

    const styles = {
        h1: { fontSize: '2.4rem' },
        h2: { fontSize: '2rem' },
        h3: { fontSize: '1.8rem' },
        h4: { fontSize: '1.6rem' },
        h5: { fontSize: '1.4rem' },
        h6: { fontSize: '1.2rem' },
    };
    const [activeTab, setActiveTab] = useState('created');
    const [contentPreview, setContentPreview] = useState("");

    const [username, setUsername] = useState('anonymous');
    useEffect(() => {
        setUsername(localStorage.getItem('username'));
    });
    function handleTabClick(tab) {
        setActiveTab(tab);
    }

    function uploadChallenge() {
        // stop complaining
    }

    useEffect(() => {
        // request challenge data based of slug passed in prop
        
        var requestOptions = {
            method: 'GET'
        };

        fetch("http://localhost:3001/challenges/" + slug, requestOptions)

            .then(response => response.json()) // assuming the response is JSON
            .then(result => {
                console.log(result.result);
                document.getElementById('challengeName').value = result.result.title;
                document.getElementById('challengeName2').innerText = result.result.title;
                document.getElementById('content').value = result.result.content;
                document.getElementById('solution').value = result.result.solution;
                document.getElementById('hint1').value = result.result.hint1;
                document.getElementById('hint2').value = result.result.hint2;
                document.getElementById('hint3').value = result.result.hint3;
                document.getElementById('difficulty').value = result.result.difficulty;
                document.getElementById('category').value = result.result.category;
                setContentPreview(result.result.content);
            })
            .catch(error => console.log('error', error));
    }
        , []); // Added an empty dependency array to prevent infinite requests

   



    return (
        <div>
            <div
                id="createChallenges"
                className="mx-auto mt-10 max-w-7xl text-white"
            >
                {/*/ Create a new challenge */}

                <input
                    id="challengeName"
                    onChange={event => {
                        console.log(event.target.value);
                        document.getElementById('challengeName2').innerText = event.target.value;
                    }
                    }

                    className="w-3/4 rounded-lg shadow-lg bg-neutral-900/90  border border-neutral-600 py-2 px-4 text-3xl font-semibold text-white"
                    placeholder='Untitled Challenge'
                />

                <div className='mt-4'>
                    <i className="fas fa-code-branch"></i> You are forking <span className="mt-4 font-semibold text-blue-500">Untitled Challenge</span>
                </div>

                <div id="error" className="hidden mt-4 bg-red-500 rounded-md px-4 py-1">
                    Something went wrong on our end. Your changes have not been saved. You can try again now or later.

                </div>

                <div className=" hidden mt-4 flex flex-shrink-0">
                    <div className='w-full'>
                        <h1>Difficulty</h1>
                        <select
                            id="difficulty"
                            name="difficulty"
                            className="mt-1 mb-4  w-1/3 rounded-md border-neutral-600 bg-neutral-900/90 py-2 pl-3 pr-20 text-base  text-white  focus:outline-none sm:text-sm"
                            defaultValue="easy"
                        >
                            <option value="beginner">Beginner</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                            <option value="insane">Insane</option>

                        </select>
                    </div>
                    <div className='w-full'>
                        <h1>Category</h1>
                        <select
                            id="category"
                            name="category"
                            className="ml-4 mt-1 mb-4  w-1/3 rounded-md border-neutral-600  bg-neutral-900/90 py-2 pl-3 pr-20  text-base  text-white  focus:outline-none sm:text-sm"
                            defaultValue="forensics"
                        >
                            <option value="forensics">forensics</option>
                            <option value="cryptography">cryptography</option>
                            <option value="web">web</option>
                            <option value="reverse engineering">reverse engineering</option>
                            <option value="programming">programming</option>
                            <option value="pwn">pwn</option>
                            <option value="basic">basic</option>

                            <option value="other">other</option>
                        </select>
                    </div>
                </div>


                <div className='grid grid-cols-2 gap-x-4'>
                    <div
                        className="mt-5 rounded-sm shadow-lg border border-gray-900 bg-neutral-800/40  shadow-lg ring-1 ring-black ring-opacity-5">
                        <h3 className=" rounded-t-lg bg-blue-800 px-4 py-1.5 text-xl font-medium leading-6 text-white">
                            Challenge Content
                        </h3>
                        <div className="px-5 py-5 ">



                            <dt className="truncate text-xl font-medium text-white">
                                Challenge Instructions
                            </dt>
                            <textarea
                                id="content"
                                placeholder="You can use Markdown here! "

                                className="h-40 mt-2 w-full rounded-lg shadow-lg bg-neutral-900 border-neutral-800 px-5 py-4 text-white"
                                onChange={event => {
                                    console.log(event.target.value);
                                    setContentPreview(event.target.value);
                                }}
                            ></textarea>

                            <div className=" py-5">
                                <dt className="truncate text-xl font-medium text-white">
                                    Hint 1
                                </dt>
                                <textarea
                                    id="hint1"
                                    placeholder="No hint set"
                                    className="mt-1 w-full rounded-lg shadow-lg border-neutral-800 bg-neutral-900 text-white"
                                >

                                </textarea>

                                <dt className="mt-4 truncate text-xl font-medium text-white">
                                    Hint 2
                                </dt>
                                <textarea id="hint2"
                                    placeholder="No hint set"

                                    className="mt-1 w-full rounded-lg shadow-lg border-neutral-800 bg-neutral-900   text-white"></textarea>

                                <dt className="mt-4 truncate text-xl font-medium text-white">
                                    Hint 3
                                </dt>
                                <textarea id="hint3"
                                    placeholder="No hint set"

                                    className="mt-1 w-full rounded-lg shadow-lg border-neutral-800 bg-neutral-900  text-white">
                                </textarea>
                            </div>
                        </div>
                    </div>

                    <div
                        className="mt-5 rounded-sm shadow-lg border border-gray-900 bg-neutral-800/40  shadow-lg ring-1 ring-black ring-opacity-5">
                        <h3 className=" rounded-t-lg bg-blue-800 px-4 py-1.5 text-xl font-medium leading-6 text-white">
                            Challenge Content Preview
                        </h3>
                        <div className=" w-full py-10 " style={{
                            backgroundSize: "cover",
                            backgroundImage: 'url("https://images.unsplash.com/photo-1633259584604-afdc243122ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80")'
                        }}
                        >
                            <div className="mx-auto my-auto flex  text-center">
                                <h1 className="mx-auto my-auto text-4xl font-semibold text-white" id="challengeName2">
                                    {' '}
                                    Untitled Challenge{' '}
                                </h1>
                            </div>
                            <div className="mx-auto my-auto  text-center text-lg text-white">
                                <div className="my-auto flex place-items-center justify-center">
                                    <p className="my-auto mr-2 text-sm">Created by</p>
                                    <img
                                        className="my-auto my-auto mr-2 h-6   w-6  rounded-full bg-neutral-900"
                                        src={`https://robohash.org/` + username + `.png?set=set1&size=150x150`}
                                        alt=""
                                    />
                                    <p className="my-auto text-sm">{username}</p>
                                </div>
                            </div>
                        </div>
                        <div className="px-5 py-5 ">
                            <div contentEditable={false}>
                                <MarkdownViewer content={contentPreview} />
                            </div>
                        </div>
                    </div>

                </div>


                <div className="mt-5 rounded-sm shadow-lg   900 bg-neutral-800/40">
                    <h3 className="mt-6 rounded-t-lg bg-blue-800 px-4 py-1.5 text-xl font-medium leading-6 text-white">
                        Challenge Solution
                    </h3>
                    <div className="px-5 py-5">
                        <textarea id="solution"

                            placeholder="Not having a solution, is a different kinda evil."
                            className="mt-1 w-full rounded-lg shadow-lg border-neutral-800 bg-neutral-900 text-white"
                        >
                        </textarea>
                    </div>
                </div>

                <button
                    onClick={uploadChallenge}
                    className="mr-2 mt-6 rounded-lg shadow-lg border-green-600 bg-green-900 px-4 py-2 text-2xl text-white hover:bg-green-800"
                >
                    <i class="fas fa-send"></i> Create Challenge
                </button>

                <button
                    className="mr-2 mt-6 hidden rounded-sm shadow-lg border-blue-600 bg-blue-700 px-4 py-2 text-2xl text-white hover:bg-blue-800">
                    <i class="fas fa-save"></i> Save as draft
                </button>
            </div>

            <div
                id="saved"
                aria-live="assertive"
                className="pointer-events-none fixed inset-0 flex hidden items-end px-4 py-6 sm:items-start sm:p-6"
            >
                <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
                    <div
                        className="pointer-events-auto w-full  max-w-sm overflow-hidden rounded-sm shadow-lg border border-gray-700 shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="p-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-6 w-6 text-green-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3 w-0 flex-1 pt-0.5">
                                    <p className="text-sm font-medium text-white">
                                        All changes saved
                                    </p>
                                    <p className="mt-1 text-sm text-gray-300">
                                        It may take a few minutes for your changes to be visible.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Editor;