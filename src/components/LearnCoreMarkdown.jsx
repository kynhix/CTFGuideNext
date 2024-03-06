import { MarkDone } from '@/components/learn/MarkDone';
import { FlagIcon } from '@heroicons/react/20/solid';
import 'xterm/css/xterm.css';
import { useEffect, useState } from 'react';
import { MarkdownViewer } from './MarkdownViewer';

export function LearnCoreMarkdown({ title, pages = ['string'] }) {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [curPageIndex, setCurPageIndex] = useState(0);

  if (!Array.isArray(pages)) {
    pages = [pages];
  }

  useEffect(() => {
    let term = undefined;
    const initTerminal = async () => {
      const { Terminal } = await import('xterm')
      term = new Terminal({
        cursorBlink: true,
      })
      term.open(document.getElementById('terminal'));
      term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ');
    }
    initTerminal();

    return () => {
      if (term) {
        term.dispose();
      }
    };
  }, [])

  return (
    <div className="relative h-full overflow-hidden w-full min-h-[500px]">
      <div className="flex h-24 items-center px-7 py-4 pb-7 bg-zinc-800 border-b border-neutral-700">
        <h1 className="text-neutral-50 mt-3 flex text-2xl">
          {title}
          <FlagIcon className="mt-1 ml-2 h-6 text-blue-500" />
        </h1>
        <div className="ml-auto mt-3 flex gap-2">
          <MarkDone sublesson={4} section={1} href={'../'} />
          <a
            href="../"
            className="text-red-50 bg-red-700 hover:bg-red-800 hover:bg-blue-800/100 px-4 py-1 text-xl"
          >
            Exit Lab
          </a>
        </div>
      </div>
      <div className="flex h-[calc(100%_-_6rem)] w-full gap-0">
        <div className='bg-neutral-800 pb-12 h-full w-1/2 overflow-y-auto relative'>
          <MarkdownViewer className='text-gray-50 p-4' content={pages[curPageIndex]} />
        </div>
        <div className="flex flex-col h-full w-1/2 p-2 overflow-hidden bg-neutral-950">
          <div className="flex w-full shrink grow-0 text-sm pb-2 text-white">
            <p className="">
              <span className="text-green-400">◉</span> Connected to
              terminal.ctfguide.com
            </p>
            <div className="ml-auto flex text-ellipsis">
              <p className='text-ellipsis'>No time limit!</p>
            </div>
          </div>
          <div className='bg-black self-stretch grow'>
            <div id="terminal"></div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-1 left-0 right-0">
        <div className="mt-4 flex">
          <div className="mx-auto flex rounded-lg bg-zinc-700 text-center">
            <button
              className="w-10 rounded-l-lg py-3 px-10 hover:bg-zinc-600"
              onClick={() => curPageIndex != 0 && setCurPageIndex(curPageIndex - 1)}
            >
              <a className="text-white">
                <i class="fas fa-chevron-left"></i>
              </a>
            </button>
            <button
              className="w-10 rounded-r-lg py-3 px-10 hover:bg-zinc-600"
              onClick={() => curPageIndex != pages.length - 1 && setCurPageIndex(curPageIndex + 1)}
            >
              <a className="text-white">
                <i class="fas fa-chevron-right"></i>
              </a>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
