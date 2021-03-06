import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { mapProps, withState, withHandlers, lifecycle, compose } from 'recompose';

const LabeledForm = ({ fields, formModel, onSubmit, onChange, onCancel }) => {
  return (
    <div className="LabeledForm">
      <form onSubmit={e => { e.preventDefault(); onSubmit(); }}>
        { fields.map((field, i) => (
          <div key={i}>
            {field._render(formModel, (newVal) => onChange(field, newVal))}
          </div>
        ))}
        <div className="cta-row">
          <button className="btn btn-primary">Submit</button>
          <button className="btn" onClick={e=>{e.preventDefault(); onCancel(); }}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

LabeledForm.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
  formModel: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func
};

function initFormModel(props) {
  const { fields, model = {} } = props,
      formModel = _.cloneDeep(model);
  // set default values in formState
  fields.map(f => f.options)
      .filter(({ defaultValue }) => !_.isUndefined(defaultValue))
      .filter(({ path }) => _.chain(formModel).at(path).head().isUndefined().value())
      .forEach(({ path, defaultValue }) => _.set(formModel, path, _.isFunction(defaultValue) ? defaultValue() : defaultValue));
  // setFormModel(formModel);
  return formModel;
}

export default compose(
  mapProps(props => {
    const fields = _.cloneDeep(props.options.fields);
    // set all to !readOnly
    fields.filter(f => _.isUndefined(f.options.readOnly)).forEach(f => f.readOnly(false));
    return {
      ...props,
      fields,
      onChange: _.defaultTo(props.onChange, () => {})
    };
  }),
  withState('formModel', 'setFormModel', initFormModel),
  lifecycle({
    componentWillMount() {
      const { onChange, formModel } = this.props;
      onChange(formModel);
    }
  }),
  withHandlers({
    onChange: props => (field, newValue) => {
      const { formModel, setFormModel, onChange } = props;
      _.set(formModel, field.options.path, newValue);
      setFormModel(formModel);
      onChange(formModel);
    },
    onSubmit: props => () => {
      const { formModel, onSubmit } = props;
      onSubmit(_.cloneDeep(formModel));
    },
    onCancel: props => () => {
      const { onCancel, formModel } = props;
      if (_.isFunction(onCancel)) {
        onCancel(formModel);
      }
    }
  })
)(LabeledForm);
