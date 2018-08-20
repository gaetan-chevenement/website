import React, { PureComponent }   from 'react';
import autobind                   from 'autobind-decorator';

/* A simple and dependency free carousel component
 * - CSS transitions based
 * - Lazy-loading (incompatible with usage of #goto method)
 */
class Carousel extends PureComponent {
  @autobind
  goto(index) {
    const { length } = this.props.children || [];

    if ( ( index + length ) % length === this.state.currIndex ) {
      return;
    }

    this.setState({
      prevIndex: this.state.currIndex,
      currIndex: ( index + length ) % length,
      nextIndex: ( index + length + 1 ) % length,
    });
  }

  @autobind
  next(e) {
    preventDefault(e);
    this.goto(this.state.currIndex + 1);
  }

  @autobind
  prev(e) {
    preventDefault(e);
    this.goto(this.state.currIndex - 1);
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

  renderArrows() {
    return (
      <div class="carousel-arrows">
        <div class="carousel-arrow-left" onClick={this.prev}>
          <span>❬</span>
        </div>
        <div class="carousel-arrow-right" onClick={this.next}>
          <span>❭</span>
        </div>
      </div>
    );
  }

  render({ children, className, fade, lazy, arrows }) {
    const { prevIndex, currIndex, nextIndex } = this.state;

    return (
      <div className={`${className} carousel-wrapper`}>
        { arrows && children.length > 1 ? this.renderArrows() : '' }
        <div className={`carousel ${fade ? 'fade' : 'slide'}`}>
          {(Array.isArray(children) ? children : [children]).map((child, i) => {
            if ( !child ) {
              return '';
            }
            if ( i === currIndex ) {
              return cloneWithClass(child, 'curr');
            }
            if ( i === nextIndex ) {
              return cloneWithClass(child, 'next');
            }
            if ( i === prevIndex ) {
              return cloneWithClass(child, 'prev');
            }

            // lazy rendering
            // (always render 'something' otherwise transitions won't work)
            return lazy ?
              React.createElement(child.type) :
              child;
          })}
        </div>
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

function preventDefault(e) {
  if ( e ) {
    e.preventDefault();
    e.stopPropagation();
  }
}
