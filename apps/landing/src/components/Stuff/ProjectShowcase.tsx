'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import cn from 'classnames';
import {
  FiArrowRight,
  FiArrowUpRight,
  FiExternalLink,
  FiGithub,
  FiX,
} from 'react-icons/fi';

import { ProjectImageCarousel } from '~/components/Stuff/ProjectImageCarousel';
import ProjectShaderCanvas from '~/components/Stuff/ProjectShaderCanvas';
import { useFocusTrap } from '~/components/Stuff/useFocusTrap';
import { useProjectModalController } from '~/components/Stuff/useProjectModalController';

type ProjectImage = {
  src: string;
  alt: string;
};

export type Project = {
  title: string;
  description: string;
  why: string;
  what: string;
  useCases: string[];
  status: string;
  accent: string;
  details: string[];
  stack: string[];
  images: ProjectImage[];
  githubUrl: string;
  liveUrl?: string;
};

const projects: Project[] = [
  {
    title: 'Iframe Test',
    description:
      'A focused tool for testing iframe behavior with dimensions, permissions, sandbox settings, and quick presets.',
    why:
      'Iframe issues are annoying because they mix browser security, layout, permissions, and third-party page behavior. I wanted a quick place to test those combinations without repeatedly writing throwaway HTML.',
    what:
      'The tool lets you enter a URL, choose viewport dimensions, configure iframe attributes, and preview how the embedded page behaves under different constraints.',
    useCases: [
      'Checking whether a third-party page can be embedded before wiring it into a product.',
      'Testing responsive iframe sizes across mobile, tablet, desktop, and full-width presets.',
      'Debugging sandbox, permission, and rendering behavior in one focused interface.',
    ],
    status: 'Live',
    accent: 'from-[#12b5e5] via-[#3B82F6] to-[#7b5ea7]',
    details: ['Iframe testing', 'Security settings', 'Responsive preview'],
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Vercel'],
    images: [
      {
        src: '/images/stuff/iframe-test/home.png',
        alt: 'Iframe Test desktop interface',
      },
      {
        src: '/images/stuff/iframe-test/mobile.png',
        alt: 'Iframe Test mobile interface',
      },
    ],
    githubUrl: 'https://github.com/foxy17',
    liveUrl: 'https://testmyiframe.in/',
  },
  {
    title: 'Portfolio System',
    description:
      'My personal site, built as a monorepo with a Next.js landing app and an Astro writing app sharing the same product feel.',
    why:
      'I wanted my portfolio, writing, and experiments to live together without forcing everything into one framework or a heavy CMS.',
    what:
      'The monorepo keeps the Next.js landing site and Astro blog separate, while shared styling and package boundaries keep the whole thing feeling like one product.',
    useCases: [
      'Showing current work, links, and personality on a fast landing page.',
      'Publishing technical writing without coupling the blog to the main app.',
      'Trying small UI and content ideas in a structure that can grow over time.',
    ],
    status: 'Live',
    accent: 'from-[#7b5ea7] via-[#12b5e5] to-[#0ba95b]',
    details: ['Next.js', 'Astro', 'Monorepo'],
    stack: ['Next.js', 'Astro', 'React', 'Tailwind CSS', 'Turborepo'],
    images: [
      {
        src: '/images/stuff/portfolio-system/home.png',
        alt: 'Portfolio desktop home page',
      },
      {
        src: '/images/stuff/portfolio-system/mobile.png',
        alt: 'Portfolio mobile home page',
      },
    ],
    githubUrl: 'https://github.com/foxy17/Portfolio-v2',
    liveUrl: '/',
  },
];

const techStackFilters = [
  'All',
  ...Array.from(new Set(projects.flatMap((project) => project.stack))).sort(),
];

