import { useState } from "react";
import { Token } from "../types/token";
import { DropdownMenu } from "./DropdownMenu";
import { useClickAway } from "../hooks/useClickAway";

interface InputProps {
  label: string;
  tokens: Token[];
  selectedToken?: Token;
  onChangeToken: (token: Token) => void;
  onFocusInput: () => void;
}

export function Input({
  label,
  tokens,
  selectedToken,
  onChangeToken,
  onFocusInput,
}: InputProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useClickAway<HTMLDivElement>(() =>
    setShowDropdown(false)
  );

  return (
    <div className="flex">
      <div>
        <button
          className="flex-shrink-0 z-10 inline-flex items-center py-2 px-2 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100"
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {selectedToken ? (
            <div className="flex items-center justify-center gap-2 cursor-pointer rounded w-24">
              <img
                loading="lazy"
                src={`${
                  window.location.origin
                }/images/tokens/${selectedToken.currency.toLowerCase()}.svg`}
                width={24}
              />
              {selectedToken.currency}
            </div>
          ) : (
            "NA"
          )}
        </button>
        {showDropdown && (
          <div ref={dropdownRef}>
            <DropdownMenu
              tokens={tokens}
              onClickToken={(token) =>
                onChangeToken({ ...token, amount: selectedToken?.amount })
              }
            />
          </div>
        )}
      </div>
      <div className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44"></div>
      <div className="relative w-full">
        <input
          type="search"
          className="outline-none block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          placeholder={label}
          value={selectedToken?.amount ?? ""}
          onChange={(e) =>
            selectedToken &&
            +e.target.value < Number.MAX_VALUE &&
            onChangeToken({ ...selectedToken, amount: e.target.value })
          }
          onFocus={onFocusInput}
          required
        />
      </div>
    </div>
  );
}
