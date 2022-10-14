
export function getStatus(id) {
  switch (id) {
    case "aborted":
      return "Abortado";
      break;
    case "started":
      return "Iniciado";
      break;
    case "created":
      return "Criado";
      break;
    case "finished":
      return "Finalizado";
      break;
    default:
      return "default";
      break;
  }
}