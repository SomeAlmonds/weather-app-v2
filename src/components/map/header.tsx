import SearchSuggestion from "./search";

export default function Header() {
  return (
    <div className="header">
      <div className="logo">
        <p>WEATHER</p>
      </div>
      <SearchSuggestion />
    </div>
  );
}
