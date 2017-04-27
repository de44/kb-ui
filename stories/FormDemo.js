import React from 'react';
import PropTypes from 'prop-types';
import kb from '../lib/kb-ui';
import { withState, compose } from 'recompose';

import KbForm from '../lib/forms/KbForm';

const jsonPanelStyle = {
  'float': 'left',
  width: '30vw',
  marginRight: "5px",
  padding: "5px",
  border: '1px solid #333'
}

const coloredPanelStyle = {
  padding: "5px",
  backgroundColor: '#CCC'
}

const codeStyle = {
  width: "600px",
  padding: "10px",
  backgroundColor: "#CCC",
  overflow: "scroll",
}

const FormDemo = ({ fields, fieldsDef, model, changeModel, setChangeModel, submitModel, setSubmitModel }) => {
  return (
    <div className="SimpleUserFormDemo">
      <KbForm fields={fields} onSubmit={setSubmitModel} model={model} onChange={setChangeModel} />
      <hr/>
      <div className="config-row">
        <h4>Fields Configurations</h4>
        <div style={codeStyle}>
          <pre>{fieldsDef}</pre>
        </div>
      </div>
      <hr/>
      <div className="models-row">
        <div style={jsonPanelStyle}>
          <h3>Input Model</h3>
          <p><em>Never changed by the form.</em></p>
          <div style={coloredPanelStyle}>
            <pre>{JSON.stringify(model, null, 2)}</pre>
          </div>
        </div>
        <div style={jsonPanelStyle}>
          <h3>Change Model</h3>
          <p><em>Changes are pushed any time a form input triggers the `onChange` function.</em></p>
          <div style={coloredPanelStyle}>
            <pre>{JSON.stringify(changeModel, null, 2)}</pre>
          </div>
        </div>
        <div style={jsonPanelStyle}>
          <h3>Submit Model</h3>
          <p><em>Changes are pushed only when the form is submitted.</em></p>
          <div style={coloredPanelStyle}>
            <pre>{JSON.stringify(submitModel, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

FormDemo.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
  fieldsDef: PropTypes.string.isRequired,
  model: PropTypes.object.isRequired,
}

export default compose(
  withState('changeModel', 'setChangeModel', {}),
  withState('submitModel', 'setSubmitModel', {})
)(FormDemo)