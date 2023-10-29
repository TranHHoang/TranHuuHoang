var sum_to_n_a = function (n) {
  return n * (n + 1) / 2;
};

var sum_to_n_b = function (n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

var sum_to_n_c = function (n) {
  return Array.from({ length: n }).reduce((acc, _, id) => acc + id + 1, 0);
};

var sum_to_n_d = function (n) {
  if (n === 0) return 0;
  return n + sum_to_n_c(n - 1);
};
