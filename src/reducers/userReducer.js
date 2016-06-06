/**
 * Created by Ash on 2016-06-06.
 */


const initialState = {
	userList: []
};


export default function (state = initialState, action = {}) {

	switch (action.type) {
	case 'fetch-user-list-success':
		return {
			...state,
			userList: action.data || []
		};
	}

	return state;
}
