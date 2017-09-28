/**
 * Created by flb on 17/08/2017.
 */
import { ContentSearchEngine } from '~/content';
import theme from './style.css';
import SearchEngineForm from '../SearchEngineForm';

export default function SearchEngine() {
  return (
    <div className={theme.searchEngine}>
      <h1 style="margin: 1rem 0; font-weight: bold;">
        {ContentSearchEngine.texts.title}
      </h1>
      <div className={theme.subtitle}>
        {ContentSearchEngine.texts.subtitle}
      </div>
      <SearchEngineForm />
    </div>
  );
}
