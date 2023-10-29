import React, { useEffect, useState } from "react";
import { Input } from "./components/Input";
import { LoadingIndicator } from "./components/LoadingIndicator";
import { Token } from "./types/token";

function App() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [first, setFirst] = useState<Token | undefined>();
  const [second, setSecond] = useState<Token | undefined>();
  const [message, setMessage] = useState<string | undefined>();
  const [lastTouchedInput, setLastTouchedInput] = useState<"From" | "To">(
    "From"
  );

  function onConfirmSwap(e: React.FormEvent) {
    e.preventDefault();

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setMessage(
        `Successfully swap '${first?.amount} ${first?.currency}' to '${second?.amount} ${second?.currency}'`
      );
      setTimeout(() => {
        setMessage(undefined);
      }, 1000);
    }, 2000);
  }

  useEffect(() => {
    const controller = new AbortController();

    fetch("https://interview.switcheo.com/prices.json", {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data: Token[]) => {
        setIsLoading(false);

        data.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
        // Only keep the latest prices
        const uniqueData = data.filter((value, index) =>
          // Only keep the current value only if after this one there is no such a value with the same currency
          data.slice(index + 1).every((v) => v.currency !== value.currency)
        );
        setTokens(uniqueData);

        const usd = uniqueData.find((d) => d.currency === "USD");
        setFirst(usd);
        setSecond(usd);
      });

    return () => controller.abort();
  }, []);

  function onChangeFirstToken(token: Token) {
    setFirst(token);
    if (!second) return;

    if (lastTouchedInput === "From") {
      setSecond({ ...second, amount: exchange(token, second).toString() });
    } else if (token.amount != null) {
      setFirst({ ...token, amount: exchange(second, token).toString() });
    }
  }

  function onChangeSecondToken(token: Token) {
    setSecond(token);
    if (!first) return;

    if (lastTouchedInput === "To") {
      setFirst({ ...first, amount: exchange(token, first).toString() });
    } else if (token.amount != null) {
      setSecond({ ...token, amount: exchange(first, token).toString() });
    }
  }

  function exchange(from: Token, to: Token) {
    // y = x.a / b
    return (from.price * Number(from.amount ?? 0)) / to.price;
  }

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-r from-green-400 to-blue-500">
      {isLoading ? (
        <LoadingIndicator />
      ) : message ? (
        <div className="font-bold">{message}</div>
      ) : (
        <form className="flex flex-col gap-2" onSubmit={onConfirmSwap}>
          <div className="flex gap-2 items-center max-sm:flex-col">
            <Input
              label="From"
              tokens={tokens}
              selectedToken={first}
              onChangeToken={onChangeFirstToken}
              onFocusInput={() => setLastTouchedInput("From")}
            />
            <div className="flex justify-center max-sm:rotate-90">
              <svg
                className="w-3.5 h-3.5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                ></path>
              </svg>
            </div>
            <Input
              label="To"
              tokens={tokens}
              selectedToken={second}
              onChangeToken={onChangeSecondToken}
              onFocusInput={() => setLastTouchedInput("To")}
            />
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-3"
          >
            Confirm Swap
          </button>
        </form>
      )}
    </div>
  );
}

export default App;
