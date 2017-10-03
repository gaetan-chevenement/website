import { h }             from 'preact';
import { IntlProvider, Text }       from 'preact-i18n';
import memoize           from 'memoize-immutable';
import featuresEn        from './features-en';
import featuresFr        from './features-fr';
import { Button }        from 'react-toolbox/lib/button';
import Tooltip           from 'react-toolbox/lib/tooltip';
import {
  sublist,
  valueCell,
  valueText,
  valueCellHeader,
  button,
  featureCell,
  featureLabel,
  featureDetails,
}                        from './style.css';

const TooltipButton = Tooltip(Button);

// Memoization is simpler at this level instead of FeatureList level as element
// receive arguments more likely to change.
const renderSublist = memoize(([header, features], lang) => (
  <IntlProvider definition={definition[lang]}>
    <table class={sublist}>
      <thead>
        <tr>
          <th>{header}</th>
          <th class={valueCellHeader}><Text id="basic">Basic</Text></th>
          <th class={valueCellHeader}><Text id="comfort">Comfort</Text></th>
          <th class={valueCellHeader}><Text id="privilege">Privilege</Text></th>
        </tr>
      </thead>
      <tbody>
        {features.map(([label, tooltip, ...values]) => (
          <tr>
            <td class={featureCell}>
              <span class={featureLabel}>
                <TooltipButton
                  label={`${label}`}
                  tooltip={`${label.toUpperCase()} — ${tooltip}`}
                  tooltipShowOnClick
                  theme={({ button })}
                  ripple={false}
                />
              </span>
              <span class={featureDetails}>— {tooltip}</span>
            </td>
            {values.map((value) => (
              <td class={valueCell}>
                {typeof value === 'string' ?
                  <span class={valueText}>{value}</span> : ( value ? '✔' : '✘' )
                }
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </IntlProvider>
));

export default function FeatureList({ lang }) {
  const features =
    lang === 'fr-FR' ? splitOnTitles(featuresFr) : splitOnTitles(featuresEn);

  return (
    <div>
      {features.map((feature) => renderSublist(feature, lang)) }
    </div>
  );
}

const definition = { 'fr-FR': {
  basic: 'Basique',
  comfort: 'Confort',
  privilege: 'Privilège',
} };


function splitOnTitles(features) {
  return features
    .reduce((acc, curr) => (
      curr.length === 1 ?
        acc.unshift([curr, []]) && acc :
        acc[0][1].push(curr) && acc
    ), [])
    .reverse();
}
