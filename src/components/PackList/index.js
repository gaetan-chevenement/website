import { IntlProvider, Text } from 'preact-i18n';
import {
  Card,
  CardTitle,
  CardText,
  CardActions,
}                             from 'react-toolbox/lib/card';
import {
  List,
  ListItem,
  ListSubHeader,
}                             from 'react-toolbox/lib/list';
import { Button }             from 'react-toolbox/lib/button';
import _const                 from '~/const';
import Utils                  from '~/utils';
import style                  from './style.css';

const { PACK_PRICES } = _const;

function PackList(args) {
  const { handlePackChange, lang, isPriceHidden, city, pack, minPack } = args;
  // limit the list of choice depending on minPack in URL
  const packCardArgs = [
    minPack !== 'comfort' && minPack !== 'privilege' && 'basic',
    minPack !== 'privilege' && 'comfort',
    'privilege',
  ].filter(Boolean);

  return (
    <IntlProvider definition={definition[lang]}>
      <p class="grid-3-large-1 has-gutter">
        {packCardArgs.map((name) => (
          <PackCard
            {...{
              ...packs[name][lang],
              stars: packs[name].stars,
              price: !isPriceHidden && city && PACK_PRICES[city][name],
              isActive: pack === name,
              name,
              handlePackChange,
            }}
          />
        ))}
      </p>
    </IntlProvider>
  );
}

function PackCard(args) {
  const {
    isActive,
    price,
    stars,
    title,
    subtitle,
    listHeader,
    listItems,
    name,
    handlePackChange,
  } = args;

  return (
    <Card raised={isActive}>
      <CardTitle
        theme={{ cardTitle: style[`cardTitle-${name}`] }}
        title={`${stars} ${title}`}
        subtitle={<span>{subtitle}<b>{price ? ` - ${price / 100}€` : ''}</b></span>}
      />
      <CardText>
        <List>
          <ListSubHeader caption={listHeader} />
          {listItems.map((item) => (<ListItem caption={item} />))}
        </List>
      </CardText>
      { handlePackChange ? (
        <CardActions>
          <Button raised
            primary={isActive}
            label={<Text id="select" fields={{ name: title }}>{`Choose ${title}`}</Text>}
            name="pack"
            value={name}
            onClick={handlePackChange}
          />
        </CardActions>
      ) : '' }
    </Card>
  );
}

const packs = {
  basic: {
    stars: '★',
    'fr-FR': {
      title: 'Basique',
      subtitle: 'Les principaux services pour un séjour sans stress dans votre appartement ',
      listHeader: 'Principaux services',
      listItems: [
        'Contrat individuel personnalisé',
        'Oreiller et couette',
        'Activation des services',
        'Maintenance et assistance illimitées',
      ],
    },
    'en-US': {
      title: 'Basic',
      subtitle: 'All essential services for a stress-free stay in your apartment',
      listHeader: 'Main services including',
      listItems: [
        'Customized individual contract',
        'Pillow and duvet',
        'Services activation',
        'Unlimited maintenance & assistance',
      ],
    },
    'es-ES': {
      title: 'Básico',
      subtitle: 'Todos los servicios esenciales para una estancia sin estrés en su apartamento',
      listHeader: 'Los principales servicios incluyen',
      listItems: [
        'Contrato individual personalizado',
        'Almohada y edredón',
        'Activación de servicios',
        'Mantenimiento y asistencia ilimitados',
       ],
    },
  },
  comfort: {
    stars: '★★',
    'fr-FR': {
      title: 'Confort',
      subtitle: 'Plus de facilité pour plus de confort et de sérénité ',
      listHeader: 'Tous les services du pack Basique plus :',
      listItems: [
        'Draps, oreillers et housses de couette',
        'Pack de nourriture',
        'Assistance clefs',
        'Assurance annulation - 1 mois',
      ],
    },
    'en-US': {
      title: 'Comfort',
      subtitle: 'An easier move in for more comfort and serenity',
      listHeader: 'All Basic services plus:',
      listItems: [
        'Sheets, pillow & duvet covers',
        'Food pack',
        'Keys assistance',
        'Cancellation insurance - 1 month',
      ],
    },
     'es-ES': {
      title: 'Comfort',
      subtitle: 'Una entrada más fácil para más comodidad y serenidad',
      listHeader: 'Todos los servicios básicos más:',
      listItems: [
        'Sábanas, almohadas y fundas nórdicas',
        'Paquete de comida',
        'Asistencia de llaves',
        'Seguro de cancelación - 1 mes',
       ],
    },
  },
  privilege: {
    stars: '★★★',
    'fr-FR': {
      title: 'Privilège',
      subtitle: 'Services personnalisés pour un support client complet et attentif ',
      listHeader: 'Tous les services du pack Confort plus :',
      listItems: [
        'Chauffeur privé de l\'aéroport/gare',
        'Service de bagagerie',
        'Agent Dédié',
        'Assurance annulation - 7 jours',
      ],
    },
    'en-US': {
      title: 'Privilege',
      subtitle: 'Personalized services for a complete and careful support',
      listHeader: 'All Comfort services plus:',
      listItems: [
        'Private driver from airport/train station',
        'Luggage service',
        'Dedicated agent',
        'Cancellation insurance - 7 days',
      ],
    },
    'es-ES': {
      title: 'Privilegio',
      subtitle: 'Servicios personalizados para un soporte completo y cuidadoso',
      listHeader: 'Todos los servicios Comfort plus:',
      listItems: [
        'Conductor privado desde el aeropuerto/estación de tren',
        'Servicio de equipaje',
        'Agente dedicado',
        'Seguro de cancelación - 7 días',
      ],
    },
  },
};

const definition = {
  'fr-FR': {
    select: 'Choisissez {{name}}',
  },
  'es-ES': {
    select: 'Seleccione {{name}}',
  },
};
export default Utils.connectLang(PackList);
