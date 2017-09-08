// /!\ DEPRECATED. We're using rheostat instead now.

import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import autobind                 from 'autobind-decorator';
import { ProgressBar }          from 'react-toolbox/src/components/progress_bar';
import { prefixer }             from 'react-toolbox/lib/utils';

class RangeProgress extends PureComponent {
  static propTypes = Object.assign({}, ProgressBar.propTypes, {
    value: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.shape({
        from: PropTypes.number,
        to: PropTypes.number,
      }),
    ]),
  });

  static defaultProps = Object.assign({}, ProgressBar.defaultProps);

  @autobind
  calculateRatio(value) {
    if (value < this.props.min) return 0;
    if (value > this.props.max) return 1;
    return (value - this.props.min) / (this.props.max - this.props.min);
  }

  @autobind
  linearStyle() {
    const { value } = this.props;

    return {
      value: prefixer({
        transform:
          `translateX(${this.calculateRatio(value.from) * 100}%)
          scaleX(${this.calculateRatio(value.to - value.from)})`,
      }),
    };
  }

  render() {
    return (
      <ProgressBar
        {...this.props}
        {...this.state}
        linearStyle={this.linearStyle}
        value={0}
        mode="determinate"
      />
    );
  }
}

export { RangeProgress };
