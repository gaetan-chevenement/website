import { IntlProvider, Text } from 'preact-i18n';
import Utils                  from '~/utils';
import _const                 from '~/const';

const { SALES_EMAIL } = _const;

function LoadingError({ lang, label, error }) {
  return (
    <IntlProvider definition={definition[lang]}>
      <div class="content">
        <h1>
          <Text id="error">An error just occured while loading</Text><br />
          {label}
        </h1>

        <section>
          <p>
            <Text id="try">You should try to</Text>
            <a href="javascript:location.reload();">
              <Text id="link">reload the page</Text>
            </a>
          </p>
          <p>
            <Text id="contact">If the error persists, please contact support:</Text>
            <a href={`mailto:${SALES_EMAIL}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {SALES_EMAIL}
            </a>
          </p>
          <p>Error: <i>{error.message}</i></p>
        </section>
      </div>
    </IntlProvider>
  );
}

const definition = {
 'fr-FR': {
  error: 'Une erreur s\'est produite pendant le chargement',
  try: 'Essayez de',
  link: 'Recharger la page',
  contact: 'Si l\'erreur persiste, contactez le support',
 },
'es-ES': {
  error: 'Se ha producido un error durante la carga',
  try: 'Trate de',
  link: 'Recargar página',
  contact: 'Si el error persiste, póngase en contacto con el servicio de asistencia técnica',
 },
};

export default Utils.connectLang(LoadingError);
