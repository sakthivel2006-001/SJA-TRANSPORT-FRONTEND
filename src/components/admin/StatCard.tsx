import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: typeof LucideIcon;
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, colorClass }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 flex items-center gap-4">
      <div className={`p-4 rounded-lg ${colorClass}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
      </div>
    </div>
  );
};

export default StatCard;
