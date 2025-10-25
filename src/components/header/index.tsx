import React from "react";

interface HeaderProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actions?: React.ReactNode[] | React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ icon, title, description, actions }) => {
  return (
    <header className="flex justify-between items-center mb-8 flex-wrap gap-4 mb-6" >
      <div className="flex items-center gap-3">
        {icon && (
          <div className="p-2 bg-gray-100 rounded-lg">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
      </div>


      {actions && (
        <div className="flex items-center gap-3 flex-wrap">
          {Array.isArray(actions) ? actions.map((action, i) => (
            <div key={i}>{action}</div>
          )) : actions}
        </div>
      )}
    </header>
  );
};
