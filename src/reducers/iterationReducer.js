/**
 * Created by Ash on 2016-06-06.
 */


const initialState = {
	iterationList: [],
	currentIteration: {}
};


export default function (state = initialState, action = {}) {

	switch (action.type) {
	case 'fetch-iteration-list-success':
		return {
			...state,
			iterationList: action.data || []
		};
	case 'fetch-iteration-item-success':
		return {
			...state,
			currentIteration: action.data || {}
		};
	}

	return state;
}
