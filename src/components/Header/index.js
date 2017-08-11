import { h, Component } from 'preact';
import { Link } from 'preact-router/match';
import style from './style';

export default class Header extends Component {
  render() {
    return (
      <header class={style.header}>
        <div class={style.wrapper}>
          <img src="/assets/logo370x130.png" alt="Chez Nestor" style="height: 80px;" />
          <nav>
            <Link href="http://chez-nestor.com/included-services" target="_blank">
              Included Services
            </Link>
            <Link href="http://chez-nestor.com/book" target="_blank">
              Booking
            </Link>
            <Link href="http://chez-nestor.com/contact-en" target="_blank">
              Contact
            </Link>
          </nav>
        </div>
      </header>
    );
  }
}
