import { IntlProvider, Text } from 'preact-i18n';
import { Button }             from 'react-toolbox/lib/button/index';
import Utils                  from '~/utils';
import style                  from './style.css';

function Services({ lang }) {
  return (
    <IntlProvider definition={definition[lang]}>
      <section>
        <div class="grid-6-large-2 grid-6-small-1 has-gutter">
          {definition[lang].list.map((s, i) => (
            <Service
              title={s.title}
              subtitle={s.subtitle}
              image={require(`../../../assets/home/experience-${i+1}-imageoptim.png`)}
            />
          ))}
        </div>
        <div className="button-bar text-center">
          <Button href={`/${lang}/services`} theme={style}>
            <Text id="discover">Discover all included services</Text>
          </Button>
        </div>
      </section>
    </IntlProvider>
  );
}

function Service({ title, subtitle, image }) {
  return (
    <div className={style.service}>
      <img src={image} alt={title} />
      <h3>
        {' '}{title}{' '}
      </h3>
      <h4>
        {' '}{subtitle}{' '}
      </h4>
    </div>
  );
}

const definition = {
  'en-US': {
    list: [{
      title: 'Central location',
      subtitle: 'In the heart of the city',
    }, {
      title: 'Furnished',
      subtitle: 'From A to Z',
    }, {
      title: 'Fully equipped',
      subtitle: 'From top to bottom',
    }, {
      title: 'All inclusive',
      subtitle: 'Insurance, water, gas…',
    }, {
      title: 'Wifi',
      subtitle: 'High bandwidth',
    }, {
      title: '3 clicks',
      subtitle: 'to complete booking',
    }],
  },
  'fr-FR': {
    discover: 'Découvrez nos services inclus',
    list: [{
      title: 'Plein centre',
      subtitle: 'Au cœur de la ville',
    }, {
      title: 'Meublé',
      subtitle: 'De A à Z',
    }, {
      title: 'Équipé',
      subtitle: 'Du sol au plafond',
    }, {
      title: 'Tout inclus',
      subtitle: 'Assurance, eau, gaz…',
    }, {
      title: 'Wifi',
      subtitle: 'Haut débit',
    }, {
      title: '3 clics',
      subtitle: 'Pour réserver',
    }],
  },
   'es-ES': {
    discover: 'Descubra nuestros servicios incluidos',
    list: [{
      title: 'Centro de la ciudad',
      subtitle: 'En pleno centro de la ciudad',
    }, {
      title: 'Amueblado',
      subtitle: 'De la A a la Z',
    }, {
      title: 'Equipado',
      subtitle: 'Del suelo al techo',
    }, {
      title: 'Todo Incluido',
      subtitle: 'Seguro, agua, gas...',
    }, {
      title: 'Wifi',
      subtitle: 'Alta velocidad',
    }, {
      title: '3 clicks',
      subtitle: 'Para reservar',
  }],
};

export default Utils.connectLang(Services);
