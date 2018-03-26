import { PureComponent }      from 'react';
import { IntlProvider, Text } from 'preact-i18n';
import { h }                  from 'preact';
import { Link }               from 'preact-router/match';
import autobind               from 'autobind-decorator';
import { Link as NavLink }    from 'react-toolbox/lib/link';
import { AppBar }             from 'react-toolbox/lib/app_bar';
import { Navigation }         from 'react-toolbox/lib/navigation';
import { Drawer }             from 'react-toolbox/lib/drawer';

import appbarTheme            from 'react-toolbox/components/app_bar/theme.css';
import style                  from './style';

class Header extends PureComponent {
  @autobind
  handleToggle() {
    this.setState({ isDrawerActive: !this.state.isDrawerActive });
  }

  constructor(props) {
    super(props);

    this.state = { isDrawerActive: false };
  }

  render({ lang }) {
    return (
      <IntlProvider definition={definition[lang]}>
        <header class={style.header}>
          <div class={style.wrapper}>
            <AppBar
              title={<AppBarTitle lang={lang} />}
              rightIcon="menu"
              onRightIconClick={this.handleToggle}
              flat
              theme={style}
            >
              <AppNavigation className="hide-sm-down" type="horizontal" lang={lang} />
            </AppBar>
          </div>
          <Drawer type="right"
            active={this.state.isDrawerActive}
            onOverlayClick={this.handleToggle}
          >
            <AppNavigation type="vertical" lang={lang} />
          </Drawer>
        </header>
      </IntlProvider>
    );
  }
}

function AppBarTitle({ lang }) {
  return (
    <h1 class={appbarTheme.title} style={{ margin: '0 0 0 -44px' }}>
      <div>
        <Link href={`/${lang}`}>
          <img src="/assets/logo370x130.png" alt="Chez Nestor" />
        </Link>
      </div>
    </h1>
  );
}

function AppNavigation({ type, lang, className }) {
  return (
    <IntlProvider definition={definition[lang]}>
      <Navigation className={className} type={type} theme={style}>
        <NavLink href={`/${lang}/services`} theme={style}>
          <Text id="included">Included Services</Text>
        </NavLink>
        <NavLink href={`/${lang}/booking-process`} theme={style}>
          <Text id="booking">Booking</Text>
        </NavLink>
        <NavLink href="http://chez-nestor.com/contact-en" target="_blank" theme={style}>
          Contact
        </NavLink>
      </Navigation>
    </IntlProvider>
  );
}

export default Header;

const definition = { 'fr-FR': {
  included: 'Services Inclus',
  booking: 'Réserver',
} };
