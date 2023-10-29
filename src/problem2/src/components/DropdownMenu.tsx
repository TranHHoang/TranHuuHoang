import { useMemo, useState } from "react";
import { Token } from "../types/token";

interface DropdownMenuProps {
  tokens: Token[];
  onClickToken: (token: Token) => void;
}

export function DropdownMenu({ tokens, onClickToken }: DropdownMenuProps) {
  const [search, setSearch] = useState("");

  const filteredTokens = useMemo(
    () =>
      tokens.filter((tok) =>
        tok.currency.toLowerCase().includes(search.toLowerCase())
      ),
    [search, tokens]
  );

  return (
    <div className="z-10 bg-white rounded-lg shadow w-60 absolute">
      <div className="p-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="text"
            id="input-group-search"
            className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search Token"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <ul
        className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700"
        aria-labelledby="dropdownSearchButton"
      >
        {filteredTokens.map((token) => (
          <li key={token.currency} onClick={() => onClickToken(token)}>
            <div className="flex items-center p-3 gap-2 cursor-pointer rounded hover:bg-gray-100">
              <img
                loading="lazy"
                src={`${
                  window.location.origin
                }/images/tokens/${token.currency.toLowerCase()}.svg`}
                width={24}
              />
              {token.currency}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
