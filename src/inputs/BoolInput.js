import React from 'react';
import PropTypes from 'prop-types';

import ValueInput from './ValueInput';

const BoolInput = ({ value = false, onChange, options }) => {
  return (
    <ValueInput valueType="bool" options={options}>
      <span className="bool-value">
        <input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)} />
      </span>
    </ValueInput>
  );
};

BoolInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.object.isRequired,
  value: PropTypes.bool
};

export default BoolInput;
