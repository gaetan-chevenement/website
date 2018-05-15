import { IntlProvider, Text } from 'preact-i18n';
import Utils                  from '~/utils';
import _const                 from '~/const';
import {
  footer,
  social,
}                             from './style';

const { SALES_EMAIL } = _const;

function Footer({ lang }) {
  return (
    <IntlProvider definition={definition[lang]}>
      <footer class={footer}>
        <div class="content">
          <h2 class="text-center">
            <img src="/assets/logo370x130.png" alt="Chez Nestor" width="185" />
          </h2>
          <div class="grid-3-large-1 has-gutter-xl">
            <nav>
              <ul>
                <li>
                  <a href={`/${lang}/services`}>
                    <Text id="services">Included Services</Text>
                  </a>
                </li>
                <li>
                  <a href={`/${lang}/booking`}>
                    <Text id="booking">Booking</Text>
                  </a>
                </li>
                <li>
                  <a href="https://drive.google.com/file/d/0B8dLiyBmm3wJa1IwbWsxbk85LWs/view">
                    <Text id="terms">Terms and Conditions [fr]</Text>
                  </a>
                </li>
              </ul>
            </nav>

            <nav>
              <ul>
                <li class={social}>
                  <a href="https://www.facebook.com/cheznestor/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg viewBox="0 0 266.894 266.895">
                      <path fill="#fff" d="M252.164 0H14.73C6.594 0 0 6.594 0 14.73v237.434c0 8.135 6.594 14.73 14.73 14.73h127.827V163.54h-34.782v-40.28h34.782V93.553c0-34.472 21.054-53.243 51.806-53.243 14.73 0 27.39 1.097 31.08 1.587v36.026l-21.328.01c-16.724 0-19.963 7.947-19.963 19.61v25.716h39.887l-5.194 40.28h-34.694v103.355h68.012c8.135 0 14.73-6.596 14.73-14.73V14.73c0-8.136-6.595-14.73-14.73-14.73" />
                    </svg>
                  </a>
                  &nbsp;&nbsp;&nbsp;
                  <a href="https://www.linkedin.com/company/10667913/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg viewBox="0 0 192 192">
                      <path fill="#fff" d="M163.608 163.61h-28.46v-44.56c0-10.63-.193-24.297-14.796-24.297-14.82 0-17.09 11.577-17.09 23.528v45.33H74.807V71.98h27.318v12.52h.38c3.798-7.205 13.088-14.8 26.943-14.8 28.837 0 34.16 18.977 34.16 43.647zM42.713 59.455c-9.128 0-16.516-7.4-16.516-16.516 0-9.107 7.388-16.507 16.516-16.507 9.103 0 16.502 7.4 16.502 16.507 0 9.115-7.4 16.516-16.502 16.516zM56.945 163.61h-28.48V71.98h28.48zM177.79 0H14.173C6.352 0 0 6.197 0 13.84v164.305C0 185.793 6.353 192 14.172 192h163.62c7.83 0 14.21-6.207 14.21-13.855V13.84c0-7.643-6.38-13.84-14.21-13.84" />
                    </svg>
                  </a>
                  &nbsp;&nbsp;&nbsp;
                </li>
                <li>
                  <a href={`/${lang}/contact`}>
                    Contact
                  </a>
                </li>
              </ul>
            </nav>

            <nav>
              <ul>
                <li>
                  <a href={`/${lang}/about`}>
                    <Text id="about">About Chez Nestor</Text>
                  </a>
                </li>
                <li>
                  <a href="https://blog.chez-nestor.com/">
                    <Text id="team">Blog</Text>
                  </a>
                </li>
                <li>
                  <a href="https://career.chez-nestor.com/">
                    <Text id="career">Jobs</Text>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <p class="text-center">
            <i>© Chez Nestor {new Date().getFullYear()}</i>
          </p>
        </div>
      </footer>
    </IntlProvider>
  );
}

const definition = { 'fr-FR': {
  services: 'Services Inclus',
  booking: 'Réserver',
  about: 'À propos de Chez Nestor',
  team: 'L\'équipe',
  career: 'Travailler Chez Nestor',
  terms: 'CGV et mentions légales',
} };

export default Utils.connectLang(Footer);
