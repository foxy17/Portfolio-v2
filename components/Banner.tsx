import React from 'react';
import cn from 'classnames';
import ProfileCard from '~/components/Cards/ProfileCard';

type CurrentCompanyProps = {
  name: string;
};

type DescriptionProps = {
  description: string;
} & CurrentCompanyProps;

const CurrentCompany = ({ name }: CurrentCompanyProps) => {
  return (
    <h3
      data-text={name}
      className={cn(
        'text-flat-purple dark:text-flat-yellow before:decoration-flat-purple before:dark:decoration-flat-yellow',
        'relative overflow-hidden pb-2 before:text-transparent hover:before:animate-wave',
        'before:decoration-wavy before:absolute before:whitespace-nowrap max-w-fit',
        'before:content-[attr(data-text)attr(data-text)] before:underline before:underline-offset-4',
      )}
    >
      {name}
    </h3>
  );
};

const ShortDescription = ({ description, name }: DescriptionProps) => {
  return (
    <>
      <span className="text-xl sm:text-2xl sm:flex sm:flex-row mb-4">
        <h3 className="text-gray-700 dark:text-gray-200">Senior Frontend developer at &nbsp; </h3>
        <a
          href="https://www.clootrack.com/"
          target="_blank"
          rel="noopener noreferrer"
          className='max-w-min'
        >
          <CurrentCompany name={name} />
        </a>
      </span>
      <h3 className="text-xl md:text-2xl max-w-xl">{description}</h3>
    </>
  );
};

export default function Banner() {
  return (
    <main className="flex flex-col justify-center items-start max-w-4xl mx-auto w-full text-dark-grey dark:text-beige">
      <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center content-center mb-16 max-w-4xl w-full">
        <div className="flex flex-col transition-all">
          <h1 className="mb-4 sm:mb-1">Arnav Chauhan</h1>
          <ShortDescription
            name="Clootrack"
            description="I code beautifully simple products with amazing performance,
        experiences, and usability."
          />
        </div>

        <ProfileCard style="mb-12 md:mb-0 " />
      </div>
    </main>
  );
}
