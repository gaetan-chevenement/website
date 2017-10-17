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

function  renderCardActions(packName, lang) {
  return (
    <CardActions>
      <Button raised
        label={
          <div>
            <Text id="select">Choose</Text>
            <Text id={`${packName}.lowercase`}>{packName}</Text>
          </div>
        }
        name="pack"
        value={packName}
        onClick={this.handlePackChange}
      />
    </CardActions>
  );
}

export default function PackList({ lang, packPrices, pack, minPack, renderButton }) {
  return (
    <IntlProvider definition={definition[lang]}>
      <p class="grid-3-large-1 has-gutter">
        {minPack !== 'comfort' && minPack !== 'privilege' ?
          <Card raised={pack === 'basic'}>
            <CardTitle
              title={<Text id="basic.title">★ Basic</Text>}
              subtitle={<div><Text id="basic.subtitle" >
                  All essential services for a stress-free stay in your apartment</Text> {packPrices ? `- ${packPrices.basic /100}€` : ''} </div>}
            />
            <CardText>
              <List>
                <ListSubHeader caption={<Text id="basic.first">Main services including</Text>} />
                <ListItem caption={<Text id="basic.second">Fast check-in</Text>} />
                <ListItem caption={<Text id="basic.third">Customized individual contract</Text>} />
                <ListItem caption={<Text id="basic.fourth">Pillow and duvet</Text>} />
                <ListItem caption={<Text id="basic.fifth">Services activation</Text>} />
                <ListItem caption={<Text id="basic.sixth">Unlimited maintenance &amp; assistance</Text>} />
              </List>
            </CardText>
            {renderButton ? renderCardActions('basic', lang) : ''}

          </Card> :
          ''
        }
        { minPack !== 'privilege' ?
          <Card raised={pack === 'comfort'}>
            <CardTitle
              title={<Text id="comfort.title">★★ Comfort</Text>}
              subtitle={<div><Text id="comfort.subtitle">
                  An easier move in for more comfort and serenity</Text> {packPrices ? `- ${ packPrices.comfort / 100}€` : ''} </div>
              }
            />
            <CardText>
              <List>
                <ListSubHeader caption={<Text id="comfort.first">All Basic services plus:</Text>} />
                <ListItem caption={<Text id="comfort.second">Check-in 24/7 at home</Text>} />
                <ListItem caption={<Text id="comfort.third">Sheets, pillow & duvet cases</Text>} />
                <ListItem caption={<Text id="comfort.fourth">Food pack</Text>} />
                <ListItem caption={<Text id="comfort.fifth">Booking priority</Text>} />
                <ListItem caption={<Text id="comfort.sixth">Cancellation insurance - 1 month</Text>} />
              </List>
            </CardText>
            {renderButton ? renderCardActions('comfort', lang) : ''}

          </Card> :
          ''
        }
        <Card raised={pack === 'privilege'}>
          <CardTitle
            title={<Text id="privilege.title">★★★ Privilege</Text>}
            subtitle={<div><Text id="privilege.subtitle">
                Personalized services for a complete and careful support</Text> {packPrices ? `- ${ packPrices.privilege / 100}€` : ''}</div>
            }
          />
          <CardText>
            <List>
              <ListSubHeader caption={<Text id="privilege.first">All Comfort services plus:</Text>} />
              <ListItem caption={<Text id="privilege.second">Private driver from airport/train station</Text>} />
              <ListItem caption={<Text id="privilege.third">Unlimited luggage service</Text>} />
              <ListItem caption={<Text id="privilege.fourth">Keys assistance 24/7</Text>} />
              <ListItem caption={<Text id="privilege.fifth">Checkout 24/7</Text>} />
              <ListItem caption={<Text id="privilege.sixth">Cancellation insurance - 7 days</Text>} />
            </List>
          </CardText>
          {renderButton ? renderCardActions('privilege', lang) : ''}
        </Card>
      </p>
    </IntlProvider>
  );
}

const definition = { 'fr-FR': {
  select: 'Choisir',
  basic: {
    lowercase: 'basique',
    title: '★ Basique',
    subtitle: 'Les principaux services pour un séjour sans stress dans votre appartement ',
    first: 'Principaux services',
    second: 'Checkin rapide',
    third: 'Contrat individuel personnalisé',
    fourth: 'Oreiller et couette',
    fifth: 'Activation des services',
    sixth: 'Maintenance et assistance illimitées',
  },
  comfort: {
    lowercase: 'confort',
    title: '★★ Confort',
    subtitle: 'Plus de facilité pour plus de confort et de sérénité ',
    first: 'Tous les services du pack Basique plus:',
    second: 'Checkin 24/7 au domicile',
    third: 'Draps, oreiller et housses de couette',
    fourth: 'Pack de nourriture',
    fifth: 'Priorité de réservation',
    sixth: 'Assurance annulation - 1 mois',
  },
  privilege: {
    lowercase: 'privilège',
    title: '★★★ Privilège',
    subtitle: 'Services personnalisés pour un support client complet et attentif ',
    first: 'Tous les services du pack Confort plus:',
    second: 'Chauffeur privé de l\'aéroport/gare',
    third: 'Service de bagage illimité',
    fourth: 'Assistance clefs 24/7',
    fifth: 'Checkout 24/7',
    sixth: 'Assurance annulation - 7 jours',
  },
} };
