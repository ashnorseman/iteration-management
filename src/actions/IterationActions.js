/**
 * Created by Ash on 2016-06-06.
 */


import fetchie from 'fetchie';


export default {

	fetchIterationList() {

		return dispatch => {

			dispatch({
				type: 'fetch-iteration-list'
			});

			return fetchie
				.get('/iterations')
				.then(res => {
          dispatch({
						type: 'fetch-iteration-list-success',
						data: res
					});
				});
		};
	},


	fetchIterationItem(id) {

		return dispatch => {

			dispatch({
				type: 'fetch-iteration-item'
			});

			return fetchie
				.get(`/iterations/${id}`)
				.then(res => {
					dispatch({
						type: 'fetch-iteration-item-success',
						data: res
					});
				});
		};
	},


	toggleAddMode() {
		return {
			type: 'toggle-add-iteration-mode'
		};
	},


  addTask(id) {

    return dispatch => fetchie
      .post(`/iterations/${id}/tasks`)
      .then(res => {
        dispatch({
          type: 'fetch-iteration-item-success',
          data: res
        });
      });
	},


	taskEditMode(taskId, field) {
		return {
			type: 'task-edit-mode',
			data: {
				taskId,
				field
			}
		};
	},


  editPropValue(field, value) {
		return {
			type: 'edit-prop-value',
			data: {
				field,
				value
			}
		};
	},


  toggleDeveloper(userId, checked) {
		return {
			type: 'toggle-developer',
			data: {
        userId,
        checked
			}
		};
	},


	editTaskValue(taskId, field, value) {
		return {
			type: 'edit-task-value',
			data: {
				taskId,
				field,
				value
			}
		};
	},


  editTaskEstimateValue(taskId, developerId, value) {
		return {
			type: 'edit-task-estimate-value',
			data: {
				taskId,
        developerId,
				value
			}
		};
	},


	saveIteration(data) {

		return dispatch => {

			return fetchie
				.put(`/iterations/${data._id}`)
				.send(data)
				.then(res => {
					dispatch({
						type: 'fetch-iteration-item-success',
						data: res
					});
				});
		};
	},


	saveTask(iteration, task) {

		return dispatch => {

			return fetchie
				.put(`/iterations/${iteration._id}/tasks/${task._id}`)
				.send(task)
				.then(res => {
					dispatch({
						type: 'fetch-iteration-item-success',
						data: res
					});
				});
		};
	},


  saveTaskEstimate(iterationId, taskId, userId, time) {

    return dispatch => {

      return fetchie
        .put(`/iterations/${iterationId}/tasks/${taskId}/users/${userId}`)
        .send({
          time
        })
        .then(res => {
          dispatch({
            type: 'fetch-iteration-item-success',
            data: res
          });
        });
    };
  }
};
