import React from 'react';

interface FieldConfig {
  fieldId: string;
  label: string;
  type: 'select' | 'text' | 'checkbox';
  options?: string[];
}

interface StructuredInputProps {
  fields: FieldConfig[];
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
}

export const StructuredInput: React.FC<StructuredInputProps> = ({
  fields,
  values = {},
  onChange,
}) => {
  const handleFieldChange = (fieldId: string, val: any) => {
    const updated = { ...values, [fieldId]: val };
    onChange(updated);
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      {fields.map((field) => (
        <div key={field.fieldId} className="space-y-1.5 p-3.5 border border-white/10 bg-[#0E1217]/70">
          <label className="text-slate-300 font-semibold block text-[11px] uppercase">
            {field.label}
          </label>

          {field.type === 'select' && field.options && (
            <select
              value={values[field.fieldId] || ''}
              onChange={(e) => handleFieldChange(field.fieldId, e.target.value)}
              className="w-full bg-[#080A0D] border border-white/20 p-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#00F0B4]"
            >
              <option value="" disabled>
                Select specification...
              </option>
              {field.options.map((opt, idx) => (
                <option key={idx} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          )}

          {field.type === 'text' && (
            <input
              type="text"
              value={values[field.fieldId] || ''}
              placeholder="e.g. Computer Science, Mechanical Engineering, Fine Arts..."
              onChange={(e) => handleFieldChange(field.fieldId, e.target.value)}
              className="w-full bg-[#080A0D] border border-white/20 p-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-[#00F0B4]"
            />
          )}
        </div>
      ))}
    </div>
  );
};
