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

		this.developerList = this.props.user.userList
			.filter(user => user.position !== 'QA')
			.map(user => user._id);
	}


	componentDidMount() {
		this.props.dispatch(IterationActions.fetchIterationItem(this.props.routeParams.id));
	}


	calculateCV(estimates = []) {
		const numbers = estimates
				.filter(estimate => this.developerList.includes(estimate.developer))
				.map(estimate => estimate.time),
			average = numbers.reduce((result, number) => {
				return number + result;
			}, 0) / numbers.length,
			std = Math.sqrt(numbers.map(number => {
				return Math.pow(number - average, 2);
			}).reduce((result, number) => result + number, 0) / (numbers.length - 1));

		return std / average;
	}


	editGrid(taskId, field) {
		this.props.dispatch(IterationActions.editTask(taskId, field));
	}


	render() {
		const {
			iteration: { currentIteration = {} },
			user: { userList = [] }
		} = this.props;

		return (
			<main>
				<header className="page-header">
					<h1>{currentIteration.year} 年第 {currentIteration.number} 次迭代</h1>
				</header>

				<form className="iteration-form" action="/iterations" method="POST">
					<dl>
						<dt>Year: </dt>
						<dd>
							<select name="year" value={currentIteration.year}>
								<option value="2016">2016</option>
							</select>
						</dd>
						<dt>Number: </dt>
						<dd><input type="number" name="number" value={currentIteration.number} /></dd>
						<dt>Status: </dt>
						<dd>
							<select name="status" value={currentIteration.status}>
								<option value="NOT_STARTED">未开始</option>
								<option value="IN_PROGRESS">进行中</option>
								<option value="SUCCESS">成功</option>
								<option value="FAILURE">失败</option>
							</select>
						</dd>
						<dt>Start Date: </dt>
						<dd><input type="date" name="startDate" value={currentIteration.startDate} /></dd>
						<dt>End Date: </dt>
						<dd><input type="date" name="endDate" value={currentIteration.endDate} /></dd>
						<dt>Deadline: </dt>
						<dd><input type="date" name="deadline" value={currentIteration.deadline} /></dd>
						<dt>Developers: </dt>
						<dd>
							{
								userList.map(user => {
									return (
										<label className="check-box" key={user._id}>
											<input type="checkbox"
														 name="developers"
														 value={user._id}
														 checked={(currentIteration.developers || []).includes(user._id)} />
											{user.name}
										</label>
									);
								})
							}
						</dd>
					</dl>

					<div className="form-submit">
						<button>Edit</button>
						<button type="button" className="button-minor">Delete</button>
					</div>
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
								<th style={{width: '5.5em'}}>Estimate</th>
								{
									userList.map(user => <th key={user._id} style={{width: '4.5em'}}>{user.name}</th>)
								}
								<th style={{width: '3.5em'}}>CV</th>
								<th style={{width: '6em'}}>Assignee</th>
								<th style={{width: '8em'}}>Status</th>
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
											<td className={task.edit ? 'grid-edit' : null}
													onClick={this.editGrid.bind(this, task._id, 'module')}>
												{task.edit === 'module' ? <input type="text" value={task.module} /> : task.module}
											</td>
											<td className={task.edit ? 'grid-edit' : null}>
												{task.edit ? <input type="text" value={task.subModule} /> : task.subModule}
											</td>
											<td className={task.edit ? 'grid-edit' : null}>
												{task.edit ? <input type="text" value={task.taskName} /> : task.taskName}
											</td>
											<td className={task.edit ? 'grid-edit' : null}>
												{
													task.edit
														? <select value={task.priority}>
																<option value="0">P0</option>
																<option value="1">P1</option>
																<option value="2">P2</option>
															</select>
														: <span className={`priority-${task.priority}`}>P{task.priority}</span>
												}
											</td>
											<td className={task.edit ? 'grid-edit' : null}>
												{finalEstimate && finalEstimate.time}
											</td>
											{
												userList.map(user => {
													const developer = task.estimates.find(estimate => estimate.developer === user._id);

													return (
														<td className={task.edit ? 'grid-edit' : null} key={user._id}>
															{
																task.edit
																	? <input type="text" value={developer ? developer.time : ''} />
																	: developer && developer.time
															}
														</td>
													);
												})
											}
											<td className={task.edit ? 'grid-edit' : null}>
												<span className={cv > 0.5 ? 'cv-large' : null}>
													{cv ? cv.toFixed(2) : null}
												</span>
											</td>
											<td className={task.edit ? 'grid-edit' : null}>
												{
													task.edit
														? <select value={task.assignee}>
																{
																	userList.map(user =>
																		<option value={user._id} key={user._id}>{user.name}</option>
																	)
																}
															</select>
														: assignee && assignee.name
												}
											</td>
											<td className={task.edit ? 'grid-edit' : null}>
												{
													task.edit
														? <select value={task.status}>
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
										</tr>
									);
								})
							}
						</tbody>
					</table>

					<div className="table-add">
						<button type="button">Add Task</button>
					</div>
				</div>
			</main>
		);
	}
}
