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


	render() {
		const {
			iteration: { currentIteration = {} },
			user: { userList = [] }
		} = this.props;

		return (
			<main>
				<header className="page-header">
					<h1>{currentIteration.year} 年第 {currentIteration.number} 次迭代</h1>
					<button type="button">Add Task</button>
				</header>

				<div className="card">
					<h2>Iteration List</h2>
					<table>
						<thead>
							<tr>
								<th>Module</th>
								<th>Sub-Module</th>
								<th>Task Name</th>
								<th>Priority</th>
								<th>Estimate</th>
								{
									userList.map(user => <th key={user._id}>{user.name}</th>)
								}
								<th>CV</th>
								<th>Assignee</th>
								<th>Status</th>
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
											<td>{task.module}</td>
											<td>{task.subModule}</td>
											<td>{task.taskName}</td>
											<td>
												<span className={`priority-${task.priority}`}>P{task.priority}</span>
											</td>
											<td>{finalEstimate && finalEstimate.time}</td>
											{
												userList.map(user => {
													const developer = task.estimates.find(estimate => estimate.developer === user._id);

													return <td key={user._id}>{developer && developer.time}</td>;
												})
											}
											<td>
												<span className={cv > 0.5 ? 'cv-large' : null}>
													{cv ? cv.toFixed(2) : null}
												</span>
											</td>
											<td>{assignee && assignee.name}</td>
											<td>
												<span className={ITERATION_STATUS[task.status].className}>
													{ITERATION_STATUS[task.status].text}
												</span>
											</td>
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
