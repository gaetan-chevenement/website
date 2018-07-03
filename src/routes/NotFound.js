import { PureComponent } from 'preact-compat';
import { h } from 'preact';
import { IntlProvider, Text } from 'preact-i18n';

export default function NotFound({ lang }) {
  return (
    <IntlProvider definition={definition[lang]}>
      <div className="content notfound-content">
        <h1 className="notfound-title">
          <Text id="title">Oops!</Text>
        </h1>
        <p>
          <Text id="description">We can't seem to find the page you're looking for.</Text>
        </p>
        <p>
          <a href="/">
            <Text id="link">
              While you're here, why not have a look at our offers ?
            </Text>
          </a>
        </p>
      </div>
    </IntlProvider>
  );
}

const definition = { 'fr-FR': {
  title: 'Oups!',
  description: 'La page que vous recherchez semble introuvable.',
  link: 'Tant que vous êtes ici, pourquoi ne pas jeter un oeil à nos offres ? ',
} };
