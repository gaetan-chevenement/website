import { IntlProvider, Text } from 'preact-i18n';
import Utils                  from '~/utils';
import style                  from './style.css';

function SameSearchCount({ lang, count }) {
  return (
    <IntlProvider definition={definition[lang]}>
      <p class={style.message} style="display: flex;">
        <i class="material-icons">timer</i>
        &nbsp;
        <Text id="count" fields={{ count }}>
          {`${count} visitors made the same search this week.`}
        </Text>
      </p>
    </IntlProvider>
  );
}

const definition = {
  'fr-FR': {
    count: '{{count}} personnes ont fait la même recherche cette semaine.',
  },
  'es-ES': {
    count: '{{count}} personas hicieron la misma busqueda esta semana.',
  },
};

export default Utils.connectLang(SameSearchCount);
