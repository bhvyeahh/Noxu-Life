import React from 'react';
import { MoreHorizontal, Plus } from 'lucide-react';

export interface FeatureCardData {
  id: number;
  badgeText: string;
  title: string;
  description: string;
  progressPercent: string;
  accentColor: string; // Tailwind bg color class
  icon: React.ReactNode;
}

interface CardProps {
  data: FeatureCardData;
}

export const ProfessionalFeatureCard: React.FC<CardProps> = ({ data }) => {
  return (
    <div className="flex flex-col bg-[#232228] border border-[#363636] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 group">
      {/* Card Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#363636]">
        <div className={`px-3 py-1 text-xs font-semibold text-white rounded-full ${data.accentColor}`}>
          {data.badgeText}
        </div>
        <button className="text-[#ddd] hover:text-white transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg ${data.accentColor} text-white`}>
            {data.icon}
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">{data.title}</h3>
        </div>
        
        <p className="text-[#ddd] text-sm leading-relaxed mb-6 flex-1">
          {data.description}
        </p>

        {/* Progress/Implementation Bar (Adapted from your template) */}
        <div className="mt-auto">
          <div className="flex justify-between text-xs font-medium text-[#ddd] mb-2">
            <span>Implementation</span>
            <span>{data.progressPercent}</span>
          </div>
          <div className="w-full h-2 bg-[#151419] rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${data.accentColor} transition-all duration-1000 ease-out`}
              style={{ width: data.progressPercent }}
            />
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-6 py-4 bg-[#151419] flex items-center justify-between border-t border-[#363636]">
        <div className="flex items-center -space-x-2">
          {/* Mock Avatars for the "Users/Community" feel */}
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64" alt="User" className="w-8 h-8 rounded-full border-2 border-[#151419] object-cover" />
          <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64" alt="User" className="w-8 h-8 rounded-full border-2 border-[#151419] object-cover" />
          <button className="w-8 h-8 rounded-full bg-[#292929] border-2 border-[#151419] flex items-center justify-center text-white hover:bg-[#363636] z-10 transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <span className="text-xs font-medium text-[#ddd]">Active Feature</span>
      </div>
    </div>
  );
};