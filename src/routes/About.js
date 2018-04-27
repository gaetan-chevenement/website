import { IntlProvider, Text } from 'preact-i18n';

export default function Services({ lang }) {
  return (
    <IntlProvider definition={definition[lang]}>
      <div class="content">
        <h1>
          <Text id="title">About</Text>
        </h1>
      </div>
    </IntlProvider>
  );
}

const definition = { 'fr-FR': {
  title: 'À propos',
} };
