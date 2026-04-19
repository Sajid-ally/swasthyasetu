export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "excellent":
    case "good":
    case "full":
    case "enabled":
      return "text-green-400";
    case "medium":
    case "limited":
      return "text-yellow-400";
    case "high":
    case "disabled":
      return "text-red-400";
    default:
      return "text-slate-300";
  }
};