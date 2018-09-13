import fp                     from 'lodash/fp';
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

const languages = [
  { value: 'en-US', label: '🇺🇸' },
  { value: 'fr-FR', label: '🇫🇷' },
  // { value: 'es-ES', label: '🇪🇸' },
];

// https://stackoverflow.com/questions/20514596/document-documentelement-scrolltop-return-value-differs-in-chrome
function getDocumentScrollTop() {
  if ( typeof window !== 'object' ) {
    return 0;
  }

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

  @autobind
  handleScroll() {
    this.setState({
      scrollPx: getDocumentScrollTop(),
    });
  }

  isSearchPage() {
    return /\/[^/]*\/search/.test(this.props.path);
  }

  isRoomPage() {
    return /\/[^/]*\/room/.test(this.props.path);
  }

  constructor(props) {
    super(props);

    this.state = {
      isDrawerActive: false,
      scrollPx: getDocumentScrollTop(),
    };
  }

  componentDidMount() {
    typeof window !== 'undefined' && window.document.body.addEventListener('touchmove', this.handleScroll);
    typeof window !== 'undefined' && window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    typeof window !== 'undefined' && window.document.body.removeEventListener('touchmove', this.handleScroll);
    typeof window !== 'undefined' && window.removeEventListener('scroll', this.handleScroll);
  }

  renderLeftPart() {
    const headerIsLite = this.isSearchPage() || this.isRoomPage();
    return (
      <div class={style.headerLeftPart}>
        <AppBarTitle lang={this.props.lang} isLite={headerIsLite} />
        <div class={style.headerOptionalPart}>
          { this.isSearchPage() ? <SearchPageAddon scrollPx={this.state.scrollPx} /> : null}
        </div>
      </div>
    );
  }

  render({ lang, path }) {
    return (
      <IntlProvider definition={definition[lang]}>
        <header class={style.header}>
          <div class={[style.wrapper, this.isSearchPage() ? style.wrapperLite : null].join(' ')}>
            { this.isSearchPage() ? <SearchPageAddon scrollPx={this.state.scrollPx} /> : null}
            { this.isRoomPage() ? <RoomPageAddon scrollPx={this.state.scrollPx} /> : null}

            <AppBar
              title={this.renderLeftPart()}
              rightIcon="menu"
              onRightIconClick={this.handleToggle}
              flat
              theme={style}
            >
              <AppNavigation className="hide-sm-down" type="horizontal" {...{ lang, path }} />
            </AppBar>
          </div>
          <Drawer type="right"
            active={this.state.isDrawerActive}
            onOverlayClick={this.handleToggle}
          >
            <AppNavigation type="vertical" {...{ lang, path }} />
          </Drawer>
        </header>
      </IntlProvider>
    );
  }
}

function AppBarTitle({ lang, isLite = false }) {
  return (
    <h1 class={appbarTheme.title} style={{ margin: '0 0 0 -44px' }}>
      <div>
        <Link href={`/${lang}`}>
          { isLite ?
            <img src="/assets/logo.png" alt="Chez Nestor" className={style.logoLite} />
            : <img src="/assets/logo370x130.png" alt="Chez Nestor" />
          }

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
      {fp.flow(
        fp.filter(({ value }) => lang !== value),
        fp.map(({ value, label }) => (
          <NavLink href={path.replace(/^\/[^/]{0,5}/, `/${value}`)} theme={style}>
            {label}
          </NavLink>
        ))
      )(languages)}
    </Navigation>
  );
}

function SearchPageAddon({ scrollPx }) {
  const $el = document.getElementById('city-select');
  if ( $el !== null ) {
    const show = $el.getBoundingClientRect().bottom < 0;
    console.log('should show search header', show);
  }

  return null;
}

function RoomPageAddon({ scrollPx }) {
  const $el = document.getElementById('room-anchors');
  if ( $el !== null ) {
    const showSearchHeader = $el.getBoundingClientRect().bottom < 0;
    console.log('should show anchors header', showSearchHeader);
  }

  return null;
}

function handleClickContact() {
  if (typeof window === 'object') {
    window.$crisp.push(['do', 'chat:open']);
  }
}

const definition = {
  'fr-FR': {
    included: 'Services Inclus',
    booking: 'Réserver',
  },
  'es-ES': {
    included: 'Servicios Incluidos',
    booking: 'Reservar',
  },
};

export default Utils.connectLang(Header);
