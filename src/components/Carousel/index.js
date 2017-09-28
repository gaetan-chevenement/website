import React, { PureComponent }   from 'react';
import { h }                      from 'preact';
import autobind                   from 'autobind-decorator';

function cloneWithClass(elem, name) {
  const clone = React.cloneElement(elem);

  clone.props.className += ` carousel-${name}`;

  return clone;
}

export default class Carousel extends PureComponent {
  @autobind
  step(diff) {
    const { length } = this.props.children;

    this.setState({
      currIndex: ( this.state.currIndex + length + diff ) % length,
    });
  }

  @autobind
  next() {
    this.step(+1);
  }

  @autobind
  prev() {
    this.step(-1);
  }

  constructor(props) {
    super(props);

    this.state = { currIndex: props.currIndex || 0 };
  }

  componentWillMount() {
    if ( this.props.autoplay ) {
      setInterval(() => (
        this.next()
      ), this.props.autoplayInterval || 3000);
    }
  }

  render({ children, className, fade }) {
    const { currIndex } = this.state;
    const { length } = children;

    return (
      <div className={`${className} carousel ${fade ? 'fade' : 'slide'}`}>
        {children.map((child, i) => {
          if ( i === ( currIndex + length - 1 ) % length ) {
            return cloneWithClass(child, 'prev');
          }
          if ( i === currIndex ) {
            return cloneWithClass(child, 'curr');
          }
          if ( i === ( currIndex + 1 ) % length ) {
            return cloneWithClass(child, 'next');
          }

          return child;
        })}
      </div>
    );
  }
}
