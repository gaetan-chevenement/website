import SearchForm from '~/containers/search/SearchForm';

export default function SearchPage({ city }) {
  return (
    <SearchForm city={city} />
  );
}
