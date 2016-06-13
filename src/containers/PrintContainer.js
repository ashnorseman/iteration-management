/**
 * Created by Ash on 2016-06-06.
 */


import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { ITERATION_STATUS } from '../constants';

import IterationActions from '../actions/IterationActions';


@connect(state => ({
  iteration: state.iteration,
  user: state.user
}))
export default class IterationItemContainer extends Component {

  static propTypes = {
    dispatch: PropTypes.func,
    iteration: PropTypes.object,
    routeParams: PropTypes.object,
    user: PropTypes.object
  };


  constructor(props) {
    super(props);

    this.fullDeveloperList = this.props.user.userList.filter(user => user.position !== 'QA');
  }


  componentDidMount() {
    this.props.dispatch(IterationActions.fetchIterationItem(this.props.routeParams.id));
  }


  render() {
    const {
      iteration: { currentIteration = {} },
      user: { userData = {}, userList = [] }
    } = this.props,

      tasks = currentIteration.tasks || [];

    return (
      <main className="print">
        <ul>
          {
            tasks.map(task => {
              const assignee = this.fullDeveloperList.find(developer => developer._id === task.assignee),
                estimate = task.estimates.find(estimate => estimate.developer === task.assignee);

              return (
                <li className="print-item" key={task._id}>
                  <p>
                    <span className="print-priority">{`P${task.priority}`}</span>
                    <span className="print-assignee">{assignee ? assignee.name : ''}</span>
                  </p>
                  <p>
                    <span className="print-issue">Issue:</span>
                    <span className="print-estimate">{`预估时间：${estimate ? estimate.time : 0}d`}</span>
                  </p>
                  <p className="print-task-name">{`【${task.module}】【${task.subModule}】${task.taskName}`}</p>
                  <p>
                    <span className="print-start">Start:</span>
                    <span className="print-end">End:</span>
                  </p>
                </li>
              );
            })
          }
        </ul>
      </main>
    );
  }
}
