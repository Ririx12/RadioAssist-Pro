// RadioAssist Pro - CheckBox Component

import React from 'react';

import { Check } from 'lucide-react';



/**

 * Custom checkbox component with Tailwind styling

 * @param {Object} props

 * @param {string} props.label - Label text for the checkbox

 * @param {boolean} props.checked - Whether the checkbox is checked

 * @param {Function} props.onChange - Change handler function

 * @param {boolean} props.sub - Whether this is a sub-checkbox (indented)

 */

const CheckBox = ({ label, checked, onChange, sub = false }) => (

  <label

    className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${

      checked

        ? 'bg-indigo-50 border-indigo-200'

        : 'hover:bg-slate-50 border-transparent'

    } border ${sub ? 'ml-6 text-sm py-1' : ''}`}

  >

    <div

      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${

        checked

          ? 'bg-indigo-600 border-indigo-600'

          : 'bg-white border-slate-300'

      }`}

    >

      {checked && <Check size={10} className="text-white" />}

    </div>

    <input

      type="checkbox"

      className="hidden"

      checked={checked}

      onChange={onChange}

      aria-label={label}

    />

    <span className={`${sub ? 'text-slate-600' : 'font-medium text-slate-700'}`}>

      {label}

    </span>

  </label>

);



export default React.memo(CheckBox);

