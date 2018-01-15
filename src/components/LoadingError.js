import { IntlProvider, Text } from 'preact-i18n';
import _const                 from '~/const';

const { SUPPORT_EMAIL } = _const;

export default function LoadingError({ lang, label, error }) {
  return (
    <IntlProvider definition={definition[lang]}>
      <div class="content">
        <h1>
          <Text>An error accured while loading</Text><br />
          {label}
        </h1>

        <section>
          <p>You should try to <a href="javascript:location.reload();">reload the page</a></p>
          <p>
            If the error persists, please contact support:
            <a href={`mailto:${SUPPORT_EMAIL}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {SUPPORT_EMAIL}
            </a>
          </p>
          <p>Error: <i>{error.message}</i></p>
        </section>
      </div>
    </IntlProvider>
  );
}

const definition = { 'fr-FR': {
} };