function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: (project: Project) => void;
}) {
  return (
    <article className="group relative h-full cursor-pointer rounded-xl">
      <span
        className="absolute inset-0 z-0 rounded-xl border-2 border-dashed border-black dark:border-white"
        aria-hidden="true"
      />
      <div
        className={cn(
          'relative z-10 h-full rounded-xl bg-linear-to-r p-1 transition-all duration-300 group-hover:-translate-x-2 group-hover:-translate-y-2',
          project.accent,
        )}
      >
        <button
          type="button"
          onClick={() => onOpen(project)}
          className="relative flex h-full min-h-72 w-full cursor-pointer flex-col justify-between overflow-hidden rounded-lg bg-beige p-5 text-left text-dark-grey outline-hidden transition focus-visible:ring-4 focus-visible:ring-flat-blue dark:bg-dark-black dark:text-beige"
          aria-haspopup="dialog"
        >
          <ProjectShaderCanvas
            variant="card"
            className="opacity-55 transition-opacity duration-300 group-hover:opacity-95 dark:opacity-75 dark:group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-linear-to-br from-beige via-beige/85 to-beige/70 dark:from-dark-black dark:via-dark-black/82 dark:to-dark-black/68" />
          <div className="relative z-10">
            <div className="mb-5 flex items-center justify-between gap-4">
              <span className="rounded-md border-2 border-black bg-white px-3 py-1 text-sm font-semibold text-dark-grey dark:border-white dark:bg-dark-grey dark:text-beige">
                {project.status}
              </span>
              <FiArrowUpRight className="shrink-0 text-2xl transition group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
            <h3 className="mb-4 break-words font-paytone text-3xl leading-none text-black! dark:text-white! sm:text-[2.5rem]">
              {project.title}
            </h3>
            <p className="text-lg leading-7 text-gray-700 dark:text-gray-300">
              {project.description}
            </p>
          </div>
          <ul className="relative z-10 mt-8 flex flex-wrap gap-2">
            {project.details.map((detail) => (
              <li
                key={detail}
                className="rounded-md bg-white/90 px-3 py-1 text-sm font-semibold text-gray-700 backdrop-blur-sm dark:bg-dark-grey/90 dark:text-gray-200"
              >
                {detail}
              </li>
            ))}
          </ul>
        </button>
      </div>
    </article>
  );
}

