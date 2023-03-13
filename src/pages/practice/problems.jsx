import Head from 'next/head'
import Link from 'next/link'
import React, { useState, useEffect } from "react";
import { Button } from '@/components/Button'
import { TextField } from '@/components/Fields'
import { Logo } from '@/components/Logo'
import { Alert } from '@/components/Alert'
import { Container } from '@/components/Container'
import { StandardNav } from '@/components/StandardNav'
import { Footer } from '@/components/Footer'
import { PracticeNav } from '@/components/practice/PracticeNav'
import { Community } from '@/components/practice/community'
import { ProblemSetCards } from '@/components/practice/GoToCreate'
import ProblemSet from '@/components/practice/ProblemSet'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { KeyIcon, LockOpenIcon } from '@heroicons/react/24/outline'

export default function ProblemsPage() {
    const [components, setComponents] = useState([]);
    const set = [
        {
            name: "Cryptography", 
            description: "Cryptography deals with algorithms to secure info. Encryption/decryption are the foundation of cybersecurity."
        },
        {
            name: "Forensics", 
            description: "Sometimes, secrets are hidden in plain site. Can you crack these challenges?"
        },
        {
            name: "Web", 
            description: "Cryptography deals with algorithms to secure info. Encryption/decryption are the foundation of cybersecurity."
        },
        {
            name: "Cryptography", 
            description: "Cryptography deals with algorithms to secure info. Encryption/decryption are the foundation of cybersecurity."
        }
    ];

    useEffect(() => {
        fetch("https://api.ctfguide.com/challenges/type/all")
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            setComponents(data);
        })
        .catch((error) => {
            console.error(error);
        });
    }, []);

    const filterData = (category) => {
        return components.filter(component => {
            return component.category.toLowerCase().includes(category.toLowerCase())
        });
    }

    return (
        <>
            <Head>
                <title>Problem Sets - CTFGuide</title>
                <meta
                    name="description"
                    content="Practice Problems"
                />
                <style>
                    @import url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
                </style>
            </Head>
            <StandardNav />
            <main>
                <div className="w-full " style={{ backgroundColor: "#212121" }}>
                    <div className="flex mx-auto text-center h-28 my-auto">
                        <h1 className='text-4xl text-white mx-auto my-auto font-semibold'>Problem Sets</h1>
                    </div>
                </div>
                <div className="flex">
                    <div className="flex h-screen max-w-7xl mx-auto">
                        <PracticeNav />
                    </div>
                    <div className='w-3/4'>
                        <div className='w-3/4'>
                            <ProblemSetCards />
                        </div>
                        {set.map(setInfo => (
                            <div className="w-4/5 rounded-lg overflow-hidden shadow-lg mb-16" style={{ backgroundColor: "#212121" }}>
                                <h2 className="mt-8 text-center text-3xl font-bold tracking-tight text-white">{setInfo.name}</h2>
                                <p className="text-gray-300 text-center mt-2">{setInfo.description}</p>
                                <div className="container mx-auto py-8">
                                    <ProblemSet data={filterData(setInfo.name)}/>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
