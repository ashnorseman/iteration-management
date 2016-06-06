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
	}
};
