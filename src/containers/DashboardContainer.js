/**
 * Created by Ash on 2016-06-06.
 */


import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import echarts from 'echarts/lib/echarts';


@connect(state => ({
	user: state.user,
  iteration: state.iteration
}))
export default class IterationContainer extends Component {

	static propTypes = {
    iteration: PropTypes.object,
		user: PropTypes.object
	};

  componentDidMount() {
    const chart = echarts.init(this.refs.taskChart),
      list = this.props.iteration.iterationList,
      xAxis = [],
      finishedSeries = [],
      pendingSeries = [],
      total = [];

    list.forEach(item => {
      item.tasks || (item.tasks = []);

      const finished = item.tasks.filter(task => task.status === 'TEST_PASSED').length;

      xAxis.unshift(`${item.year}-${item.number}`);
      finishedSeries.unshift(finished);
      pendingSeries.unshift(item.tasks.length - finished);
      total.unshift(item.tasks.length);
    });

    chart.setOption({
      color: ['#4db47d', '#fbca35', '#ff8acc'],
      tooltip: {},
      xAxis: {
        data: xAxis
      },
      yAxis: {},
      legend: {
        data: ['Finished', 'Pending', 'Total']
      },
      series: [
        {
          name: 'Finished',
          type: 'bar',
          label: {
            normal: {
              show: true,
              textStyle: {
                fontSize: 18
              }
            }
          },
          data: finishedSeries
        },
        {
          name: 'Pending',
          type: 'bar',
          label: {
            normal: {
              show: true,
              textStyle: {
                fontSize: 18
              }
            }
          },
          data: pendingSeries
        },
        {
          name: 'Total',
          type: 'line',
          data: total,
          lineStyle: {
            normal: {
              width: 8
            }
          },
          markPoint: {
            data: [
              { type: 'max', name: '最大值' },
              { type: 'min', name: '最小值' }
            ]
          },
          markLine: {
            data: [
              { type: 'average', name: '平均值' }
            ]
          }
        }
      ]
    });
  }

	render() {
    const {
      iteration: { iterationList = [] }
    } = this.props;

		return (
			<main>
				<header className="page-header">
					<h1>Dashboard</h1>
				</header>

        <div className="card">
          <h2>Tasks</h2>

          <section ref="taskChart" style={{height: 500}} />
        </div>
      </main>
		);
	}
}
