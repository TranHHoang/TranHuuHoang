/** Original version */

interface WalletBalance {
  currency: string;
  amount: number;
  // Missing `blockchain` property
}
interface FormattedWalletBalance {
  // Duplicated declaration, this interface should extends from the above one
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {
  // Empty interface is not desirable, unless we plan to add more props here
}
// (Style) No need to specify the parameter type as 'Props' since React.FC<Props> already infer the parameter's type as 'Props'
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props; // ^--- (Style): We can spread here 
  const balances = useWalletBalances();
  const prices = usePrices();

  // Should not using 'any' type
  // Consider moving function this out of the component to avoid function recreation at every render
  // (Style) No need to type the return type if the TS compiler can infer the type
	const getPriority = (blockchain: any): number => {
	  switch (blockchain) {
      // Should terminate statement with semicolon (consistent with the rest, avoid issues with auto semicolon-insertion)
      // Consider using constant for these magic numbers
	    case 'Osmosis':
	      return 100
	    case 'Ethereum':
	      return 50
	    case 'Arbitrum':
	      return 30
	    case 'Zilliqa':
	      return 20
      // (Style) Can have a fall-through case here
	    case 'Neo':
	      return 20
	    default:
	      return -99
	  }
	} // Add semicolon here

  const sortedBalances = useMemo(() => {
    // (Style) No need to specify the type of parameter, unless TS cannot infer the type
    return balances.filter((balance: WalletBalance) => {
		  const balancePriority = getPriority(balance.blockchain);
      // Unnecessary nested if, can combine the condition with &&
      // ? Where does this variable come from, should be `balancePriority` above
		  if (lhsPriority > -99) {
		     if (balance.amount <= 0) {
		       return true;
		     }
		  }
      // Can just return the condition above
		  return false
    // (Style) No need to specify the type of parameter, unless TS cannot infer the type
		}).sort((lhs: WalletBalance, rhs: WalletBalance) => {
			const leftPriority = getPriority(lhs.blockchain);
		  const rightPriority = getPriority(rhs.blockchain);
		  if (leftPriority > rightPriority) {
		    return -1;
		  } else if (rightPriority > leftPriority) {
		    return 1;
		  }
      // Does not handle the equal case
      // Since `getPriority` function return number, we can just return the result of `leftPriority - rightPriority`
    });
  }, [balances, prices]); // Unnecessary dependency: prices, we don't use it inside the callback function

  // (Style) No need to specify the type of parameter, unless TS cannot infer the type
  // To avoid creating new array on every render, consider using `useMemo` here
  // Unnecessary and unused variable, we can combine this with the previous `sortedBalance`
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    } // Add semicolon here
  }) // Add semicolon here

  // (Style) No need to specify the type of parameter, unless TS cannot infer the type
  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow 
        className={classes.row}
        // Should not use `index` as `key`, unless the `sortedBalances` does not change or never reordered
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    ) // Add semicolon here
  }) // Add semicolon here

  return (
    // Should not spread every and arbitrary props here, unless they are the props of `div` element/component
    // Results in error in TS
    <div {...rest}>
      {/* We can just inline the code define `rows` here */}
      {rows} 
    </div>
  ) // Add semicolon here
}

/** Refactored version */
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface Props extends BoxProps {
  // Empty interface is not desirable, unless we plan to add more props here
}

const PRIORITY = {
  HIGHEST: 100,
  MODERATE: 50,
  NORMAL: 30,
  LOW: 20,
  LOWEST: -99
} as const;

const getPriority = (blockchain: string) => {
  switch (blockchain) {
    case 'Osmosis':
      return PRIORITY.HIGHEST;
    case 'Ethereum':
      return PRIORITY.MODERATE;
    case 'Arbitrum':
      return PRIORITY.NORMAL;
    case 'Zilliqa':
    case 'Neo':
      return PRIORITY.LOW;
    default:
      return PRIORITY.LOWEST;
  }
};

const WalletPage: React.FC<Props> = ({ children, ...rest }) => {
  const balances = useWalletBalances(); // This one should return WalletBalance[], then we can omit the type in every function below
  const prices = usePrices();

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance) => getPriority(balance.blockchain) > PRIORITY.LOWEST && balance.amount <= 0)
      .map<FormattedWalletBalance>((balance) => ({
          ...balance,
          formatted: balance.amount.toFixed()
      }))
      .sort((lhs, rhs) => getPriority(lhs.blockchain) - getPriority(rhs.blockchain));
  }, [balances]); 

  return (
    <div>
      {sortedBalances.map((balance) => {
        const usdValue = prices[balance.currency] * balance.amount;
        return (
          <WalletRow 
            key={balance.currency}
            className={classes.row}
            amount={balance.amount}
            usdValue={usdValue}
            formattedAmount={balance.formatted}
          />
        ) 
      })} 
    </div>
  )
}