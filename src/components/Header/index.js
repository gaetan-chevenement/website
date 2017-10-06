import { IntlProvider, Text } from 'preact-i18n';
import { h }                  from 'preact';
import { Link }               from 'preact-router/match';
import style                  from './style';


export default function Header({ lang }) {
  return (
    <IntlProvider definition={definition[lang]}>
      <header class={style.header}>
        <div class={style.wrapper}>
          <Link href={`/${lang}`}>
            <img src="/assets/logo370x130.png" alt="Chez Nestor" style="height: 80px;" />
          </Link>
          <nav>
            <Link href="http://chez-nestor.com/included-services" target="_blank">
              <Text id="included">Included Services</Text>
            </Link>
            <Link href="http://chez-nestor.com/book" target="_blank">
              <Text id="booking">Booking</Text>
            </Link>
            <Link href="http://chez-nestor.com/contact-en" target="_blank">
              Contact
            </Link>
          </nav>
        </div>
      </header>
    </IntlProvider>
  );
}

const definition = { 'fr-FR': {
  included: 'Serices Inclus',
  booking: 'Réserver',
} };
