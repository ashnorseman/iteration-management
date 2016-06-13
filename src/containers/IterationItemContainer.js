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
    this.developerList = this.fullDeveloperList.map(user => user._id);
  }


  componentDidMount() {
    this.props.dispatch(IterationActions.fetchIterationItem(this.props.routeParams.id));
  }


  calculateCV(estimates = []) {
    const numbers = estimates
        .filter(estimate => this.developerList.includes(estimate.developer))
        .map(estimate => estimate.time),
      average = numbers.reduce((result, number) => {
        return +number + result;
      }, 0) / numbers.length,
      std = Math.sqrt(numbers.map(number => {
        return Math.pow(number - average, 2);
      }).reduce((result, number) => result + number, 0) / (numbers.length - 1));

    return std / average;
  }


  generateEstimateField(task, userData) {
    const currentEstimate = task.estimates.find(estimate => estimate.developer === userData._id);

    return (
      <td className={task.edit === 'developer' ? 'grid-edit' : null}
          onClick={this.editGrid.bind(this, task._id, 'developer')}>
        {
          task.edit === 'developer'
            ? <input type="text"
                     value={currentEstimate ? currentEstimate.time : ''}
                     onChange={this.estimateValueChange.bind(this, task._id, userData._id)}
                     onBlur={::this.save} />
            : currentEstimate ? currentEstimate.time : ''
        }
      </td>
    );
  }


  getFinalEstimate(task) {
    const assignee = task.assignee;

    if (!assignee || !task.estimates || !task.estimates.length) return null;

    const estimate = task.estimates.find(estimate => estimate.developer === task.assignee);

    return estimate ? estimate.time : null;
  }


  getTotalWorkload(developer, priority, finished) {
    return (this.props.iteration.currentIteration.tasks || [])
      .filter(task => task.assignee === developer &&
         (priority !== null ? task.priority === priority : true) &&
         (finished ? task.status === 'TEST_PASSED' : true))
      .reduce((result, task) => {
        return result + this.getFinalEstimate(task);
      }, 0);
  }


  addTask() {
    this.props.dispatch(IterationActions.addTask());
  }


  editGrid(taskId, field, e) {
    const target = e.target;

    this.props.dispatch(IterationActions.taskEditMode(taskId, field));

    setTimeout(() => {
      const input = target.querySelectorAll('input, select')[0];

      input && input.focus();
    }, 0);
  }


  iterationPropChange(field, e) {
    this.props.dispatch(IterationActions.editPropValue(field, e.target.value));
  }


  toggleDeveloper(userId, e) {
    this.props.dispatch(IterationActions.toggleDeveloper(userId, e.target.checked));
  }


  gridValueChange(taskId, field, e) {
    this.props.dispatch(IterationActions.editTaskValue(taskId, field, e.target.value));
  }


  estimateValueChange(taskId, developerId, e) {
    this.props.dispatch(IterationActions.editTaskEstimateValue(taskId, developerId, e.target.value));
  }


  save() {
    this.props.dispatch(IterationActions.saveIteration(this.props.iteration.currentIteration));
  }


  saveTask(task) {
    this.props.dispatch(IterationActions.saveTask(this.props.iteration.currentIteration, task));
  }


  render() {
    const {
      iteration: { currentIteration = {} },
      user: { userData = {}, userList = [] }
    } = this.props,

      viewMode = ['FAILURE', 'SUCCESS'].includes(currentIteration.status) || userData.isMaster;

    return (
      <main>
        <header className="page-header">
          <h1>{currentIteration.year} 年第 {currentIteration.number} 次迭代</h1>
        </header>

        <form className="iteration-form">
          <dl>
            <dt>Year: </dt>
            <dd>
              <select name="year"
                      value={currentIteration.year || ''}
                      onChange={this.iterationPropChange.bind(this, 'year')}
                      disabled={!userData.isMaster}>
                <option value="2016">2016</option>
              </select>
            </dd>
            <dt>Number: </dt>
            <dd>
              <input type="number"
                     name="number"
                     value={currentIteration.number || ''}
                     onChange={this.iterationPropChange.bind(this, 'number')}
                     disabled={!userData.isMaster} />
            </dd>
            <dt>Status: </dt>
            <dd>
              <select name="status"
                      value={currentIteration.status || ''}
                      onChange={this.iterationPropChange.bind(this, 'status')}
                      disabled={!userData.isMaster}>
                <option value="NOT_STARTED">未开始</option>
                <option value="IN_PROGRESS">进行中</option>
                <option value="SUCCESS">成功</option>
                <option value="FAILURE">失败</option>
              </select>
            </dd>
            <dt>Start Date: </dt>
            <dd>
              <input type="date"
                     name="startDate"
                     value={currentIteration.startDate || ''}
                     onChange={this.iterationPropChange.bind(this, 'startDate')}
                     disabled={!userData.isMaster} />
            </dd>
            <dt>End Date: </dt>
            <dd>
              <input type="date"
                     name="endDate"
                     value={currentIteration.endDate || ''}
                     onChange={this.iterationPropChange.bind(this, 'endDate')}
                     disabled={!userData.isMaster} />
            </dd>
            <dt>Deadline: </dt>
            <dd>
              <input type="date"
                     name="deadline"
                     value={currentIteration.deadline || ''}
                     onChange={this.iterationPropChange.bind(this, 'deadline')}
                     disabled={!userData.isMaster} />
            </dd>
            <dt>Developers: </dt>
            <dd>
              {
                userList.map(user => {
                  return (
                    <label className="check-box" key={user._id}>
                      <input type="checkbox"
                             name="developers"
                             value={user._id}
                             checked={(currentIteration.developers || []).includes(user._id) || false}
                             onChange={this.toggleDeveloper.bind(this, user._id)}
                             disabled={!userData.isMaster} />
                      {user.name}
                    </label>
                  );
                })
              }
            </dd>
          </dl>

          {
            userData.isMaster
              ? <div className="form-submit">
                  <button type="button" onClick={::this.save}>Edit</button>
                  <a className="button button-minor" href={`#/print/${currentIteration._id}`}>Print</a>
                  <button type="button" className="button-minor">Delete</button>
                </div>
              : null
          }
        </form>

        <div className="card">
          <h2>Iteration List</h2>
          <table>
            <thead>
              <tr>
                <th style={{width: '7em'}}>Module</th>
                <th style={{width: '7em'}}>Sub-Module</th>
                <th>Task Name</th>
                <th style={{width: '3em'}}>Priority</th>
                {
                  viewMode
                    ? <th style={{width: '5.5em'}}>Estimate</th>
                    : null
                }
                {
                  viewMode
                    ? userList.map(user => <th key={user._id} style={{width: '4.5em'}}>{user.name}</th>)
                    : <th style={{width: '4.5em'}}>{userData.name}</th>
                }
                {
                  viewMode
                    ? <th style={{width: '3.5em'}}>CV</th>
                    : null
                }
                {
                  viewMode
                    ? <th style={{width: '6em'}}>Assignee</th>
                    : null
                }
                {
                  viewMode
                    ? <th style={{width: '8em'}}>Status</th>
                    : null
                }
              </tr>
            </thead>
            <tbody>
              {
                currentIteration.tasks && currentIteration.tasks.map(task => {
                  const assignee = userList.find(user => user._id === task.assignee);

                  task.estimates || (task.estimates = []);

                  const finalEstimate = task.estimates.find(estimate => estimate.developer === task.assignee),
                    cv = this.calculateCV(task.estimates);

                  return (
                    <tr key={task._id}>
                      <td className={task.edit === 'module' ? 'grid-edit' : null}
                          onClick={userData.isMaster ? this.editGrid.bind(this, task._id, 'module') : null}>
                        {
                          task.edit === 'module'
                            ? <input type="text"
                                     value={task.module}
                                     onChange={this.gridValueChange.bind(this, task._id, 'module')}
                                     onBlur={this.saveTask.bind(this, task)} />
                            : task.module
                        }
                      </td>
                      <td className={task.edit === 'subModule' ? 'grid-edit' : null}
                          onClick={userData.isMaster ? this.editGrid.bind(this, task._id, 'subModule') : null}>
                        {
                          task.edit === 'subModule'
                            ? <input type="text"
                                     value={task.subModule}
                                     onChange={this.gridValueChange.bind(this, task._id, 'subModule')}
                                     onBlur={this.saveTask.bind(this, task)} />
                            : task.subModule
                        }
                      </td>
                      <td className={task.edit === 'taskName' ? 'grid-edit' : null}
                          onClick={userData.isMaster ? this.editGrid.bind(this, task._id, 'taskName') : null}>
                        {
                          task.edit === 'taskName'
                            ? <input type="text"
                                     value={task.taskName}
                                     onChange={this.gridValueChange.bind(this, task._id, 'taskName')}
                                     onBlur={this.saveTask.bind(this, task)} />
                            : task.taskName
                        }
                      </td>
                      <td className={task.edit === 'priority' ? 'grid-edit' : null}
                          onClick={userData.isMaster ? this.editGrid.bind(this, task._id, 'priority') : null}>
                        {
                          task.edit === 'priority'
                            ? <select value={task.priority}
                                      onChange={this.gridValueChange.bind(this, task._id, 'priority')}
                                      onBlur={this.saveTask.bind(this, task)}>
                                <option value="0">P0</option>
                                <option value="1">P1</option>
                                <option value="2">P2</option>
                              </select>
                            : <span className={`priority-${task.priority}`}>P{task.priority}</span>
                        }
                      </td>
                      {
                        viewMode
                          ? <td>
                              {finalEstimate && finalEstimate.time}
                            </td>
                          : null
                      }
                      {
                        viewMode
                          ? userList.map(user => {
                              const developer = task.estimates.find(estimate => estimate.developer === user._id);

                              return (
                                <td className={task.edit === 'developer' ? 'grid-edit' : null}
                                    key={user._id}
                                    onClick={userData.isMaster ? this.editGrid.bind(this, task._id, 'developer') : null}>
                                  {
                                    task.edit === 'developer'
                                      ? <input type="text"
                                               value={developer ? developer.time : ''}
                                               onChange={this.estimateValueChange.bind(this, task._id, user._id)}
                                               onBlur={this.saveTask.bind(this, task)} />
                                      : developer && developer.time
                                  }
                                </td>
                              );
                            })
                          : this.generateEstimateField(task, userData)
                      }
                      {
                        viewMode
                          ? <td>
                              <span className={cv > 0.5 ? 'cv-large' : null}>
                                {cv ? cv.toFixed(2) : null}
                              </span>
                            </td>
                          : null
                      }
                      {
                        viewMode
                          ? <td className={task.edit === 'assignee' ? 'grid-edit' : null}
                                onClick={userData.isMaster ? this.editGrid.bind(this, task._id, 'assignee') : null}>
                              {
                                task.edit === 'assignee'
                                  ? <select value={task.assignee}
                                            onChange={this.gridValueChange.bind(this, task._id, 'assignee')}
                                            onBlur={this.saveTask.bind(this, task)}>
                                      <option value="" />
                                      {
                                        userList.map(user =>
                                          <option value={user._id} key={user._id}>{user.name}</option>
                                        )
                                      }
                                    </select>
                                  : assignee && assignee.name
                              }
                            </td>
                          : null
                      }
                      {
                        viewMode
                          ? <td className={task.edit === 'status' ? 'grid-edit' : null}
                                onClick={userData.isMaster ? this.editGrid.bind(this, task._id, 'status') : null}>
                              {
                                task.edit === 'status'
                                  ? <select value={task.status}
                                            onChange={this.gridValueChange.bind(this, task._id, 'status')}
                                            onBlur={this.saveTask.bind(this, task)}>
                                      <option value="NOT_STARTED">Not Started</option>
                                      <option value="IN_PROGRESS">In Progress</option>
                                      <option value="DEVELOPED">Developed</option>
                                      <option value="TEST_FAILED">Test Failed</option>
                                      <option value="TEST_PASSED">Test Passed</option>
                                    </select>
                                  : <span className={ITERATION_STATUS[task.status].className}>
                                  {ITERATION_STATUS[task.status].text}
                                </span>
                              }
                            </td>
                          : null
                      }
                    </tr>
                  );
                })
              }
            </tbody>
          </table>

          {
            userData.isMaster
              ? <div className="table-add">
                  <button type="button" onClick={::this.addTask}>Add Task</button>
                </div>
              : null
          }
        </div>

        <div className="card">
          <h2>Iteration Workload Summary</h2>

          <table>
            <thead>
              <tr>
                <th>Developer</th>
                <th>P0</th>
                <th>P1</th>
                <th>P2</th>
                <th>Total</th>
                <th>Finished</th>
              </tr>
            </thead>

            <tbody>
              {
                this.fullDeveloperList.map(developer => {
                  const p0 = this.getTotalWorkload(developer._id, 0),
                    p1 = this.getTotalWorkload(developer._id, 1),
                    p2 = this.getTotalWorkload(developer._id, 2),
                    finished = this.getTotalWorkload(developer._id, null, true);

                  return (
                    <tr key={developer._id}>
                      <td>{developer.name}</td>
                      <td>{p0}</td>
                      <td>{p1}</td>
                      <td>{p2}</td>
                      <td>{p0 + p1 + p2}</td>
                      <td>{finished}</td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
      </main>
    );
  }
}
