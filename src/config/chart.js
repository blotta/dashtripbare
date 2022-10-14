import theme from './theme'

export const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: theme.colors.primaryContainer,
  backgroundGradientToOpacity: 0.2,
  color: (opacity = 1) => `rgba(34, 136, 204, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
};

export const barChartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientFromOpacity: 0.1,
  backgroundGradientTo: theme.colors.primaryContainer,
  backgroundGradientToOpacity: 0,
  color: (opacity = 1) => `rgba(34, 136, 204, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
};
