import SearchSuggestion from "./search";

export default function Header() {
  return (
    <div className="header">
      <div className="logo"><p>WEATHER</p> <p>APP</p></div>
      <SearchSuggestion />
    </div>
  );
}
