/**
 * Created by AshZhang on 2016-4-11.
 */


import combineReducers from 'redux/lib/combineReducers';

import iteration from './iterationReducer';
import user from './userReducer';

export default combineReducers({
	iteration,
	user
});
