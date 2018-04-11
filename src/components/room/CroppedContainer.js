import { PureComponent }      from 'react';
import autobind               from 'autobind-decorator';
import { IntlProvider, Text } from 'preact-i18n';
import Utils                  from '~/utils';
import style                  from './style.css';

class CroppedContainer extends PureComponent {
  @autobind
  handleToggleClick() {
    this.setState({
      showAll: ! this.state.showAll,
      toggledOnce: true,
    });
  }

  @autobind
  setRefFunc(container) {
    this.setState({ container });
  }

  constructor() {
    super();
    this.state = {
      showAll: false,
      container: null,
      toggledOnce: false,
    };
  }

  render({ lang }) {
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
      <IntlProvider definition={definition[lang]}>
        <div className={style.croppedCont}>
          <div className={style.croppedContCont} style={elstyle} ref={this.setRefFunc}>
            {children}
            {isOverflowing && <div className={style.croppedContOverlay} /> }
          </div>
          { ( isOverflowing || showAll ) && (
            <div className={style.shortcut} onClick={this.handleToggleClick}>
              { showAll ?
                <Text id="less">Show less ↑</Text> :
                <Text id="more">Show more ↓</Text> }
            </div>
          ) }
        </div>
      </IntlProvider>
    );
  }
}

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

const definition = { 'fr-FR': {

} };

export default Utils.connectLang(CroppedContainer);
