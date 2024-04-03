import React from 'react';
import { Tooltip } from 'react-tooltip';
import { CardDecorator } from '../design/CardDecorator';
import Link from 'next/link';

const ChallengeCard = ({ id, title, category, difficulty = 'BEGINNER', createdAt, creator, views, likes }) => {

  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;
  const dateFormatted = new Date(createdAt)
    .toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });

  const colorBG = {
    'BEGINNER': 'group-hover:bg-blue-500',
    'EASY': 'group-hover:bg-green-500',
    'MEDIUM': 'group-hover:bg-orange-500',
    'HARD': 'group-hover:bg-red-500',
    'INSANE': 'group-hover:bg-purple-500',
  };
  const colorText = {
    'BEGINNER': 'bg-blue-500 text-blue-50',
    'EASY': 'bg-green-500 text-green-50',
    'MEDIUM': 'bg-orange-500 text-orange-50',
    'HARD': 'bg-red-500 text-red-50',
    'INSANE': 'bg-purple-500 text-purple-50',
  };
  // Override for now
  // color = 'text-neutral-300';

  return (
    <Link className={`bg-neutral-800 group border border-white/10 hover:bg-stone-700 max-w-md rounded-sm card-container shadow-sm transition-colors shadow-black/20`} href={`${baseUrl}/challenges/${id}`}>
      <CardDecorator position='left' className={`${colorBG[difficulty]} w-2 transition-colors`}></CardDecorator>
      <div className="pl-8 pr-6 py-4 text-sm leading-8 text-gray-300">
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        <h1 className="text-base text-neutral-400 line-clamp-1">Created by {creator}</h1>
        <h1 className={`text-base px-2 mb-1 leading-6 font-bold capitalize w-fit rounded-sm text-neutral-50 ${colorText[difficulty]}`}>{difficulty.toLowerCase()}</h1>
        <div className="flex justify-between">
          <p className="text-neutral-400 flex">
            <i class="text-lg mt-[5px] mr-2 fas fa-solid fa-calendar"></i>
            {dateFormatted}
          </p>
          <p className="flex text-neutral-200 opacity-70 items-center text-sm">
            <i class="fas fa-solid fa-eye mr-2 text-lg"></i>
            {views}
            <i class="ml-4 mr-2 text-neutral-300 fas fa-solid fa-heart text-lg"></i>
            {likes}
          </p>
        </div>
      </div>
    </Link >
  )
};

export default ChallengeCard;
