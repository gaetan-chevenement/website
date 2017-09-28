import { h }              from 'preact';
import { footer }         from './style';

export default function Footer() {
  return (
    <footer class={footer}>
      <div class="content">
        <div class="grid-3-large-1 has-gutter-xl">
          <nav>
            <a>Rechercher un appartement</a>
            <a>Services inclus</a>
            <a>Réserver</a>
            <br />
            <a>Louer un appartement à Lyon</a>
            <a>Louer un appartement à Paris</a>
            <a>Louer un appartement à Montpellier</a>
          </nav>

          <nav>
            <a>Centre d'assistance</a>
            <br />
            <a>Comment réserver</a>
            <a>Packs logement</a>
            <a>Check-in</a>
            <a>Loyers charges et CAF</a>
          </nav>

          <nav>
            <a>Centre d'assistance</a>
            <br />
            <a>Comment réserver</a>
            <a>Packs logement</a>
            <a>Check-in</a>
            <a>Loyers charges et CAF</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
