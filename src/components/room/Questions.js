import { IntlProvider, Text } from 'preact-i18n';
import { Button }             from 'react-toolbox/lib/button';
import Utils                  from '~/utils';
import PhoneButton            from '~/components/PhoneButton';
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
              <Button raised primary icon="question_answer"
                onClick={Utils.getEnquireHandler()}
              >
                <Text id="question">Ask a question</Text>
              </Button>
              <Button raised primary icon="local_see"
                onClick={Utils.getEnquireHandler(lang)}
              >
                <Text id="visit">Ask for a visit</Text>
              </Button>
            </div>
            <div className={`one-half ${style.questionsRight}`}>
              <i className={`picto-smartphonecall_64px ${style.questionsPhone}`} />
              <PhoneButton />
            </div>
          </div>
        </div>
      </div>
    </IntlProvider>
  );
}

const definition = {
  'en-US': {
    visitMsg: 'I wish to visit this room',
  },
  'fr-FR': {
    title: 'Une question ?',
    subtitle: 'Notre équipe sera ravie de vous aider !',
    question: 'Poser une question',
    visit: 'Demander une visite',
    visitMsg: 'Je souhaite visiter cette chambre',
  },
  'es-ES': {
    title: '¿Una pregunta?',
    subtitle: 'Nuestro equipo estará encantado de ayudarle!',
    question: 'Haga una pregunta',
    visit: 'Solicitar una visita',
    visitMsg: 'Deseo visitar esta habitación',
  },
};

export default Utils.connectLang(Questions);
