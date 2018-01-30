import style from '~/containers/room/style.css';
import { Component } from 'preact';


// https://stackoverflow.com/questions/143815/determine-if-an-html-elements-content-overflows
function checkOverflow(el) {
  let curOverflow = el.style.overflow;

  if ( !curOverflow || curOverflow === 'visible' )
    el.style.overflow = 'hidden';

  let isOverflowing = el.clientWidth < el.scrollWidth
      || el.clientHeight < el.scrollHeight;

  el.style.overflow = curOverflow;

  return isOverflowing;
}

const ContButton = ({ onClick, toggled }) => (
  <div className={style.shortcut} onClick={onClick}>
    { toggled ? 'Masquer ↑' : 'Voir plus ↓' }
  </div>
);

class CroppedContainer extends Component {
  constructor() {
    super();
    this.state = {
      showAll: false,
      container: null,
      toggledOnce: false
    };
    this.__toggleFunc = () => this.setState({
      showAll: ! this.state.showAll,
      toggledOnce: true,
    });
    this.__setRefFunc = container => this.setState({ container });
  }

  render() {
    const { children, height } = this.props;
    const { showAll, container, toggledOnce } = this.state;

    let elstyle = {
      transition: 'max-height 500ms ease-out',
      maxHeight: '2000px' ,
    };

    let isOverflowing = false;

    if (!showAll && (toggledOnce || container === null || checkOverflow(container))) {
      isOverflowing = true;
      elstyle.maxHeight = `${height}px`;
      elstyle.overflow = 'hidden';
    }

    return (
      <div className={style.croppedCont}>
        <div className={style.croppedContCont} style={elstyle} ref={this.__setRefFunc}>
          {children}
          {isOverflowing ? <div className={style.croppedContOverlay} /> : null }
        </div>
        { isOverflowing || showAll ? <ContButton onClick={this.__toggleFunc} toggled={showAll} /> : null }

      </div>
    );
  }
}

export default CroppedContainer;
