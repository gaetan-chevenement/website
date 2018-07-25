import { h } from 'preact';
import Page from './Page';

export default function NotFound({ lang }) {
  return (
    <Page slug={'404'} lang={lang} noRedirect />
  );
}
