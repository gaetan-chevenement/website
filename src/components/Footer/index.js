import { h }              from 'preact';
import {
  footer,
  social,
}                         from './style';

export default function Footer({ lang }) {
  return (
    <footer class={footer}>
      <div class="content">
        <h2 class="text-center">
          <img src="/assets/logo370x130.png" alt="Chez Nestor" width="185" />
        </h2>
        <div class="grid-3-large-1 has-gutter-xl">
          <nav>
            <ul>
              <li>
                <a href={`${lang}/search`}>
                  Rechercher un appartement
                </a>
              </li>
              <li>
                <a href={`${lang}/services`}>
                  Services inclus
                </a>
              </li>
              <li>
                <a href={`${lang}/booking`}>
                  Réserver
                </a>
              </li>
              <br />
              <li>
                <a href={`${lang}/search/lyon`}>
                  trouver un appartement à Lyon
                </a>
              </li>
              <li>
                <a href={`${lang}/search/paris`}>
                  trouver un appartement à Paris
                </a>
              </li>
              <li>
                <a href={`${lang}/search/montpellier`}>
                  trouver un appartement à Montpellier
                </a>
              </li>
            </ul>
          </nav>

          <nav>
            <ul>
              <li class={social}>
                <a class="brandico-facebook-rect" />
                <a class="brandico-linkedin-rect" />
                <a class="brandico-googleplus-rect" />
                <a href={`${lang}/contact`}>
                  Support
                </a>
              </li>
              <li>&nbsp;</li>
              <li><a>Housing Pack</a></li>
              <li><a>Check-in</a></li>
              <li><a>Loyers, charges et CAF</a></li>
            </ul>
          </nav>

          <nav>
            <ul>
              <li>
                <a href="http://career.chez-nestor.com/#section-32032">
                  À propos de Chez Nestor
                </a>
              </li>
              <li>
                <a href="http://career.chez-nestor.com/#section-32032">
                  L'équipe
                </a>
              </li>
              <li>
                <a href="http://career.chez-nestor.com/">
                  Travailler Chez Nestor
                </a>
              </li>
              <li>
                <a href="https://drive.google.com/file/d/0B8dLiyBmm3wJa1IwbWsxbk85LWs/view">
                  CGV et mentions légales
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
  );
}
