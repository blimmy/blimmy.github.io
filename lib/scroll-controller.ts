// UI controls share the active scroll controller; native scrolling is the fallback.
type ScrollController = { moveProject: (direction: number) => void };
let activeController: ScrollController | null = null;

export function registerScrollController(controller: ScrollController) {
  activeController = controller;
  return () => {
    if (activeController === controller) activeController = null;
  };
}

export function moveProject(direction: number) {
  if (!activeController) return false;
  activeController.moveProject(direction);
  return true;
}
