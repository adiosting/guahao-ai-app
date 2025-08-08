import React from 'react';
import { Hospital } from '../types';
import { clsx } from 'clsx';

interface HospitalSelectorProps {
  hospitals: Hospital[];
  selectedHospital: Hospital | null;
  onSelect: (hospital: Hospital) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const HospitalSelector: React.FC<HospitalSelectorProps> = ({
  hospitals,
  selectedHospital,
  onSelect,
  isCollapsed = false,
  onToggleCollapse
}) => {
  if (isCollapsed && selectedHospital) {
    // 收缩状态：显示已选医院
    return (
      <div className="mb-2">
        <div 
          onClick={onToggleCollapse}
          className="flex items-center justify-between px-3 py-2 bg-primary bg-opacity-10 border border-primary border-opacity-30 rounded-lg cursor-pointer hover:bg-opacity-20 transition-colors"
        >
          <div className="flex items-center">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
              {selectedHospital.name.charAt(0)}
            </div>
            <div className="text-sm font-medium text-primary">
              {selectedHospital.name}
            </div>
          </div>
          <button className="text-primary text-xs hover:underline">
            修改
          </button>
        </div>
      </div>
    );
  }

  // 展开状态：显示医院选择卡片
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-text-primary mb-4">
        请选择就诊医院
      </h3>
      <div className="grid grid-cols-1 gap-3">
        {hospitals.map(hospital => (
          <div
            key={hospital.id}
            onClick={() => onSelect(hospital)}
            className={clsx(
              "p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 active:scale-98",
              selectedHospital?.id === hospital.id
                ? "border-primary bg-primary bg-opacity-5 shadow-lg"
                : "border-card-border bg-card-background hover:border-primary hover:border-opacity-50 hover:shadow-md"
            )}
          >
            <div className="flex items-center">
              <div className={clsx(
                "w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold mr-4",
                selectedHospital?.id === hospital.id ? "bg-primary" : "bg-text-secondary"
              )}>
                {hospital.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className={clsx(
                  "text-base font-medium mb-1",
                  selectedHospital?.id === hospital.id ? "text-primary" : "text-text-primary"
                )}>
                  {hospital.name}
                </div>
                <div className="text-sm text-text-secondary">
                  {hospital.type}
                </div>
              </div>
              {selectedHospital?.id === hospital.id && (
                <div className="text-primary text-xl ml-2">
                  ✓
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {selectedHospital && onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className="w-full mt-4 py-2 text-primary text-sm hover:underline"
        >
          确认选择
        </button>
      )}
    </div>
  );
};

export default HospitalSelector;