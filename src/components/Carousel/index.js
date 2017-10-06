import React, { PureComponent }   from 'react';
import { h }                      from 'preact';
import autobind                   from 'autobind-decorator';

/* A simple and dependency free carousel component
 * - CSS transitions based
 * - Lazy-loading (incompatible with usage of #goto method)
 */
class Carousel extends PureComponent {
  @autobind
  goto(index) {
    const { length } = this.props.children;

    if ( index === this.state.currIndex ) {
      return;
    }

    this.setState({
      prevIndex: this.state.currIndex,
      currIndex: ( index + length ) % length,
      nextIndex: ( index + length + 1 ) % length,
    });
  }

  @autobind
  next() {
    this.goto(this.state.currIndex + 1);
  }

  @autobind
  prev() {
    this.step(this.state.currIndex - 1);
  }

  constructor(props) {
    super(props);

    this.state = {
      currIndex: props.currIndex || 0,
      nextIndex: ( props.currIndex || 0 ) + 1,
    };
  }

  componentWillMount() {
    if ( this.props.autoplay ) {
      setInterval(() => (
        this.next()
      ), this.props.autoplayInterval || 3000);
    }
  }

  render({ children, className, fade, lazy }) {
    const { prevIndex, currIndex, nextIndex } = this.state;

    return (
      <div className={`${className} carousel ${fade ? 'fade' : 'slide'}`}>
        {(Array.isArray(children) ? children : [children]).map((child, i) => {
          if ( i === prevIndex ) {
            return cloneWithClass(child, 'prev');
          }
          if ( i === currIndex ) {
            return cloneWithClass(child, 'curr');
          }
          if ( i === nextIndex ) {
            return cloneWithClass(child, 'next');
          }

          // lazy rendering
          // (always render 'something' otherwise transitions won't work)
          return lazy ?
            React.createElement(child.type) :
            child;
        })}
      </div>
    );
  }
}

export default Carousel;

function cloneWithClass(elem, name) {
  const clone = React.cloneElement(elem);

  clone.props.className += ` carousel-${name}`;

  return clone;
}
