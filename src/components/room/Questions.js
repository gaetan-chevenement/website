import { IntlProvider, Text } from 'preact-i18n';
import { Button }             from 'react-toolbox/lib/button';
import Utils                  from '~/utils';
import style                  from './style.css';

function Questions({ lang }) {
  return (
    <IntlProvider definition={definition[lang]}>
      <div className={style.questions}>
        <div className="content">
          <h2 className="text-center">
            <Text id="title">Any question?</Text>
          </h2>
          <div className={`text-center ${style.questionsSubtitle}`}>
            <Text id="subtitle">Our team will be pleased to help you!</Text>
          </div>
          <div className="grid-2">
            <div className={`one-half ${style.questionsLeft}`}>
              <Button raised primary icon="question_answer">
                <Text id="question">Ask for a question</Text>
              </Button>
              <Button raised primary icon="local_see">
                <Text id="visit">Ask for a visit</Text>
              </Button>
            </div>
            <div className={`one-half ${style.questionsRight}`}>
              <i className={`picto-smartphonecall_64px ${style.questionsPhone}`} />
              <div>
                <Button raised icon="phone" href="tel:0033972323102">
                  <Text id="phone">+33 972 323 102</Text>
                </Button>
                <div className={style.questionsCoords}>
                  <Text id="opening">Monday to Friday from 9am to 6pm</Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </IntlProvider>
  );
}

const definition = { 'fr-FR': {
  title: 'Une question ?',
  subtitle: 'Notre équipe sera ravie de vous aider !',
  question: 'Poser une question',
  visit: 'Demander une visite',
  phone: '0 972 323 102',
  opening: 'Du lundi au vendredi de 9h à 18h',
} };

export default Utils.connectLang(Questions);
