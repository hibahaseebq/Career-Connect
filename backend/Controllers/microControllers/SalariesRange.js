const parseSalary = (selectedSalaryOption) => {
  switch (selectedSalaryOption) {
    case 'lt50k':
      return [null, 50000]; // Less than $50k
    case '50k-100k':
      return [50000, 100000]; // $50k - $100k
    case '100k-150k':
      return [100000, 150000]; // $100k - $150k
    case '150k-200k':
      return [150000, 200000]; // $150k - $200k
    case 'gt200k':
      return [200000, null]; // More than $200k
    default:
      return [null, null]; // Any or invalid option
  }
};

module.exports = {
  parseSalary
};