function ProjectModal({
  project,
  imageIndex,
  isVisible,
  onClose,
  onNextImage,
  onPreviousImage,
  onSelectImage,
}: {
  project: Project | null;
  imageIndex: number;
  isVisible: boolean;
  onClose: () => void;
  onNextImage: () => void;
  onPreviousImage: () => void;
  onSelectImage: (index: number) => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const handleKeyDown = useFocusTrap(modalRef);

  useEffect(() => {
    if (project && isVisible) {
      closeButtonRef.current?.focus();
    }
  }, [project, isVisible]);

  if (!project) return null;

  const isLiveExternal = project.liveUrl?.startsWith('http');

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-4 py-5 transition-opacity duration-200 sm:items-center sm:p-6',
        isVisible ? 'opacity-100' : 'opacity-0',
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      aria-describedby="project-modal-description"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className={cn(
          'relative flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border-2 border-black bg-beige text-dark-grey shadow-[0_-6px_0_#000] transition duration-200 dark:border-white dark:bg-dark-black dark:text-beige dark:shadow-[0_-6px_0_rgba(255,255,255,0.85)] sm:rounded-xl sm:shadow-[8px_8px_0_#000] sm:dark:shadow-[8px_8px_0_rgba(255,255,255,0.85)]',
          isVisible
            ? 'translate-y-0 scale-100 opacity-100'
            : 'translate-y-6 scale-[0.98] opacity-0',
        )}
        onKeyDown={handleKeyDown}
      >
        <ProjectShaderCanvas
          variant="modal"
          className="opacity-90 dark:opacity-100"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-beige/78 to-beige/95 dark:via-dark-black/76 dark:to-dark-black/95" />
        <div
          className={cn('relative z-10 h-2 shrink-0 rounded-t-xl bg-linear-to-r', project.accent)}
        />
        <div className="stuff-modal-scroll relative z-10 overflow-y-auto p-5 pb-28 sm:p-6 sm:pb-28">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-flat-purple dark:text-flat-yellow">
                {project.status}
              </p>
              <h2
                id="project-modal-title"
                className="text-4xl leading-none sm:text-5xl"
              >
                {project.title}
              </h2>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-white text-xl text-black transition hover:-translate-y-0.5 dark:border-white dark:bg-dark-grey dark:text-white"
              aria-label="Close project details"
            >
              <FiX />
            </button>
          </div>

          <ProjectImageCarousel
            images={project.images}
            imageIndex={imageIndex}
            onNext={onNextImage}
            onPrevious={onPreviousImage}
            onSelect={onSelectImage}
          />

          <div className="mb-6 grid gap-4">
            <section>
              <h3 className="mb-2 font-paytone text-2xl text-black! dark:text-white!">
                Why
              </h3>
              <p
                id="project-modal-description"
                className="text-lg leading-7 text-gray-700 dark:text-gray-300"
              >
                {project.why}
              </p>
            </section>
            <section>
              <h3 className="mb-2 font-paytone text-2xl text-black! dark:text-white!">
                What
              </h3>
              <p className="text-lg leading-7 text-gray-700 dark:text-gray-300">
                {project.what}
              </p>
            </section>
            <section>
              <h3 className="mb-3 font-paytone text-2xl text-black! dark:text-white!">
                Use Cases
              </h3>
              <ul className="grid gap-3">
                {project.useCases.map((useCase) => (
                  <li
                    key={useCase}
                    className="rounded-lg border-2 border-black bg-white p-3 font-semibold dark:border-white dark:bg-dark-grey"
                  >
                    {useCase}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div>
            <h3 className="mb-3 font-paytone text-2xl text-black! dark:text-white!">
              Tech Stack
            </h3>
            <ul className="flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <li
                  key={item}
                  className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-700 dark:bg-dark-grey dark:text-gray-200"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 border-t-2 border-black bg-beige/95 p-4 backdrop-blur dark:border-white dark:bg-dark-black/95">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-black bg-white px-4 py-3 font-semibold text-black transition hover:-translate-y-0.5 dark:border-white dark:bg-dark-grey dark:text-white"
            >
              GitHub
              <FiGithub />
            </Link>
            {project.liveUrl && (
              <Link
                href={project.liveUrl}
                target={isLiveExternal ? '_blank' : undefined}
                rel={isLiveExternal ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-black bg-flat-yellow px-4 py-3 font-semibold text-black transition hover:-translate-y-0.5 dark:border-white dark:bg-flat-purple dark:text-white"
              >
                Live
                {isLiveExternal ? <FiExternalLink /> : <FiArrowRight />}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectShowcase() {
  const [selectedStack, setSelectedStack] = React.useState('All');
  const { selectedItem, isVisible, imageIndex, setImageIndex, open, close, nextImage, previousImage } =
    useProjectModalController<Project>();

  const filteredProjects = useMemo(() => {
    if (selectedStack === 'All') return projects;

    return projects.filter((project) => project.stack.includes(selectedStack));
  }, [selectedStack]);

  return (
    <>
      <div className="mb-6 w-full overflow-hidden rounded-xl border-2 border-black bg-beige-200 p-4 dark:border-white dark:bg-dark-grey">
        <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="font-paytone text-2xl text-black! dark:text-white!">
              Filter by Stack
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Showing {filteredProjects.length} of {projects.length} projects.
            </p>
          </div>
        </div>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter projects by tech stack"
        >
          {techStackFilters.map((filter) => {
            const isSelected = selectedStack === filter;

            return (
              <button
                key={filter}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedStack(filter)}
                className={cn(
                  'cursor-pointer rounded-md border-2 border-black px-3 py-2 text-xs font-semibold transition focus-visible:ring-4 focus-visible:ring-flat-blue dark:border-white sm:text-sm',
                  isSelected
                    ? 'bg-flat-yellow text-black dark:bg-flat-purple dark:text-white'
                    : 'bg-white text-gray-700 hover:-translate-y-0.5 dark:bg-dark-black dark:text-gray-200',
                )}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>
      <div className="grid items-stretch gap-6 md:grid-cols-2">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.title}
            project={project}
            onOpen={open}
          />
        ))}
      </div>
      <ProjectModal
        project={selectedItem}
        imageIndex={imageIndex}
        isVisible={isVisible}
        onClose={close}
        onNextImage={() => nextImage(selectedItem?.images.length ?? 0)}
        onPreviousImage={() => previousImage(selectedItem?.images.length ?? 0)}
        onSelectImage={setImageIndex}
      />
    </>
  );
}
