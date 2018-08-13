import { Component }          from 'react';
import { IntlProvider, Text } from 'preact-i18n';
import { Link }               from 'preact-router/match';
import autobind               from 'autobind-decorator';
import { Link as NavLink }    from 'react-toolbox/lib/link';
import { AppBar }             from 'react-toolbox/lib/app_bar';
import { Navigation }         from 'react-toolbox/lib/navigation';
import { Drawer }             from 'react-toolbox/lib/drawer';
import appbarTheme            from 'react-toolbox/components/app_bar/theme.css';
import Utils                  from '~/utils';
import style                  from './style';
import SearchForm             from '../SearchForm';
import CreateAlertButton from "../CreateAlertButton";

// https://stackoverflow.com/questions/20514596/document-documentelement-scrolltop-return-value-differs-in-chrome
function getDocumentScrollTop() {
  return window.scrollY
    || window.pageYOffset
    || document.body.scrollTop + (document.documentElement
      && document.documentElement.scrollTop || 0);
}


class Header extends Component {
  @autobind
  handleToggle() {
    this.setState({ isDrawerActive: !this.state.isDrawerActive });
  }

  constructor(props) {
    super(props);

    this.state = {
      isDrawerActive: false,
      scrollPx: getDocumentScrollTop()
    };
  }

  @autobind
  handleScroll() {
    this.setState({
      scrollPx: getDocumentScrollTop()
    })
  }

  componentDidMount() {
    typeof window !== 'undefined' && window.document.body.addEventListener('touchmove', this.handleScroll);
    typeof window !== 'undefined' && window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    typeof window !== 'undefined' && window.document.body.removeEventListener('touchmove', this.handleScroll);
    typeof window !== 'undefined' && window.removeEventListener('scroll', this.handleScroll);
  }

  isSearchPage() {
    return /\/[^/]*\/search/.test(this.props.path);
  }

  isRoomPage() {
    return /\/[^/]*\/room/.test(this.props.path);
  }

  renderLeftPart() {
    const headerIsLite = this.isSearchPage() || this.isRoomPage();
    return (
      <div class={style.headerLeftPart}>
        <AppBarTitle lang={this.props.lang} isLite={headerIsLite} handleToggle={this.handleToggle} />
        <div class={style.headerOptionalPart}>
          { this.isSearchPage() ? (
              <SearchForm mode="firstline"/> ) : null
          }
        </div>
      </div>
    );
  }

  render({ lang, path }) {
    const headerClasses = [
      style.header,
      this.isRoomPage() ? style.headerNotFixed : null,
      this.isSearchPage() ? style.headerMultiLine : null,
    ]
    return (
      <IntlProvider definition={definition[lang]}>
        <div>
          <header className={headerClasses.join(' ')}>
            <div>
              <div className={[style.wrapper].join(' ')}>
                <AppBar
                  title={this.renderLeftPart()}
                  flat
                  theme={style}
                >
                  <AppNavigation className="hide-md-down" type="horizontal" {...{lang, path}} />
                </AppBar>
              </div>
              <Drawer type="left"
                      active={this.state.isDrawerActive}
                      onOverlayClick={this.handleToggle}
                      theme={{wrapper: style.drawerWrapper}}
              >
                <AppNavigation type="vertical" {...{lang, path}} />
              </Drawer>
            </div>

          </header>

          {this.isSearchPage() ? (
            <div className={style.searchLine}>
              <div>
                <SearchForm mode="secondline" />
                <CreateAlertButton />
              </div>

            </div>
          ) : null
          }
        </div>
      </IntlProvider>
    );
  }
}

function AppBarTitle({ lang, isLite = false, handleToggle }) {
  const logo = isLite ?
    <img src="/assets/logo.png" alt="Chez Nestor" className={style.logoLite} />
    : <img src="/assets/logo370x130.png" alt="Chez Nestor" />;

  return (
    <h1 class={appbarTheme.title} style={{ margin: '0 0 0 -22px' }}>
      <div className="hide-lg-up">
        <div onClick={handleToggle}>
          { logo }
          >
        </div>
      </div>
      <div className="hide-md-down">
        <Link href={`/${lang}`} >
          { logo }
        </Link>
      </div>
    </h1>
  );
}

function AppNavigation({ lang, path, type, className }) {
  return (
    <Navigation className={className} type={type} theme={style}>
      <NavLink href={`/${lang}/services`} theme={style}>
        <Text id="included">Included Services</Text>
      </NavLink>
      <NavLink href={`/${lang}/booking-process`} theme={style}>
        <Text id="booking">Booking</Text>
      </NavLink>
      <a onClick={handleClickContact} theme={style}>
        Contact
      </a>
      {['en-US', 'fr-FR']
        .filter((val) => lang !== val)
        .map((val) => (
          <NavLink href={path.replace(/^\/[^/]{0,5}/, `/${val}`)} theme={style}>
            {val.split('-')[0].toUpperCase()}
          </NavLink>
        ))
      }
    </Navigation>
  );
}

function handleClickContact() {
  window.$crisp.push(['do', 'chat:open']);
}

const definition = { 'fr-FR': {
  included: 'Services Inclus',
  booking: 'Réserver',
} };

export default Utils.connectLang(Header);
