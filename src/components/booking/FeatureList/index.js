import { h }             from 'preact';
import memoize           from 'memoize-immutable';
import featuresEn        from './features-en';
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
}                        from './style';

const features = splitOnTitles(featuresEn);
const TooltipButton = Tooltip(Button);

// Memoization is simpler at this level instead of FeatureList level as element
// receive arguments more likely to change.
const renderSublist = memoize(([header, features]) => (
  <table class={sublist}>
    <thead>
      <tr>
        <th>{header}</th>
        <th class={valueCellHeader}>Basic</th>
        <th class={valueCellHeader}>Comfort</th>
        <th class={valueCellHeader}>Privilege</th>
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
));

export default function FeatureList() {
  return (
    <div>
      {features.map(renderSublist)}
    </div>
  );
}

function splitOnTitles(features) {
  return features
    .reduce((acc, curr) => (
      curr.length === 1 ?
        acc.unshift([curr, []]) && acc :
        acc[0][1].push(curr) && acc
    ), [])
    .reverse();
}
