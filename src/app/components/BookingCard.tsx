import React from 'react';
import { Link } from 'react-router';
import { ArrowRight, LucideIcon } from 'lucide-react';

interface BookingCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  path: string;
  gradient: string;
  count?: number;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  icon: Icon,
  title,
  description,
  path,
  gradient,
  count,
}) => {
  return (
    <Link to={path}>
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-6 h-48 group hover:scale-105 transition-transform duration-300 cursor-pointer`}>
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Icon className="w-6 h-6 text-white" />
            </div>
            {count !== undefined && (
              <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                <span className="text-sm font-semibold text-white">{count}</span>
              </div>
            )}
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-sm text-white/80 mb-4">{description}</p>
          
          <div className="flex items-center gap-2 text-white font-medium group-hover:gap-3 transition-all">
            <span>Book Now</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
        
        {/* Decorative circles */}
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -left-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
      </div>
    </Link>
  );
};
