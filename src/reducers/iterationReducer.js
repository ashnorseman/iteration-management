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
	case 'toggle-add-iteration-mode':
		return {
			...state,
			iterationAddMode: !state.iterationAddMode
		};
  case 'add-task':
    return {
      ...state,
      currentIteration: {
        ...state.currentIteration,
        tasks: [
          ...state.currentIteration.tasks,
          {
            edit: 'module',
            status: 'NOT_STARTED'
          }
        ]
      }
    };
	case 'task-edit-mode':
		return findTaskAndEdit(action.data.taskId, state, task => {
			return {
				...task,
				edit: action.data.field
			};
		});
  case 'edit-prop-value':
    return {
      ...state,
      currentIteration: {
        ...state.currentIteration,
        [action.data.field]: action.data.value
      }
    };
  case 'toggle-developer':
    const developers = new Set(state.currentIteration.developers),
      inList = developers.has(action.data.userId);

    if (inList && !action.data.checked) {
      developers.delete(action.data.userId);
    } else if (!inList && action.data.checked) {
      developers.add(action.data.userId);
    }

    return {
      ...state,
      currentIteration: {
        ...state.currentIteration,
        developers: Array.from(developers)
      }
    };
	case 'edit-task-value':
		return findTaskAndEdit(action.data.taskId, state, task => {
			return {
				...task,
				[action.data.field]: action.data.value
			};
		});
  case 'edit-task-estimate-value':
    return findTaskAndEdit(action.data.taskId, state, task => {
      let estimates = task.estimates;

      if (!estimates) {
        estimates = [
          {
            developer: action.data.developerId,
            time: action.data.value
          }
        ];
      } else {
        let estimateIndex = estimates.findIndex(item => item.developer === action.data.developerId);

        if (estimates[estimateIndex]) {
          if (action.data.value) {
            estimates[estimateIndex].time = action.data.value;
          } else {
            estimates.splice(estimateIndex, 1);
          }
        } else {
          estimates.push({
            developer: action.data.developerId,
            time: action.data.value
          });
        }
      }

      return {
        ...task,
        estimates
      };
    });
	}

	return state;
}


function findTaskAndEdit(taskId, state, cb) {
	const taskIndex = (state.currentIteration.tasks || [])
		.findIndex(task => task._id === taskId),
		task = state.currentIteration.tasks[taskIndex];

	return {
		...state,
		currentIteration: {
			...state.currentIteration,
			tasks: [
				...state.currentIteration.tasks.slice(0, taskIndex),
				cb(task),
				...state.currentIteration.tasks.slice(taskIndex + 1)
			]
		}
	};
}
