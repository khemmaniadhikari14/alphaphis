import React from 'react';
import { Award, Clock, Sparkles } from 'lucide-react';
import { Winner } from '../types';

const STATIC_WINNERS: Winner[] = [
  {
    id: 'win_1',
    name: 'Gunaraj Adhikari',
    initials: 'GA',
    prize: 'RS 500 for free',
    department: 'School of Medicine',
    timeAgo: '2 minutes ago',
    avatarColor: 'bg-blue-600 text-white',
  },
  {
    id: 'win_2',
    name: 'Khemmani Adhikari',
    initials: 'KA',
    prize: 'Free Dining',
    department: 'Computer Science Dept',
    timeAgo: '6 minutes ago',
    avatarColor: 'bg-emerald-600 text-white',
  },
  {
    id: 'win_3',
    name: 'Archan Karki',
    initials: 'AK',
    prize: 'Free Dining',
    department: 'Business & Finance',
    timeAgo: '11 minutes ago',
    avatarColor: 'bg-orange-600 text-white',
  },
  {
    id: 'win_4',
    name: 'Aakrist Baral',
    initials: 'AB',
    prize: 'Free coffee',
    department: 'Arts & Humanities',
    timeAgo: '19 minutes ago',
    avatarColor: 'bg-purple-600 text-white',
  },
  {
    id: 'win_5',
    name: 'Siddhant Kafle',
    initials: 'SK',
    prize: 'Rs 100 recharge',
    department: 'Mechanical Engineering',
    timeAgo: '28 minutes ago',
    avatarColor: 'bg-rose-600 text-white',
  },
  {
    id: 'win_6',
    name: 'Akul Dhakal',
    initials: 'AD',
    prize: 'Free airbuds',
    department: 'Law & Justice',
    timeAgo: '35 minutes ago',
    avatarColor: 'bg-teal-600 text-white',
  },
];

export const RecentWinners: React.FC = () => {
  return (
    <div id="recent-winners-section" className="w-full max-w-4xl mx-auto mt-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-2 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900">
              Recent Campus Winners Roll
            </h3>
            <p className="text-xs text-neutral-500">
              Live updates from across campus departments
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Live Feed Active</span>
        </div>
      </div>

      {/* Grid of Winner Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {STATIC_WINNERS.map((winner) => (
          <div
            key={winner.id}
            id={`winner-card-${winner.id}`}
            className="p-3.5 rounded-xl bg-white border border-neutral-200/90 shadow-sm hover:shadow-md transition-shadow flex items-start gap-3"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${winner.avatarColor}`}
            >
              {winner.initials}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <h4 className="text-xs font-bold text-neutral-900 truncate">
                  {winner.name}
                </h4>
                <span className="text-[10px] text-neutral-400 flex items-center gap-0.5 shrink-0">
                  <Clock className="w-3 h-3" />
                  {winner.timeAgo}
                </span>
              </div>

              <p className="text-xs font-extrabold text-blue-600 truncate mt-0.5">
                Won: {winner.prize}
              </p>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
