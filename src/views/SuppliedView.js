import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { withState, withHandlers, lifecycle, compose } from 'recompose';

const SuppliedView = ({ component, loading, options, suppliedModel }) => {
  if (loading) {
    return (<div className="loading">Loading...</div>);
  }
  const { content } = suppliedModel;
  if (_.isUndefined(content)) {
    return (<div className="not-found">Not Found...</div>);
  }
  const RenderComponent = component;
  return (
    <div className="SuppliedView">
      <RenderComponent model={content} options={options} />
    </div>
  );
};

SuppliedView.propTypes = {
  component: PropTypes.node.isRequired,
  loading: PropTypes.bool.isRequired,
  options: PropTypes.object.isRequired,
  suppliedModel: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.object
  }).isRequired
};

export default compose(
  withState('suppliedModel', 'setSuppliedModel', { id: '' }),
  withState('loading', 'setLoading', false),
  withHandlers({
    refresh: props => (newModel) => {
      const { options, suppliedModel, setSuppliedModel, loading, setLoading } = props;
      if (!loading) {
        let model = _.defaultTo(newModel, props.model);
        if (suppliedModel.id !== model) {
          setLoading(true);
          options.supplier.findOne(model, options.idField)
              .then(res => {
                setLoading(false);
                setSuppliedModel({
                  id: model,
                  content: res
                });
              });
        }
      }
    }
  }),
  lifecycle({
    componentWillMount() {
      this.props.refresh();
    },
    componentWillReceiveProps(nextProps) {
      if (this.props.suppliedModel.id !== nextProps.model) {
        this.props.refresh(nextProps.model);
      }
    }
  })
)(SuppliedView);
