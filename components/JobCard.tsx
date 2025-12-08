import React from 'react';
import { Job } from '../types';
import { MapPin, Briefcase, Clock, Building2 } from 'lucide-react';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6 border border-slate-100 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-1">{job.title}</h3>
          <div className="flex items-center text-brand-600 font-medium">
            <Building2 className="w-4 h-4 mr-1" />
            {job.company}
          </div>
        </div>
        <span className="bg-brand-50 text-brand-700 text-xs font-semibold px-2 py-1 rounded-full border border-brand-100">
          {job.type}
        </span>
      </div>
      
      <p className="text-slate-600 text-sm mb-6 flex-grow line-clamp-3">
        {job.description}
      </p>

      <div className="flex flex-wrap gap-4 text-sm text-slate-500 pt-4 border-t border-slate-100">
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-1" />
          {job.location}
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          {job.postedAt}
        </div>
         <div className="flex items-center font-semibold text-slate-700 ml-auto">
          {job.salary}
        </div>
      </div>
      
      <button className="mt-4 w-full bg-slate-50 hover:bg-slate-100 text-brand-600 font-semibold py-2 rounded border border-slate-200 transition-colors">
        Details ansehen
      </button>
    </div>
  );
};

export default JobCard;